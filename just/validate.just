REPO_ROOT := justfile_directory()
LOCAL_DIR := REPO_ROOT+"/.local"

NKP_CATALOG_CLI_VERSION := "0.1.1"

NKP_CATALOG_CLI_BIN := LOCAL_DIR+"/bin/nkp_catalog_cli_v"+NKP_CATALOG_CLI_VERSION
TAG := "v"+NKP_CATALOG_CLI_VERSION
OWNER := "nutanix-cloud-native"
REPO := "nkp-catalog-cli"
ASSET := "catalog_v"+NKP_CATALOG_CLI_VERSION+"_linux_amd64.tar.gz"

nkp-catalog-cli-bin:
    @if [ ! -f "{{ NKP_CATALOG_CLI_BIN }}" ]; then \
        echo "Building {{ NKP_CATALOG_CLI_BIN }}..."; \
        mkdir -p "{{ LOCAL_DIR }}/bin"; \
        mkdir -p /tmp/nkp_download; \
        cd /tmp/nkp_download && \
            gh release download "{{ TAG }}" \
                --repo "{{ OWNER }}/{{ REPO }}" \
                --pattern "{{ ASSET }}"; \
        tar -xzf /tmp/nkp_download/"{{ ASSET }}" -C /tmp/nkp_download; \
        mv /tmp/nkp_download/nkp-catalog-cli "{{ NKP_CATALOG_CLI_BIN }}"; \
        chmod +x "{{ NKP_CATALOG_CLI_BIN }}"; \
        echo "Successfully built {{ NKP_CATALOG_CLI_BIN }}."; \
    else \
        echo "{{ NKP_CATALOG_CLI_BIN }} already exists."; \
    fi

# Recipe to validate manifests.
# It depends on `nkp-catalog-cli-bin` to ensure the tool is available before running.
validate-manifests: nkp-catalog-cli-bin
    "{{ NKP_CATALOG_CLI_BIN }}" validate catalog-repository -v=3 --repo-dir="{{ REPO_ROOT }}"
