interface CraftOptions {
    enhanceVue?: (app: any) => any;
}

declare module 'virtual:craft' {
    export function initializeCraft(options?: CraftOptions): Promise<void>;
}
