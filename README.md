## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
3. Folder Structure
   ```
   project-root/
   │── app/                        # Expo Router entry points (routes only)
   │   │── _layout.tsx             # Root layout
   │   │── index.tsx               # Home (/)
   │   │── auth/
   │   │   │── index.tsx           # /auth
   │   │   │── login.tsx           # /auth/login
   │   │   │── signup.tsx          # /auth/signup
   │   │── settings/
   │       │── index.tsx        
   │
   │── modules/                    # Feature-based modules (scalable)
   │   │── auth/
   │   │   │── components/
   │   │   │   │── LoginForm.tsx
   │   │   │   │── SignupForm.tsx
   │   │   │── hooks/
   │   │   │   │── useAuth.ts
   │   │   │── services/
   │   │   │   │── authService.ts
   │   │   │── store/
   │   │   │   │── useAuthStore.ts
   │   │   │── validation/
   │   │   │   │── authSchema.ts
   │   │   │── index.ts            # Barrel export for auth module
   │   │
   │   │── settings/               # Future feature (similar structure)
   │
   │── components/                 # Global reusable UI components
   │   │── Button.tsx
   │   │── Loader.tsx
   │   │── ErrorBoundary.tsx
   │
   │── hooks/                      # Global hooks
   │   │── useTheme.ts
   │   │── useNetwork.ts
   │
   │── store/                      # Global state management (Zustand/Redux/etc.)
   │   │── useThemeStore.ts
   │
   │── services/                   # Cross-module/shared services (API, Firebase, etc.)
   │   │── apiClient.ts
   │   │── logger.ts
   │
   │── utils/                      # Helpers/utilities
   │   │── formatDate.ts
   │   │── validateEmail.ts
   │   │── constants.ts
   │
   │── localization/               # i18n
   │   │── en.json
   │   │── es.json
   │
   │── env/                        # Environment configs
   │   │── .env.dev
   │   │── .env.prod
   │   │── .env.staging
   │
   │── tests/                      # Testing setup
   │   │── unit/
   │   │── e2e/
   │   │── jest.setup.ts
   │
   │── husky/                      # Git hooks
   │
   │── app.config.ts               # Expo app config
   │── tsconfig.json
   │── package.json
   │── README.md

   ```
