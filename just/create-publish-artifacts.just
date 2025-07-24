ARTIFACT_BUNDLE := REPO_ROOT+"/nkp-partner-catalog.tar"
OCI_REGISTRY := "ghcr.io/nutanix-cloud-native"

create-publish-artifacts-1: nkp-cli
    "{{ NKP_CLI }}" create catalog-bundle --repo-dir "{{ REPO_ROOT }}" --collection-tag ${COLLECTION_TAG} --constraint=${CONSTRAINT} --apps=${APPS} && \
    "{{ NKP_CLI }}" push bundle --bundle "{{ ARTIFACT_BUNDLE }}" --to-registry "{{ OCI_REGISTRY }}"

create-publish-artifacts: nkp-cli
  [ -n "${COLLECTION_TAG:-}"] && echo "COLLECTION_TAG environment variable is not set" && exit 1; \
  [ -n "${APPS:-}" ] && [ -n "${CONSTRAINT:-}" ] && echo "Only one of APPS or CONSTRAINT may be set" && exit 1; \
  "{{ NKP_CLI }}" create catalog-bundle --repo-dir "{{ REPO_ROOT }}" --collection-tag ${COLLECTION_TAG} ${APPS:+--apps=${APPS}} ${CONSTRAINT:+--constraint=${CONSTRAINT}} && \
  "{{ NKP_CLI }}" push bundle --bundle "{{ ARTIFACT_BUNDLE }}" --to-registry "{{ OCI_REGISTRY }}"
