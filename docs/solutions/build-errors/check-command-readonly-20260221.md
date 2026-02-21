---
date: 2026-02-21
problem_type: workflow
component: config
severity: medium
symptoms:
  - "composer check command modifies files unexpectedly"
  - "Files changed after running verification command"
  - "check command includes rector, lint, oxlint --fix"
root_cause: wrong_pattern
resolution_type: config_change
tags: [composer, scripts, workflow, check, fix, ci]
---

# Check Command Should Be Read-Only

## Symptom

The `composer check` command was modifying files instead of just verifying:
- Ran `rector` (applies transformations)
- Ran `lint` (formats code with Pint)
- Ran `oxlint --fix` (auto-fixes JS/TS)

This violates the principle that a "check" command should be read-only verification.

## Investigation

1. **Attempted:** Keep combined command with all tools
   **Result:** Command modifies working tree, surprising in CI context

2. **Attempted:** Use `--dry-run` flags where available
   **Result:** Not all tools support dry-run (Pint has `--test`, but oxlint doesn't have equivalent)

## Failed Approaches

- **Single command with mutating tools:** Changes files unexpectedly
- **Using --dry-run flags:** Inconsistent support across tools
- **Documenting behavior:** Still violates principle of least surprise

## Root Cause

Quality tools fall into two categories:
1. **Verification tools:** Exit with non-zero if issues found (test, analyse, lint --test)
2. **Mutation tools:** Modify files to fix issues (rector, lint, oxlint --fix)

Mixing both in a "check" command creates confusion about what the command does.

## Solution

Split into two commands:

```json
{
    "scripts": {
        "check": "composer test && composer analyse && bunx oxlint@latest && bun run oxfmt --check resources/",
        "fix": "composer rector && composer lint && bunx oxlint@latest --fix --fix-suggestions && bun run oxfmt resources/"
    }
}
```

### check (Read-Only)
- `composer test` - Runs tests (exit code non-zero if failures)
- `composer analyse` - PHPStan analysis (exit code non-zero if errors)
- `bunx oxlint@latest` - Lint JS/TS (exit code non-zero if issues)
- `bun run oxfmt --check` - Check formatting (exit code non-zero if misformatted)

### fix (Mutating)
- `composer rector` - Apply code upgrades
- `composer lint` - Format PHP with Pint
- `bunx oxlint@latest --fix` - Auto-fix JS/TS issues
- `bun run oxfmt resources/` - Format JS/TS

## Prevention

### Naming Convention:
- **check/verify/test:** Read-only, exit code indicates status
- **fix/format/update:** Modifies files, should not be run in CI verification

### CI/CD Pipeline:
```yaml
# Verification (read-only)
- name: Check code quality
  run: composer check

# Fix (only if check fails and auto-fix is desired)
- name: Fix issues
  if: failure()
  run: composer fix
```

### Documentation:
Always document command behavior:
```markdown
### Code Quality

```bash
composer check            # Run tests, analyse, lint (read-only verification)
composer fix              # Apply auto-fixes (rector, lint, format)
```
```

## Related

- This project's `composer.json` scripts section
- `docs/solutions/patterns/critical-patterns.md`
