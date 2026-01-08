import { defineConfig } from 'vite';

interface viteConfigOptions {
    plugins?: any[];
    aliases?: any[];
}

export function defineLiftoffConfig(options: viteConfigOptions = {}) {
    return defineConfig({
        plugins: [...pluginConfiguration(), ...(options.plugins || [])],
        resolve: {
            ...aliasConfiguration(options.aliases),
        },
    });
}

import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { run } from 'vite-plugin-run';
import i18n from 'laravel-vue-i18n/vite';
import { liftoff } from '@hardimpactdev/liftoff-vue';
import path from 'path';

export function pluginConfiguration() {
    return [
        liftoff(),
        laravel({
            input: ['resources/js/app.ts'],
            refresh: true,
        }),
        i18n(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        runConfiguration(),
    ];
}

function runConfiguration() {
    return run([
        {
            name: 'waymaker',
            run: ['php', 'artisan', 'waymaker:generate'],
            pattern: ['app/**/Http/**/*.php'],
        },
        {
            name: 'wayfinder',
            run: ['php', 'artisan', 'wayfinder:generate'],
            pattern: ['routes/*.php', 'app/**/Http/**/*.php'],
        },
        {
            name: 'typescript',
            run: ['php', 'artisan', 'typescript:transform'],
            pattern: ['app/{Data,Enums}/**/*.php'],
        },
    ]);
}


interface LocalAlias {
    regex: RegExp;
    replacement: string;
    externalPath?: string;
    folderName?: string;
    localPath?: string;
}

function aliasConfiguration(aliases: any[] = []) {
    let aliasConfig = aliases.filter((alias) => !alias.local);

    const localAliases = aliases.filter((alias) => alias.local);

    if (process.env.NODE_ENV === 'local' && localAliases.length > 0) {
        aliasConfig.push(...aliasLocalPackage(localAliases as LocalAlias[]));
    }

    return {
        dedupe: ['@inertiajs/vue3'],
        alias: aliasConfig,
    };
}

function aliasLocalPackage(aliases: Array<LocalAlias>) {
    return aliases.map((alias) => {
        if (!alias.externalPath && !alias.folderName && !alias.localPath) {
            return {
                find: alias.regex,
                replacement: path.resolve(__dirname, alias.replacement),
            };
        }

        return {
            find: alias.regex,
            replacement: alias.replacement,
            async customResolver(source, importer) {
                let resolvedPath = '';

                resolvedPath = path.resolve(
                    __dirname,
                    importer?.includes(alias.folderName) ? alias.externalPath! : alias.localPath!,
                    source.replace(alias.replacement, ''),
                );

                // use Vite's (in fact, rollup's) resolution function
                return (await this.resolve(resolvedPath))?.id;
            },
        };
    });
}
