## Project Structure

### Features Directory (`src/features/[feature_name]/`)

- **pages/**: Main UI entry points for the feature.
- **components/**: Atomic UI or partials used exclusively within this feature.
- **Data Layer:**
- `api.ts`: Pure fetch logic & error handling.
- `db.ts`: IndexedDB setup & CRUD operations.
- `services.ts`: **The Orchestrator**. Connects API/DB with business logic before passing data to the UI.

- **Infrastructure:**
- `router.ts`: Internal route definitions.
- `utils/`: Pure functions (logic only; no DOM/DB/API side effects).
- `types.ts`: Feature-specific shared assets.

### Pages vs. Components Differentiation

- **Structure:** Both use the same folder pattern (`index.ts`, `types.ts`).
- **Domain Rule:** - Use `pages/` **ONLY** if the file is the primary target of a Route (URL entry point).
- Use `components/` if the file is a reusable piece imported by Pages or other Components.

- **Composition:** Pages import and compose Components. **Components are forbidden from importing Pages.**

### Shared Directory (`src/shared/`)

- **layouts.ts**: Core application wrappers (e.g., Sidebar + Content).
- **config/**: Global constants and app configurations.
- **components/ & utils/ & types/**: Global versions accessible by all features.

## Coding Style (Bandhaku Standard)

### Templating Rules

- Use **html`...`** tagged templates for HTML strings in both variables and returns.
- **Do NOT** import `{ html }`.
- **Logic Separation:** Never execute complex functions inside `${...}` within a template.
- **Execution in `${...}` is ONLY allowed if:** It has < 2 parameters, is not an object, and fits on one line.
- Otherwise, you **MUST** store the result in a fragment variable (e.g., `const ItemTemplate = ...`) before inserting it into the main template.

### Naming Conventions

- **Variables:** Use `camelCase`. HTML fragments should be descriptive (e.g., `LabelTemplate`, `ItemContent`).
- **HTML Attributes:** Use `className` or `idTag` for variables holding attribute strings.
- **Booleans:** Prefix with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`).
- **Events:** Prefix with `handle` (e.g., `handleBtnClick`).
- **Constants:** Use `UPPER_SNAKE_CASE` (e.g., `BASE_URL`).
- **Private/Internal:** Prefix with an underscore `_` (e.g., `_idCounter`).
- **Types:** Always use the `T` prefix (e.g., `TDropdownProps`, `TNavItem`).