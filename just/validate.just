validate-manifests: nkp-catalog-cli
    "{{ NKP_CATALOG_CLI }}" validate catalog-repository -v=3 --repo-dir="{{ REPO_ROOT }}"
