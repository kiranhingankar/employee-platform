# Kube-Proxy Monitoring and Troubleshooting

## Environment

- Kubernetes: Kind local cluster
- Namespace: kube-system
- Monitoring: kube-prometheus-stack
- Metrics endpoint: 172.19.0.2:10249/metrics
- Prometheus job: kube-proxy

## Issue

Prometheus initially could not scrape the kube-proxy metrics endpoint.
The target showed connection refused.

## Investigation

1. Checked the kube-proxy ConfigMap.
2. Inspected the kube-proxy ServiceMonitor and endpoint.
3. Confirmed the endpoint was 172.19.0.2:10249.
4. Checked the kube-proxy pod and DaemonSet.
5. Restored the full config.conf from the saved backup.
6. Configured metricsBindAddress to 0.0.0.0:10249.
7. Restarted the kube-proxy DaemonSet.
8. Verified the new pod was Running and Prometheus target was UP.

## Verification

Check target health:

```promql
up{job="kube-proxy"}
```

Expected value: 1.

Inspect available kube-proxy metric names:

```promql
count by (__name__) ({job="kube-proxy"})
```

Average proxy-rule synchronization duration:

```promql
rate(kubeproxy_sync_proxy_rules_duration_seconds_sum{job="kube-proxy"}[5m])
/
rate(kubeproxy_sync_proxy_rules_duration_seconds_count{job="kube-proxy"}[5m])
```

Pending endpoint changes:

```promql
kubeproxy_sync_proxy_rules_endpoint_changes_pending{job="kube-proxy"}
```

## Lessons Learned

- A running pod does not guarantee its metrics endpoint is reachable.
- Check the ConfigMap, pod, ServiceMonitor, endpoint, and Prometheus target.
- Restore the complete configuration rather than replacing it with a partial config.
- Verify a target using the Prometheus `up` metric after a restart.
- Prometheus metric availability can vary by Kubernetes version.

## Security Note

The metrics listener is configured to bind to all interfaces.
This is suitable only for this controlled local lab unless access is
appropriately restricted. Do not use this setting in production without
reviewing network exposure and access controls.

## Backup Warning

The backup files under `backups/` may contain environment-specific
configuration. Review them for secrets and local details before committing.
