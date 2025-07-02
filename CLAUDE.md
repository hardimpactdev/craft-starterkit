# Project Development Guide for AI Assistants

## Important: Cursor Rules Integration

This project uses Cursor AI editor with specific development rules located in `.cursor/rules/`. When implementing any feature, you MUST:

1. **Check the Rules Index First**: Start by reviewing `.cursor/rules/Rules.mdc` for an overview of the technology stack and available rule files.

2. **Follow the Appropriate Rules**: Based on the feature you're implementing, consult the relevant rule files:
   - Backend work → Check `.cursor/rules/backend/` directory
   - Frontend work → Check `.cursor/rules/frontend/` directory

3. **Never Assume Patterns**: Even if you think you know Laravel or Vue patterns, this project has specific conventions that override standard practices.

## When Implementing New Features

### Step 1: Understand the Request
- Identify if the feature requires backend work, frontend work, or both
- Determine which parts of the stack will be affected

### Step 2: Consult the Rules
Before writing any code, review these rule files in order:

#### For Backend Features:
1. `backend/General.mdc` - Overall PHP/Laravel conventions
2. `backend/Routes.mdc` - Waymaker routing patterns (NO manual routes!)
3. `backend/Validation.mdc` - FormRequest and DTO patterns (NO inline validation!)
4. `backend/Database.mdc` - Model and migration guidelines
5. `backend/Testing.mdc` - Pest test requirements

#### For Frontend Features:
1. `frontend/Vue.mdc` - Component structure and patterns
2. `frontend/LiftoffUI.mdc` - UI component library usage
3. `frontend/AutoImports.mdc` - What NOT to import manually
4. `frontend/Routing.mdc` - Using Controllers object for routes
5. `frontend/Forms.mdc` - Form handling with DTOs

### Step 3: Key Rules to Remember

#### Backend:
- **Routes**: Use Waymaker attributes (`#[Get]`, `#[Post]`, etc.) - NEVER edit web.php
- **Validation**: Always use FormRequest with DTOs - NEVER validate in controllers
- **Controllers**: Only use resourceful methods (index, show, create, store, edit, update, destroy)
- **Models**: Must be final classes with factories and seeders
- **Testing**: Every feature MUST include Pest tests

#### Frontend:
- **AppLayout**: Don't fight it - navigation is configured in the backend
- **Components**: Check if Liftoff-UI has what you need before creating custom ones
- **Auto-imports**: Don't manually import Vue methods, Inertia components, or common utilities
- **Routes**: Use `Controllers.ControllerName.methodName()` - NEVER hardcode URLs
- **Forms**: Expect form props from backend DTOs - don't create empty forms

### Step 4: Common Pitfalls to Avoid

1. **Creating custom layouts** when AppLayout should be used
2. **Hardcoding routes** instead of using Waymaker's Controllers object
3. **Inline validation** instead of FormRequest + DTO pattern
4. **Manual imports** of auto-imported components/methods
5. **Fighting the framework** instead of following established patterns

### Step 5: Testing Requirements

- Run `npm run build` to catch TypeScript/import errors
- Run `composer analyse` for PHP static analysis
- Write Pest tests for all new features
- Test with dev server running to catch runtime errors

## Quick Command Reference

```bash
# After adding/modifying controllers
php artisan waymaker:make

# Static analysis
composer analyse

# Run tests
php artisan test

# Build frontend
npm run build

# Development server
npm run dev
```

## Remember

This project prioritizes consistency over personal preferences. When in doubt:
1. Check the `.cursor/rules/` directory
2. Follow existing patterns in the codebase
3. Ask for clarification before making assumptions
4. Test thoroughly before considering a feature complete

The rules exist to maintain code quality and consistency across the entire team. Following them ensures smoother development and fewer conflicts.