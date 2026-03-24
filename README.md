# AppDev Central - AI Strategy Workspace

A high-performance, AI-driven boilerplate application with a pre-built sidebar, immersive onboarding, strategy context selection, and authenticated chat. Designed to be a robust starting point for AI-integrated project management and strategic consulting tools.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router) |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Ant Design** | ^6.3.1 | UI component library (Modals, Dropdowns, Avatar) |
| **TanStack React Query** | ^5 | Server state management & caching |
| **Driver.js** | ^1.4.0 | Interactive Onboarding Tour |
| **Lucide React** | ^0.577 | Icon library |
| **Framer Motion** | ^12 | Animations |
| **Axios** | ^1 | HTTP client |
| **Canvas Confetti** | ^1.9 | Celebration effects |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Google OAuth Client ID and Backend API URL.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## NPM Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start the Next.js development server |
| `build` | `npm run build` | Build the production bundle |
| `start` | `npm run start` | Start the production server |
| `lint` | `npm run lint` | Run ESLint |

## Project Structure

```
template-chat/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global styles & CSS theme variables
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx                # Landing/Auth redirect
│   ├── login/                  # Login page with background blending
│   └── chat/                   # Main AI Chat interface
│       ├── components/         # Chat-specific components
│       └── [chatId]/           # Dynamic chat session routes
├── components/                 # Shared components
│   ├── Sidebars/               # Main sidebar with mobile burger menu
│   ├── Providers/              # App providers (Auth, Tour, Theme, Query)
│   └── Settings/               # Global settings modal
├── hooks/                      # Custom React hooks
│   ├── auth/                   # Google OAuth hooks
│   └── chat/                   # Chat history & streaming hooks
├── interface/                  # TypeScript interfaces (User, Chat, Company)
├── lib/                        # Core utilities
│   └── api.ts                  # Axios instance with global interceptors
├── utils/                      # Helper functions (cn, style, chat)
└── public/                     # Static assets (bg.jpg, icons)
```

## Core Infrastructure

### 1. Tour Provider (`components/Providers/tour-provider.tsx`)
- **Purpose**: Manages the interactive **Driver.js** onboarding tour.
- **Features**: Automatically triggers for first-time authenticated users, supports responsive targeting (burger menu on mobile), and plays completion confetti.

### 2. API Interceptor (`lib/api.ts`)
The project includes a pre-configured Axios instance (`api.ts`). It acts as a global **interceptor** to:
- Automatically route requests to your configured API base URL.
- Intercept outgoing requests to attach Authentication headers.
- Handle global API errors and response mapping.

### 3. Chat Provider (`components/Providers/chat-provider.tsx`)
- **Purpose**: Centralized state management for the AI chat interface.
- **Features**: Manages message history, real-time response streaming, and typing indicators.

### 4. Drive Provider (`components/Providers/drive-provider.tsx`)
- **Purpose**: Manages Google Drive integration for context selection.
- **Features**: Connection state management and file/context discovery for the AI.

### 5. Theme Provider (`components/Providers/theme-provider.tsx`)
- **Purpose**: Manages Light/Dark mode state and persistence.
- **Logic**: Persists preference to `localStorage` and applies the `dark` class to the root HTML element.

## Theming

The app supports **light** and **dark** mode via CSS custom properties in `globals.css`.

### CSS Variables

| Variable | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--background` | `#FFFFFF` | `#141414` | `bg-background` | Page backgrounds |
| `--foreground` | `#111827` | `#ffffff` | `text-foreground` | Default text |
| `--text` | `#111111` | `#ffffff` | `text-text` | Primary headings |
| `--text-info` | `#616161` | `#a1a1aa` | `text-text-info` | Muted descriptions |
| `--primary` | `#0F2A44` | `#1e293b` | `bg-primary` | Main brand color |
| `--accent-1` | `#1677ff` | `#3b82f6` | `bg-accent-1` | Primary actions/links |
| `--accent-2` | `#FF8A3D` | `#f97316` | `bg-accent-2` | Secondary highlights |
| `--border` | `#d9dadb` | `#27272a` | `border-border` | Dividers & borders |
| `--chat-bg` | `#eaeaea` | `#212121` | `bg-chat-bg` | Chat bubble area |

## Strategy Context Engine

The core value of this template is the **Strategy Context Engine**, which leverages AI processing via the configured backend.

1. **Client Selection**: Users select client/company context items. The metadata is stored in-session to ground upcoming prompts.
2. **Keyword Generation**: AI generates industry-specific keywords based on selected context by calling the `NEXT_PUBLIC_API_URL` endpoints.
3. **Question Framing**: The engine suggests tailored business questions to kickstart strategic analysis.
4. **Knowledge Retrieval**: The AI uses **Google Drive Integration** (configured via `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) and Company data to ground its answers using your specific documents/files.

### Connecting to a Backend

This template requires a running backend (configured in `.env`) to process AI requests:
- **`NEXT_PUBLIC_API_URL`**: Point this to your AI API (e.g., `http://192.168.15.238:5000/api/`).
- **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`**: Required for Google Drive context and authenticated user sessions.

## License

Private — AppDev Internal Use only.