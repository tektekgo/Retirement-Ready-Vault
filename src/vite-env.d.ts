
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_SECRET: string
  readonly VITE_RESEND_API_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_INVITE_CODES?: string
  readonly VITE_GIT_COMMIT_COUNT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
