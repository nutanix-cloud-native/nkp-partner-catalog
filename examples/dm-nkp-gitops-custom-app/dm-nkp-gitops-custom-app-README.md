# Custom App Catalog Example: dm-nkp-gitops-custom-app

This application serves as a comprehensive example demonstrating how to address common validation and registry challenges when onboarding an application to the NKP Partner Catalog.

## Example Structure

```text
dm-nkp-gitops-custom-app/
  dm-nkp-gitops-custom-app-README.md
  0.1.0/
    .bloodhound.yaml
    metadata.yaml
    kustomization.yaml
    helmrelease.yaml
    values.yaml
    helmrelease/
      kustomization.yaml
      helmrelease.yaml
      cm.yaml
```

## Key Features Demonstrated

### 1. Handling Custom Resource Validation Exceptions (`.bloodhound.yaml`)
Many applications deploy Custom Resources (CRs) that depend on external controllers (such as Prometheus `ServiceMonitor` or cert-manager `Certificate`). By default, the `nkp validate catalog-repository` command will fail when it encounters these CRs because it does not have the corresponding CRDs loaded.
* **Solution**: This example includes a `.bloodhound.yaml` file in the application version directory. This file instructs the validation tool to skip or allow specific types (e.g., `monitoring.coreos.com/v1/ServiceMonitor`), ensuring the validation passes successfully in CI/CD pipelines.

### 2. OCI Registry and Image Digest Best Practices
Deploying from Docker Hub can lead to rate-limiting issues in production environments. Additionally, using mutable tags (like `latest` or `v1.0.0`) can cause inconsistencies if the upstream image changes.
* **Solution**: The `helmrelease.yaml` and `values.yaml` in this example demonstrate pulling images from the GitHub Container Registry (`ghcr.io`). It also explicitly uses an **immutable SHA256 digest** instead of a tag to guarantee reproducible deployments and improve security posture.

### 3. Proper OCIRepository References
When referencing OCI charts, Helm maps the `+` character in semantic versions to an underscore `_`. This example demonstrates how to correctly format the `OCIRepository` resource tag (e.g. `0.1.0_sha-960eb32`) so it resolves correctly without breaking validation.