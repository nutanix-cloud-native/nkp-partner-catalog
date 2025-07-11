GOOS := `go env GOOS`
GOARCH := `go env GOARCH`

REPO_ROOT := justfile_directory()
LOCAL_DIR := REPO_ROOT+"/.local"

NKP_CATALOG_CLI_VERSION := "0.2.0"
NKP_CATALOG_CLI := LOCAL_DIR+"/bin/nkp_catalog_cli_v"+NKP_CATALOG_CLI_VERSION
TAG := "v"+NKP_CATALOG_CLI_VERSION
OWNER := "nutanix-cloud-native"
REPO := "nkp-catalog-cli"
ASSET := "catalog_v"+NKP_CATALOG_CLI_VERSION+"_"+GOOS+"_"+GOARCH+".tar.gz"

nkp-catalog-cli:
    [ -f "{{NKP_CATALOG_CLI}}" ] || ( \
        echo "Building {{NKP_CATALOG_CLI}}..." && \
        mkdir -p "{{LOCAL_DIR}}/bin" && \
        gh release download "{{TAG}}" --repo "{{OWNER}}/{{REPO}}" --pattern "{{ASSET}}" && \
        tar -xzf "{{ASSET}}" && mv ./nkp-catalog-cli "{{ NKP_CATALOG_CLI }}" && \
        rm -f "{{ASSET}}" nkp-catalog-cli && \
        echo "Successfully built {{NKP_CATALOG_CLI}}." \
    )
