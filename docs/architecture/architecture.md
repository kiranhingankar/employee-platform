# Employee Platform Architecture

## High-Level Architecture

```text
Developer
   |
   v
GitHub
   |
   v
GitHub Actions
   |
   +--> Testing
   +--> SAST
   +--> Dependency Scan
   +--> Secret Scan
   +--> Docker Build
   +--> Image Scan
   |
   v
Container Registry
   |
   v
Kubernetes
   |
   +--> Frontend
   +--> Backend
   +--> PostgreSQL
   +--> Redis
   |
   v
Monitoring
   |
   +--> Prometheus
   +--> Grafana