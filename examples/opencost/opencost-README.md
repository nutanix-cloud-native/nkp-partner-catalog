# OpenCost Catalog Example (Multi-Cluster / Centralized Component)

This example demonstrates how to package and test an application that requires a centralized management component along with distributed agents across multiple workload clusters.

## Example Structure

```text
opencost/
  opencost-README.md
  2.4.0/
    metadata.yaml
    kustomization.yaml
    values-central.yaml
    values-agent.yaml
    helmrelease/
      kustomization.yaml
      helmrelease.yaml
      cm.yaml
      opencost-ui-dashboard-cm.yaml
```

## Key Features Demonstrated

### 1. Centralized vs. Workload Configurations
Some applications (like OpenCost, Thanos, or certain security tools) use a hub-and-spoke model.
* **Solution**: The examples here show how to provide different configuration profiles (e.g., `values-central.yaml` vs `values-agent.yaml`) within the catalog application folder, allowing the user to select the appropriate profile based on the cluster type.

### 2. Multi-Cluster Integration Testing (`apptests`)
Testing a hub-and-spoke application requires ensuring that the central component can communicate with the distributed agents.
* **Solution**: This example includes an advanced `apptests` suite (using Ginkgo and Kind) that spins up multiple local clusters, installs the central component on one and the agent on another, and verifies the end-to-end integration. 
* This provides a template for partners building complex multi-cluster applications to plug into the NKP automated testing framework.
