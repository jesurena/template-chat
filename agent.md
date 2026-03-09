# Agent Configuration - AppDev Central

## 🎨 Color Theme
Use these CSS variables or Tailwind classes for all UI elements to ensure a premium, consistent look:

- **Primary**: `#0F2A44` (Deep Navy - `--primary`, `bg-primary`, `text-primary`)
- **Accent 1**: `#1677ff` (Electric Blue - `--accent-1`, `bg-accent-1`, `text-accent-1`)
- **Accent 2**: `#FF8A3D` (Vibrant Orange - `--accent-2`, `bg-accent-2`, `text-accent-2`)
- **Neutral**: `#F8FAFC` (Ghost White - `--neutral`, `bg-neutral`, `text-neutral`)

## 📁 Directory Structure Rules
Maintain the following structure for all new files and refactors:

```text
/appdev-central
├── app/               # Next.js 15 App Router (auth, dashboard, api)
│   └── landingcomponents/ # Specific components for the landing/marketing page
├── components/        # General feature-based components (Avatar, Table, Users, etc.)
├── lib/               # API configuration (axios, queryClient)
├── services/          # Pure business logic and API calls
├── hooks/             # Custom React hooks (TanStack Query)
├── interface/         # TypeScript definitions (matching backend PascalCase)
├── utils/             # Helpers (formatters, validators)
├── public/            # Static assets
└── styles/            # Global Tailwind/CSS layers
```

## ✨ Common Components

### 1. StatusChip (Table Status)
Always use the `StatusChip` component for boolean statuses in tables (Active/Inactive).
- **Location**: `@/components/Table/StatusChip`
- **Props**: `status: boolean`
- **Usage**: `<StatusChip status={record.isActive} />`

### 2. UserAvatar (Profile Pictures & Initials)
Always use `UserAvatar` for any user-related profile icon. It handles initials with a deterministic background if the image is missing.
- **Location**: `@/components/Avatar/UserAvatar`
- **Props**: `src`, `domainAccount`, `name`, `size`
- **Usage**: `<UserAvatar src={user.GAvatar} domainAccount={user.DomainAccount} size={40} />`

## 🛠️ Implementation Guidelines

1.  **Styling**: Always use the defined theme colors and Tailwind 4 utility classes. Avoid hardcoded hex values in components.
2.  **Components**: Prioritize creating reusable components in `components/` and using existing ones.
3.  **Tables**: Consistently use `StatusChip` for boolean flags and `UserAvatar` for user entries.
4.  **Logic**: Keep complex business logic and raw API calls in `services/`, not in the components.
5.  **Naming**: Use `PascalCase` for components and `camelCase` for hooks/utils.
6.  **Forms**: Exclusively use `Form` and `Input` from `antd` for forms; implement clear validation rules.
7.  **Buttons**: Always use `Button` from `antd` instead of standard HTML `<button>` elements for consistency.
8.  **Data**: Always use organized TanStack Query hooks in `hooks/` (e.g., `hooks/users/`).
9.  **Types/Interfaces**: Refer to `@/interface/` for the correct PascalCase backend property names (e.g., `AccountID`, `AccountName`).
10. **Notifications**: When using `notification` from `antd`, always provide both `title` and `description`. Placement must be `topRight`.
11. **Modals**: Keep `Modal` titles as simple strings. Avoid complex custom header structures to maintain a clean layout.
12. **Route-Specific Components**: Use folders within `app/` (like `app/landingcomponents/` or `app/chat/components/`) for UI elements that are strictly used within that specific route. Use the global `components/` folder for elements shared across multiple features.
