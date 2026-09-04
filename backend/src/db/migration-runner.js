const fs = require('fs');
const path = require('path');

const { pool } = require('./postgres');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(client) {
  const result = await client.query(`
    SELECT migration_name
    FROM schema_migrations
    ORDER BY id;
  `);

  return new Set(result.rows.map((row) => row.migration_name));
}

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();
}

async function runMigrations() {
  const client = await pool.connect();

  try {
    await ensureMigrationTable(client);

    const appliedMigrations = await getAppliedMigrations(client);
    const migrationFiles = getMigrationFiles();

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        console.log(`Migration already applied: ${migrationFile}`);
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');

      console.log(`Applying migration: ${migrationFile}`);

      await client.query('BEGIN');

      try {
        await client.query(migrationSql);

        await client.query(
          `
          INSERT INTO schema_migrations (migration_name)
          VALUES ($1);
          `,
          [migrationFile]
        );

        await client.query('COMMIT');

        console.log(`Migration applied successfully: ${migrationFile}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('Database migrations completed successfully.');
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('Database migration failed:', error.message);

      await pool.end().catch(() => {});

      process.exit(1);
    });
}

module.exports = {
  runMigrations,
};