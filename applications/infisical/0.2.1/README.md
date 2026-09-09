# Infisical

[Infisical](https://infisical.com) is an open-source secrets management platform. It gives your applications and infrastructure a central, auditable place to store and consume secrets, issue PKI certificates from an internal CA, and manage encryption keys (KMS), with versioning, granular RBAC, dynamic secrets, and automatic rotation.

Deployed from the NKP Partner Catalog, Infisical runs entirely inside your workload cluster: the application, a bundled Redis (password-protected and restricted by NetworkPolicy), and a PostgreSQL database provisioned through the NKP CloudNativePG operator.

## Prerequisites

- The **CloudNativePG** platform application enabled in the workspace or cluster (ships with NKP). The chart creates a `postgresql.cnpg.io/v1` Cluster for its database.
- A default StorageClass (or set `postgres.cnpg.storageClass`) for the database volume (20Gi by default).
- DNS for your chosen hostname pointing at the cluster's Traefik ingress (the chart uses the `kommander-traefik` ingress class).

## Getting started

1. Enable Infisical from the catalog for your workspace.
2. Set these values (both are required; the install fails with a clear message if `config.siteUrl` is left empty):
   - `config.siteUrl`: the external origin users will reach Infisical at, scheme and hostname only (e.g. `https://infisical.example.com`). Infisical cannot be served under a path prefix.
   - `ingress.host`: the hostname for the ingress route (normally the host part of `siteUrl`)
3. Deploy and wait for the application to become ready. Database migrations run automatically before the app starts.
4. Open `config.siteUrl` in a browser and create the initial admin account.

From there, create a project, add secrets, and connect clients: the [Kubernetes operator](https://infisical.com/docs/integrations/platforms/kubernetes/overview) to sync secrets into cluster workloads, the CLI, SDKs, or the REST API. See the [documentation](https://infisical.com/docs) for guides on PKI, KMS, dynamic secrets, and integrations.

## Configuration notes

- **Generated credentials**: `ENCRYPTION_KEY`, `AUTH_SECRET`, and the Redis password are generated on first install and persisted in the release Secret (`<release>-secrets`). Do not delete this Secret; losing `ENCRYPTION_KEY` makes existing encrypted data unrecoverable. You can supply your own values via `secrets.encryptionKey` / `secrets.authSecret` instead.
- **Database**: sized via `postgres.cnpg.instances` and `postgres.cnpg.storageSize`. To use an external PostgreSQL instead, set `postgres.cnpg.enabled=false` and provide `postgres.externalConnectionUri`.
- **Cache/queue backend**: the chart bundles Valkey (the open-source Redis-compatible fork). To use an external Redis or Valkey, set `redis.enabled=false` and provide `secrets.redisUrl`.
- **Application version**: override `image.tag` to run a newer Infisical release than the chart's default; a chart update is not required for app version bumps.
- **Extra environment variables**: use `extraEnv` to pass additional configuration such as SMTP settings (see the values file for an example).
- **Telemetry** is disabled by default (`config.telemetryEnabled`).

## Air-gapped environments

Infisical itself runs fully offline: no external services are required at runtime and telemetry is off by default (outbound-dependent features such as third-party sync integrations naturally need connectivity to their targets). For image pulls, mirror these into your private registry:

- `infisical/infisical:v0.162.11` (repository/tag configurable via `image.*`)
- `valkey/valkey:8.1-alpine` (configurable via `redis.image.*`)
- `busybox:1.36` (database wait init container)
- The PostgreSQL operand image used by your CloudNativePG operator installation

## Support

- Documentation: https://infisical.com/docs
- Source: https://github.com/Infisical/infisical
