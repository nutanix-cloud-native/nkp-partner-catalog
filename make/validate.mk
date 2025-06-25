REPO_ROOT := $(CURDIR)
LOCAL_DIR := $(REPO_ROOT)/.local
NKP_CATALOG_CLI_VERSION ?= 0.15.0 # TODO replace with nkp-catalog-cli version
NKP_CATALOG_CLI_BIN := $(LOCAL_DIR)/bin/nkp_catalog_cli_v$(NKP_CATALOG_CLI_VERSION)

# TODO : verify the download link once release is available
$(NKP_CATALOG_CLI_BIN):
	mkdir -p `dirname $@`
	curl -fsSL https://downloads.d2iq.com/nkp_catalog_cli/nkp_catalog_cli_v$(NKP_CATALOG_CLI_VERSION)_linux_amd64.tar.gz | tar xz -O > $@
	chmod +x $@

.PHONY: validate-manifests
validate-manifests: $(NKP_CATALOG_CLI_BIN)
	$(NKP_CATALOG_CLI_BIN)