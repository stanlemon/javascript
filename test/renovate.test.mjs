import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

// Use the exact lockfile installation for both the schema and behavior checks.
const require = createRequire(import.meta.url);
const renovatePackage = require.resolve('renovate/package.json');
const renovateDirectory = join(dirname(renovatePackage), 'dist');
const JSON5 = createRequire(renovatePackage)('json5');

// Renovate has no public rule-evaluation API. Isolate its internal adapter
// here so the tests exercise real defaults, presets, matching and precedence.
const { getConfig } = await import(pathToFileURL(join(renovateDirectory, 'config/defaults.js')));
const { resolveConfigPresets } = await import(pathToFileURL(join(renovateDirectory, 'config/presets/index.js')));
const { mergeChildConfig } = await import(pathToFileURL(join(renovateDirectory, 'config/utils.js')));
const { applyPackageRules } = await import(pathToFileURL(join(renovateDirectory, 'util/package-rules/index.js')));
const source = JSON5.parse(readFileSync(new URL('../renovate.json5', import.meta.url), 'utf8'));
const { config: resolved } = await resolveConfigPresets(source);
const config = mergeChildConfig(getConfig(), resolved);

async function evaluate(overrides = {}) {
  return applyPackageRules({
    ...structuredClone(config),
    manager: 'npm', datasource: 'npm', depType: 'dependencies',
    depName: 'example-package', packageName: 'example-package',
    currentVersion: '2.0.0', updateType: 'minor', ...overrides,
  });
}

function assertCiGate(result) {
  assert.equal(result.ignoreTests, false, 'CI failures must block automerge');
  assert.equal(result.internalChecksAsSuccess, false, 'release age alone must not enable automerge');
  assert.equal(result.platformAutomerge, false, 'Renovate must enforce these rules');
}

for (const dependency of [
  { manager: 'npm', datasource: 'npm', packageName: '@testing-library/jest-dom', depType: 'devDependencies' },
  { manager: 'npm', datasource: 'npm', packageName: 'react' },
  { manager: 'maven', datasource: 'maven', packageName: 'com.google.guava:guava' },
  { manager: 'github-actions', datasource: 'github-tags', packageName: 'actions/checkout' },
]) {
  test(`${dependency.packageName} majors require manual review`, async () => {
    const result = await evaluate({ ...dependency, depName: dependency.packageName, updateType: 'major' });
    assert.equal(result.automerge, false);
    assert.equal(result.automergeType, 'pr');
    // The best-practices npm preset contributes a three-day soak.
    assert.equal(result.minimumReleaseAge, dependency.datasource === 'npm' ? '3 days' : '7 days');
    assertCiGate(result);
  });
}

for (const updateType of ['minor', 'patch']) {
  test(`stable ${updateType} updates use the three-day branch fast path`, async () => {
    const result = await evaluate({ updateType });
    assert.equal(result.automerge, true);
    assert.equal(result.automergeType, 'branch');
    assert.equal(result.minimumReleaseAge, '3 days');
    assert.deepEqual(result.schedule, ['at any time']);
    assertCiGate(result);
  });
  test(`pre-1.0 ${updateType} updates remain manual`, async () => {
    const result = await evaluate({ currentVersion: '0.5.0', updateType });
    assert.equal(result.automerge, false);
    assert.equal(result.groupSlug, 'pre-1-updates');
    assertCiGate(result);
  });
}

test('Node runtime majors require review after seven months', async () => {
  const result = await evaluate({ manager: 'nvm', datasource: 'node-version', depName: 'node', packageName: 'node', currentVersion: '24.0.0', updateType: 'major' });
  assert.equal(result.automerge, false);
  assert.equal(result.minimumReleaseAge, '7 months');
  assert.equal(result.groupSlug, 'node-major-updates');
  assertCiGate(result);
});

test('peer dependency updates stay disabled', async () => {
  for (const updateType of ['major', 'minor', 'patch']) {
    const result = await evaluate({ depType: 'peerDependencies', updateType });
    assert.equal(result.enabled, false, updateType);
  }
});

for (const updateType of ['digest', 'pin', 'pinDigest']) {
  test(`${updateType} maintenance uses the three-day branch fast path`, async () => {
    const result = await evaluate({ updateType });
    assert.equal(result.automerge, true);
    assert.equal(result.automergeType, 'branch');
    assert.equal(result.minimumReleaseAge, '3 days');
    assertCiGate(result);
  });
}

test('lockfile maintenance has no release delay and stays monthly', async () => {
  const result = await evaluate({ updateType: 'lockFileMaintenance' });
  assert.equal(result.automerge, true);
  assert.equal(result.automergeType, 'branch');
  assert.equal(result.minimumReleaseAge, null);
  assert.deepEqual(result.schedule, ['* 8 1 * *']);
  assertCiGate(result);
});

test('replacement updates require manual review', async () => {
  const result = await evaluate({ updateType: 'replacement' });
  assert.equal(result.automerge, false);
  assert.equal(result.groupSlug, 'review-maintenance');
  assertCiGate(result);
});

test('security fixes bypass the soak but keep the CI gate', async () => {
  const result = mergeChildConfig(await evaluate(), config.vulnerabilityAlerts);
  assert.equal(result.automerge, true);
  assert.equal(result.automergeType, 'branch');
  assert.equal(result.minimumReleaseAge, null);
  assert.equal(result.vulnerabilityFixStrategy, 'lowest');
  assertCiGate(result);
});
