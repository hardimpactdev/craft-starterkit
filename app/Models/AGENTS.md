# Models Directory

Eloquent models.

## Requirements

- Models must be `final` classes
- Always create corresponding factory in `database/factories/`
- Always create corresponding seeder in `database/seeders/`
- Use explicit relationship method return types
- No need for `$fillable` or `$guarded` (project uses `Model::unguard()` globally, see root AGENTS.md)
