---
date: 2026-02-21
problem_type: test_failure
component: test
severity: high
symptoms:
  - "Vite manifest not found at: /path/to/project/public/build/manifest.json"
  - "Expected response status code [>=200, <300] but received 500"
  - "Illuminate\Foundation\ViteManifestNotFoundException"
  - Tests pass in parallel with dots showing, then one fails with 500 error
root_cause: config_error
resolution_type: code_fix
tags: [vite, manifest, testing, build, npm]
---

# Vite Manifest Not Found During Tests

## Symptom

Tests fail with 500 error and `ViteManifestNotFoundException`:

```
Illuminate\Foundation\ViteManifestNotFoundException: 
Vite manifest not found at: /home/nckrtl/projects/craft-starterkit/public/build/manifest.json
```

Stack trace shows the error occurs when rendering Blade views that use `@vite()` directive:
```
View: /home/nckrtl/projects/craft-starterkit/resources/views/app.blade.php
```

## Investigation

1. **Attempted:** Check if Vite is configured correctly in `vite.config.ts`
   **Result:** Configuration is correct, but manifest file doesn't exist

2. **Attempted:** Look for manifest in `public/build/`
   **Result:** Directory doesn't exist or is empty

## Failed Approaches

- **Running tests without building first:** Tests fail because Laravel can't find compiled assets
- **Checking vite.config.ts:** Configuration wasn't the issue - missing build artifacts
- **Looking for dev server:** Test environment doesn't run Vite dev server

## Root Cause

Laravel's Vite integration requires compiled assets to exist in `public/build/` when:
1. Running in non-development environment (APP_ENV=testing/production)
2. Using `@vite()` directive in Blade templates
3. Inertia.js pages are rendered (they use `app.blade.php`)

The `composer check` command runs tests that load Inertia pages, which triggers Vite manifest lookup.

## Solution

Build frontend assets before running tests:

```bash
# Install dependencies if needed
npm install

# Build production assets (generates public/build/manifest.json)
npm run build
```

After building, the manifest exists:
```
public/build/
├── manifest.json
├── assets/
│   ├── app-CT4vGe4f.css
│   └── app-CnuyYC0K.js
```

## Prevention

### For CI/CD:
Add build step before test step:
```yaml
- run: npm ci
- run: npm run build
- run: composer check
```

### For Local Development:
If switching between projects or after `git clean`, always run:
```bash
npm install && npm run build
```

### Test Setup:
Consider adding a pre-test check that verifies manifest exists:
```php
beforeAll(function () {
    if (!file_exists(public_path('build/manifest.json'))) {
        throw new \Exception('Vite manifest not found. Run: npm run build');
    }
});
```

## Related

- `docs/solutions/build-errors/vite-build-required.md`
- Laravel Vite documentation: https://laravel.com/docs/vite
