set unstable

# Release oci artifacts for catalog applications
[no-exit-message]
[script]
publish-artifacts registry collection-tag apps: nkp-cli
  tmpdir="$(mktemp -d)"
  if [ -n "{{apps}}" ]; then
    apps_flag="--apps={{apps}}"
  else
    apps_flag=""
  fi
  "{{ NKP_CLI }}" create catalog-bundle --repo-dir "{{ REPO_ROOT }}" --collection-tag "{{collection-tag}}" ${apps_flag} --output-file "$tmpdir/bundle.tar"
  "{{ NKP_CLI }}" push bundle --bundle "$tmpdir/bundle.tar" --to-registry "{{ registry }}"
