declare module '*.css';

// Valores que build.mjs inyecta con `define` (config de Firebase y modo dev)
declare const process: { env: Record<string, string> };
