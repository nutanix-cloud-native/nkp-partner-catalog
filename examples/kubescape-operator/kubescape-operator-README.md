# Kubescape Operator Catalog Example

This example demonstrates how to properly configure a **Workspace-scoped** application that deploys cluster-wide resources (such as Custom Resource Definitions or ClusterRoles).

## Example Structure

```text
kubescape-operator/
  kubescape-operator-README.md
  1.29.12/
    metadata.yaml
    kustomization.yaml
    helmrelease.yaml
    helmrelease/
      kustomization.yaml
      helmrelease.yaml
      cm.yaml
```

## Key Features Demonstrated

### 1. Understanding `scope` vs `allowMultipleInstances`
In the NKP catalog `metadata.yaml`, setting the `scope` to `workspace` indicates that the application provides services across multiple projects or the entire cluster. 
* **The Challenge**: If an application creates global CRDs, allowing multiple instances of it to be installed in the same cluster can cause conflicts and race conditions.
* **Solution**: This example sets `allowMultipleInstances: false` in its `metadata.yaml`. This ensures that the NKP UI and backend only permit a single deployment of the application per workspace, preventing deployment collisions and adhering to best practices.

### 2. Fully OCI-Compliant Chart Sources
As the NKP catalog moves away from legacy `HelmRepository` resources (which cause issues in air-gapped environments), this example uses a strictly OCI-compliant `OCIRepository` definition.
* **Solution**: By pulling the chart as an OCI artifact, this application guarantees that it can be cleanly packaged into an air-gapped bundle using the `nkp create catalog-bundle --airgapped` command.