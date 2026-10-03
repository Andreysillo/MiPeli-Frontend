declare module '*.css';
declare module '*.png' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }

// Valores que build.mjs inyecta con `define` (config de Firebase y modo dev)
declare const process: { env: Record<string, string> };
