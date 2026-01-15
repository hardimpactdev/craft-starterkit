# Actions Directory

Business logic classes using the Action pattern.

## Structure

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

## Requirements

- Always `final readonly`
- Always `declare(strict_types=1)`
- Single `handle()` method only
- Constructor injection for dependencies
- Organize by domain: `Actions/Orders/`, `Actions/Users/`
