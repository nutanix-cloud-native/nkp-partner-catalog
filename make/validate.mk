REPO_ROOT := $(CURDIR)
LOCAL_DIR := $(REPO_ROOT)/.local
NKP_CATALOG_CLI_VERSION ?= 0.1.1# TODO replace with nkp-catalog-cli stable version
NKP_CATALOG_CLI_BIN := $(LOCAL_DIR)/bin/nkp_catalog_cli_v$(NKP_CATALOG_CLI_VERSION)
TAG := v$(NKP_CATALOG_CLI_VERSION)
OWNER := nutanix-cloud-native
REPO := nkp-catalog-cli
ASSET := catalog_v$(NKP_CATALOG_CLI_VERSION)_linux_amd64.tar.gz

$(NKP_CATALOG_CLI_BIN):
	mkdir -p $(dir $@)
	mkdir -p /tmp/nkp_download
	cd /tmp/nkp_download && \
		gh release download $(TAG) \
			--repo $(OWNER)/$(REPO) \
			--pattern $(ASSET)
	tar -xzf /tmp/nkp_download/$(ASSET) -C /tmp/nkp_download
	mv /tmp/nkp_download/nkp-catalog-cli $@
	chmod +x $@

.PHONY: validate-manifests
validate-manifests: $(NKP_CATALOG_CLI_BIN)
	$(NKP_CATALOG_CLI_BIN) validate catalog-repository -v=3 --repo-dir=$(CURDIR)
