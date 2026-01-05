# Actions Directory

Business logic classes using the Action pattern. See `/.ai/rules/backend/Actions.mdc` for rules.

## Quick Reference

```php
<?php

declare(strict_types=1);

namespace App\Actions\Feature;

final readonly class DoSomething
{
    public function __construct(
        private SomeService $service,
    ) {}

    public function handle(Model $model, Data $data): Result
    {
        // Single business operation
    }
}
```

**Required:** `final readonly`, `declare(strict_types=1)`, single `handle()` method.
