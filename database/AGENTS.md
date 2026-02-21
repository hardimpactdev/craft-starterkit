# Database Conventions

## Migrations

### Naming
- `create_[table]_table` for new tables
- `add_[column]_to_[table]_table` for adding columns
- `update_[column]_in_[table]_table` for modifying columns
- `drop_[column]_from_[table]_table` for removing columns

### Column Types
- UUIDs for primary keys (`$table->uuid('id')->primary()`) if project uses UUIDs
- `$table->foreignUuid()` / `$table->foreignId()` for relationships (match PK type)
- `$table->string()` with explicit length for bounded text
- `$table->text()` only for unbounded content
- `$table->timestamp()` over `$table->dateTime()` — Laravel casts work better

### Index Strategy
- Always index foreign keys (Laravel does this automatically with `foreignId`/`foreignUuid`)
- Add indexes on columns used in `where`, `orderBy`, or `groupBy`
- Composite indexes for queries filtering on multiple columns — column order matters (most selective first)
- Unique constraints at database level, not just validation

### Rollback Safety
- Every `up()` must have a working `down()`
- Test rollbacks: `php artisan migrate:rollback --step=1`
- Never drop columns in production without a data migration plan

### SQLite Gotchas
- **Index names survive table renames** — use explicit original index names (string), not column-based shorthand (array) when dropping indexes after a table rename
- **No DROP FOREIGN KEY** — guard `dropForeign()` with `DB::getDriverName() !== 'sqlite'`
- Test with SQLite (Pest/Orchestra Testbench uses it) before assuming migrations work

## Factories

### Structure
- One factory per model, in `database/factories/`
- Name: `{Model}Factory`

### States
- Use states for specific scenarios: `->suspended()`, `->verified()`, `->withPosts()`
- Default state should be the most common "happy path" record
- Chain states: `User::factory()->verified()->withPosts()->create()`

### Relationships
- Define relationship methods on the factory: `->has(Post::factory()->count(3))`
- Use `for()` for belongs-to: `Post::factory()->for($user)->create()`
- Avoid creating unnecessary related models in the default definition

### Data Quality
- Use realistic data via Faker (not "test123" or "foo@bar.com")
- Use `fake()->unique()` for fields with unique constraints
- Sequences for varied data: `->sequence(['status' => 'active'], ['status' => 'inactive'])`

## Seeders

### Idempotency
- Use `firstOrCreate()` or `updateOrCreate()` — never blind `create()`
- Seeders must be safe to run multiple times

### Environment-Aware
- Check `app()->environment()` for environment-specific data
- Production seeders: only essential data (roles, permissions, settings)
- Development seeders: include sample data for testing UI

### Structure
- Call child seeders from `DatabaseSeeder`
- One seeder per domain/feature
- Use factories inside seeders (not raw DB inserts)
