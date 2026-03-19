# Agent Configuration - AppDev Central

## 🎨 Color Theme & Design System
All UI elements must use the semantic theme variables defined in `app/globals.css`. **NEVER** use hardcoded hex colors or arbitrary pixel values in components.

- **Background**: `bg-background` (`--background`)
- **Foreground**: `text-foreground` (`--foreground`)
- **Primary**: `bg-primary`, `text-primary` (`--primary`)
- **Accent 1**: `bg-accent-1`, `text-accent-1` (`--accent-1`)
- **Accent 2**: `bg-accent-2`, `text-accent-2` (`--accent-2`)
- **Neutral**: `bg-neutral`, `text-neutral` (`--neutral`)
- **Border**: `border-border` (`--border`)
- **Sidebar**: `bg-sidebar` (`--sidebar-bg`)
- **Chat BG**: `bg-chat-bg` (`--chat-bg`)

## 📁 Directory Structure Rules
Maintain the following structure for all new files and refactors:

```text
/appdev-central
├── app/               # Next.js 15 App Router
│   └── [feature]/components/ # Feature-specific components
├── components/        # Global shared components
├── lib/               # Shared libraries (api.ts, query-provider.tsx)
├── hooks/             # Custom TanStack Query hooks (structured by feature)
├── utils/             # Helper utilities (googleLogin.ts, clipboard.ts)
├── interface/         # TypeScript definitions
└── styles/            # Global Tailwind/CSS layers
```

## 🛠️ Implementation Guidelines

1.  **Styling**: 
    - **NO Hardcoded Pixels**: Do not use `text-[15px]`, `p-[10px]`, etc. Use standard Tailwind scale (`text-sm`, `p-4`, `w-full`).
    - **NO Hex Colors**: Do not use `text-[#ffffff]`, `bg-[#000000]`. Use theme variables (`text-foreground`, `bg-background`).
    - **NO Arbitrary Borders**: Use `border-border` for all standard borders.
2.  **Components**: Prioritize using existing Ant Design components via the `ConfigProvider` theme.
3.  **Hooks**: Always use the simplified TanStack Query hook pattern (e.g., `hooks/drive/useDriveQuery.ts`).
4.  **API**: Use the centralized `api` instance from `@/lib/api` for all network requests.
5.  **Notifications**: Use the static `message` or `notification` re-exports from `@/components/Providers/theme-provider`.
6.  **Buttons**: Prefer Ant Design `Button` or custom semantic components over raw HTML `<button>` for key actions.
7.  **Logic**: Keep business logic in `hooks/` or `services/`, keeping UI components clean and focused on rendering.
8.  **Naming**: Use `PascalCase` for components/interfaces and `camelCase` for hooks/utils.
