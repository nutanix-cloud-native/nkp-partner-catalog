set unstable

# Release oci artifacts for catalog applications
[no-exit-message]
[script]
publish-artifacts release-spec registry: nkp-cli
  {{ NKP_CLI }} experimental catalog release --release-spec {{ release-spec }} --repo-dir "{{ REPO_ROOT }}" --push-to-registry {{ registry}}
