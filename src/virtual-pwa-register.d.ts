declare module 'virtual:pwa-register/react' {
    import { RegisterSWOptions } from 'vite-plugin-pwa/client';
    export function registerSW(options?: RegisterSWOptions): () => void;
}