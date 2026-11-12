# Retina 1.2.0 Prerequisites

Before deploying Retina to the NKP workload cluster, verify the following:

* An existing NKP workload cluster is available.
* kubectl access to the target workload cluster is configured.
* A supported CNI is already installed.
* Helm 3.8 or later is available for manual troubleshooting.
* The cluster can access `ghcr.io` to pull Retina images.
* Linux nodes support the required kernel and eBPF features.

Retina is deployed to the workload cluster. It does not install or replace the existing CNI.

The expected installation namespace is `kube-system`, and the expected Helm release name is `retina`.
