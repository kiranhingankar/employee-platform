# INC-001 — PostgreSQL Container Availability Test

## Date

2026-08-25

## Environment

Local Docker Compose environment

## Service

PostgreSQL

## Impact

PostgreSQL availability was intentionally interrupted as part of a
container failure and recovery exercise.

No production users were impacted.

## Detection

The PostgreSQL container was stopped intentionally to simulate a
database availability incident.

The following commands were used during investigation:

- `docker ps -a`
- `docker inspect employee-postgres --format '{{.State.Status}}'`
- `docker logs employee-postgres --tail 50`
- `docker inspect employee-postgres --format '{{json .State.Health}}'`

## Investigation

The container was inspected to determine:

1. Container state
2. PostgreSQL logs
3. Health-check status
4. Database startup behavior

The PostgreSQL logs showed:

`received fast shutdown request`

followed by:

`database system is shut down`

During the subsequent startup PostgreSQL reported:

`PostgreSQL Database directory appears to contain a database; Skipping initialization`

This confirmed that the PostgreSQL data directory persisted across
the container restart.

## Root Cause

The service interruption was intentionally caused by stopping the
PostgreSQL container as part of a failure-recovery exercise.

There was no evidence of database corruption or an unexpected
PostgreSQL crash.

## Resolution

The PostgreSQL container was started again using:

`docker start employee-postgres`

The health check subsequently returned:

`Status: healthy`

with:

`/var/run/postgresql:5432 - accepting connections`

## Verification

PostgreSQL was verified as running and healthy.

The health check reported:

- Status: healthy
- Failing streak: 0
- Exit code: 0

## Lessons Learned

- `docker ps` shows running containers.
- `docker ps -a` shows all containers.
- Container state and application health are different concepts.
- Docker health checks provide application-level readiness information.
- PostgreSQL data persisted because the database uses a named Docker volume.
- Logs should be inspected before restarting or recreating a service.