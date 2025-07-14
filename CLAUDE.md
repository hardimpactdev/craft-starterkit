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
2. `backend/Controllers.mdc` - Controller structure and resourceful methods
3. `backend/Routes.mdc` - Waymaker routing patterns (NO manual routes!)
4. `backend/FormRequests.mdc` - Form validation patterns (NO inline validation!)
5. `backend/DTOs.mdc` - Data Transfer Object patterns
6. `backend/Models.mdc` - Model structure and relationships
7. `backend/Database.mdc` - Migration and seeding guidelines
8. `backend/Enums.mdc` - Enum usage for database values
9. `backend/Middleware.mdc` - Middleware patterns and usage
10. `backend/Testing.mdc` - Pest test requirements

#### For Frontend Features:

1. `frontend/Vue.mdc` - Component structure and patterns
2. `frontend/TypeScript.mdc` - TypeScript conventions and types
3. `frontend/LiftoffUI.mdc` - UI component library usage
4. `frontend/Tailwind.mdc` - Tailwind CSS patterns and utilities
5. `frontend/AutoImports.mdc` - What NOT to import manually
6. `frontend/Routing.mdc` - Using Controllers object for routes
7. `frontend/Forms.mdc` - Form handling with DTOs

### Step 3: Key Rules to Remember

#### Backend:

- **Routes**: Use Waymaker attributes (`#[Get]`, `#[Post]`, etc.) - NEVER edit web.php
- **FormRequests**: Always use FormRequest with DTOs - NEVER validate in controllers
- **Controllers**: Only use resourceful methods (index, show, create, store, edit, update, destroy)
- **Models**: Must be final classes with factories and seeders
- **Enums**: String values, like types, that are stored in the database must be Enums
- **DTOs**: Instead of arrays apply DTOs where possible.
- **Testing**: Every feature MUST include Pest tests

#### Frontend:

- **AppLayout**: Don't fight it - navigation is configured in the backend
- **Components**: Check if liftoff-vue has what you need before creating custom ones
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
php artisan waymaker:generate

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

# Rule Management and Preference Capture

## Overview

You are responsible for maintaining consistency between user instructions and documented rules across this Laravel project. Rules are hierarchical: /.cursor/rules (global) > directory-specific CLAUDE.md files > session instructions.

## Core Responsibilities

### 1. Rule Updates When Instructions Contradict

When a user gives instructions that contradict existing rules:

- Identify the specific rule being contradicted and its location
- Ask: "This contradicts [specific rule] in [file path]. Should I update the rule file to reflect this new preference?"
- If confirmed, update the appropriate rule file with clear comments marking the change
- Example: User says "use snake_case for variables" when rules specify camelCase → Update rule file after confirmation

### 2. Capture New Preferences

When users express new preferences not covered by existing rules:

- Recognize patterns after 2-3 consistent corrections
- Propose rule additions: "I notice you prefer [pattern]. Should I add this to [appropriate rule file]?"
- Suggest specific rule text before adding
- Place rules in the most specific applicable location (directory > global)

### 3. Rule Application Hierarchy

Apply rules with this precedence (highest to lowest):

1. Explicit user override in current session
2. Directory-specific CLAUDE.md (closest to current file)
3. Global rules in /.cursor/rules
4. Laravel framework conventions

## Implementation Guidelines

- **File Updates**: When updating rules, preserve existing structure and use clear section headers
- **Documentation**: Add comments explaining why rules were changed/added with date
- **Validation**: Ensure rule changes don't create conflicts with other rules
- **Scope**: Only update rules for coding patterns, not business logic or architecture decisions
