# Controllers Directory

Route controllers using Waymaker attributes.

## Requirements

- Use Waymaker attributes (`#[Get]`, `#[Post]`, etc.) - NEVER edit web.php
- Only resourceful methods: `index`, `show`, `create`, `store`, `edit`, `update`, `destroy`
- Always use FormRequest for validation
- Inject Actions for business logic
- Run `php artisan waymaker:generate` after changes
