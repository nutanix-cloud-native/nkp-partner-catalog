import assert from 'node:assert/strict';
import test from 'node:test';
import {
  preferNewerVersionedSearchResults,
  presentVersionedSearchResults,
} from './preferNewerVersionedSearchResults.mjs';

function hit(url, score, i, type = 0, page) {
  return {
    document: {i, u: url, t: 'example'},
    type,
    page,
    score,
  };
}

test('lists the same CLI command from newest minor to oldest', () => {
  const results = [
    hit('/docs/cli/2.12/nkp_create_cluster_nutanix', 1, 1),
    hit('/docs/cli/2.13/nkp_create_cluster_nutanix', 1, 2),
    hit('/docs/cli/2.16/nkp_create_cluster_nutanix', 1.001, 3),
    hit('/docs/cli/2.20/nkp_create_cluster_nutanix', 0.9, 4),
  ];
  assert.deepEqual(
    preferNewerVersionedSearchResults(results).map((item) => item.document.u),
    [
      '/docs/cli/2.20/nkp_create_cluster_nutanix',
      '/docs/cli/2.16/nkp_create_cluster_nutanix',
      '/docs/cli/2.13/nkp_create_cluster_nutanix',
      '/docs/cli/2.12/nkp_create_cluster_nutanix',
    ],
  );
});

test('lists versioned non-CLI pages newest first', () => {
  const results = [
    hit('/docs/ai-conformance/2.18', 1, 1),
    hit('/docs/ai-conformance/2.19', 1, 2),
  ];
  assert.deepEqual(
    preferNewerVersionedSearchResults(results).map((item) => item.document.u),
    ['/docs/ai-conformance/2.19', '/docs/ai-conformance/2.18'],
  );
});

test('keeps a higher-scoring unversioned page ahead of versioned copies', () => {
  const results = [
    hit('/docs/cli/2.12/nkp_create_cluster_nutanix', 1, 1),
    hit('/docs/getting-started/creating-nkp-cluster', 5, 2),
    hit('/docs/cli/2.18/nkp_create_cluster_nutanix', 1, 3),
  ];
  assert.deepEqual(
    preferNewerVersionedSearchResults(results).map((item) => item.document.u),
    [
      '/docs/getting-started/creating-nkp-cluster',
      '/docs/cli/2.18/nkp_create_cluster_nutanix',
      '/docs/cli/2.12/nkp_create_cluster_nutanix',
    ],
  );
});

test('compares minors numerically so 2.10 ranks above 2.9', () => {
  const results = [
    hit('/docs/cli/2.9/nkp', 1, 1),
    hit('/docs/cli/2.10/nkp', 1, 2),
  ];
  assert.equal(
    preferNewerVersionedSearchResults(results)[0].document.u,
    '/docs/cli/2.10/nkp',
  );
});

test('does not group unrelated pages that happen to share a version segment', () => {
  const results = [
    hit('/docs/cli/2.18/nkp', 1, 1),
    hit('/docs/ai-conformance/2.18', 1, 2),
  ];
  assert.deepEqual(
    preferNewerVersionedSearchResults(results).map((item) => item.document.u),
    ['/docs/cli/2.18/nkp', '/docs/ai-conformance/2.18'],
  );
});

test('dropdown keeps newest titles when titles already fill the cap', () => {
  const titles = ['2.12', '2.13', '2.14', '2.15', '2.16', '2.17', '2.18', '2.19', '2.20'].map(
    (minor, index) => hit(`/docs/cli/${minor}/nkp_create_cluster_nutanix`, 1, index),
  );
  const heading = hit(
    '/docs/cli/2.20/nkp_create_cluster_nutanix',
    1,
    100,
    1,
    titles[titles.length - 1].document,
  );
  const shown = presentVersionedSearchResults([...titles, heading], 8);
  assert.deepEqual(
    shown.map((item) => item.document.u),
    [
      '/docs/cli/2.20/nkp_create_cluster_nutanix',
      '/docs/cli/2.19/nkp_create_cluster_nutanix',
      '/docs/cli/2.18/nkp_create_cluster_nutanix',
      '/docs/cli/2.17/nkp_create_cluster_nutanix',
      '/docs/cli/2.16/nkp_create_cluster_nutanix',
      '/docs/cli/2.15/nkp_create_cluster_nutanix',
      '/docs/cli/2.14/nkp_create_cluster_nutanix',
      '/docs/cli/2.13/nkp_create_cluster_nutanix',
    ],
  );
  assert.ok(shown.every((item) => item.type === 0));
});

test('places headings under their page when titles do not fill the cap', () => {
  const title = hit('/docs/cli/2.18/nkp_create_cluster_nutanix', 1, 1);
  const heading = hit(
    '/docs/cli/2.18/nkp_create_cluster_nutanix',
    1,
    2,
    1,
    title.document,
  );
  const older = hit('/docs/cli/2.12/nkp_create_cluster_nutanix', 1, 3);
  assert.deepEqual(
    presentVersionedSearchResults([older, title, heading], 8).map((item) => [
      item.document.u,
      item.type,
    ]),
    [
      ['/docs/cli/2.18/nkp_create_cluster_nutanix', 0],
      ['/docs/cli/2.18/nkp_create_cluster_nutanix', 1],
      ['/docs/cli/2.12/nkp_create_cluster_nutanix', 0],
    ],
  );
});
