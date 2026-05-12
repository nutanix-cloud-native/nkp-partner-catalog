# Docs recipes for nkp-partner-catalog.
# docs/source and docs/site live on main; built output is published to gh-pages.

[script]
docs-build base_url='/nkp-partner-catalog/':
    ROOT="{{ justfile_directory() }}"
    mkdir -p "$ROOT/docs/site/static/schemas/v1"
    rsync -a --delete "$ROOT/docs/source/schemas/v1/" "$ROOT/docs/site/static/schemas/v1/"
    cd "$ROOT/docs/site"
    npm ci --prefer-offline
    BASE_URL="{{ base_url }}" npm run build

[script]
docs-local host='0.0.0.0' port='3000' base_url='/':
    ROOT="{{ justfile_directory() }}"
    mkdir -p "$ROOT/docs/site/static/schemas/v1"
    rsync -a --delete "$ROOT/docs/source/schemas/v1/" "$ROOT/docs/site/static/schemas/v1/"
    cd "$ROOT/docs/site"
    npm ci --prefer-offline
    BASE_URL="{{ base_url }}" npm run build
    BASE_URL="{{ base_url }}" npm run docusaurus -- serve --dir build --host "{{ host }}" --port "{{ port }}"

[script]
docs-deploy branch='gh-pages' repo='git@github.com:nutanix-cloud-native/nkp-partner-catalog.git': (docs-build)
    ROOT="{{ justfile_directory() }}"
    DEPLOY_DIR="$ROOT/.docs-deploy"

    if [ -d "$DEPLOY_DIR/.git" ]; then
        git -C "$DEPLOY_DIR" fetch origin && git -C "$DEPLOY_DIR" reset --hard origin/{{ branch }}
    else
        git clone --branch {{ branch }} --single-branch --depth 1 {{ repo }} "$DEPLOY_DIR"
    fi

    rsync -a --delete --exclude='.git' "$ROOT/docs/site/build/" "$DEPLOY_DIR/"
    cd "$DEPLOY_DIR"
    git add -A
    echo ""
    echo "=== Changes staged in $DEPLOY_DIR ==="
    git --no-pager diff --cached --stat
    echo ""
    echo "To publish, run:"
    echo "  cd $DEPLOY_DIR"
    echo "  git commit -m 'docs: update site'"
    echo "  git push origin {{ branch }}"
