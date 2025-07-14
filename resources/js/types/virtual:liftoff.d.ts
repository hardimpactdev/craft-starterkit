interface LiftoffOptions {
    enhanceVue?: (app: any) => any;
}

declare module 'virtual:liftoff' {
    export function initializeLiftoff(options?: LiftoffOptions): Promise<void>;
}
