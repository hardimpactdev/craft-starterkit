import { defineConfig } from "vite";

export function defineLiftoffConfig() {
    return defineConfig({
        plugins: [...pluginConfiguration()],
        resolve: {
            ...aliasConfiguration(),
        },
    });
}

import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import autoimport from "unplugin-auto-import/vite";
import components from "unplugin-vue-components/vite";
import { run } from "vite-plugin-run";
import i18n from "laravel-vue-i18n/vite";
import { liftoff } from "@hardimpactdev/liftoff-ui";
import path from "path";

export function pluginConfiguration() {
    return [
        liftoff(),
        laravel({
            input: ["resources/js/app.ts"],
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
        autoimportConfiguration(),
        componentsConfiguration(),
    ];
}

export function aliasConfiguration() {
    return {
        dedupe: ["@inertiajs/vue3"],
        alias: aliasLocalPackage([
            // {
            //     regex: /^@\/components\/UserInfo(?:\.vue)?$/,
            //     replacement: "./resources/js/components/UserInfo.vue",
            // },
            {
                regex: /^@\//,
                replacement: "@/",
                folderName: "liftoff/ui",
                localPath: "./resources/js",
                externalPath: "../liftoff-ui/src",
            },
            {
                regex: /^@hardimpact\/liftoff-ui/,
                replacement: "../liftoff-ui/index.ts",
            },
        ]),
    };
}

function runConfiguration() {
    return run([
        {
            name: "waymaker",
            run: ["php", "artisan", "waymaker:make"],
            pattern: ["app/**/Http/**/*.php"],
        },
        {
            name: "wayfinder",
            run: ["php", "artisan", "wayfinder:generate"],
            pattern: ["routes/*.php", "app/**/Http/**/*.php"],
        },
        {
            name: "typescript",
            run: ["php", "artisan", "typescript:transform"],
            pattern: ["app/{Data,Enums}/**/*.php"],
        },
    ]);
}

function autoimportConfiguration() {
    return autoimport({
        vueTemplate: true,
        include: [
            /\.vue$/,
            /\.vue\?vue/, // .vue
        ],
        dts: "./resources/js/types/auto-imports.d.ts",
        imports: [
            "vue",
            "@vueuse/core",
            {
                "@inertiajs/vue3": ["router", "useForm", "usePage", "Link"],
            },
            {
                "laravel-vue-i18n": ["trans"],
            },
            {
                "@livtoff/ui": ["__"],
            },
        ],
        dirs: [
            "./resources/js",
            "./resources/js/actions/App/Http/Controllers/index.ts",
        ],
    });
}

function componentsConfiguration() {
    return components({
        dirs: ["resources/js/components", "resources/js/layouts"],
        dts: "resources/js/types/components.d.ts",
        resolvers: [
            (name: string) => {
                const components = ["Link", "Head"];

                if (components.includes(name)) {
                    return {
                        name: name,
                        from: "@inertiajs/vue3",
                    };
                }
            },
        ],
    });
}

function aliasLocalPackage(
    aliases: Array<{
        regex: RegExp;
        replacement: string;
        externalPath?: string;
        folderName?: string;
        localPath?: string;
        inProduction?: boolean;
    }>,
) {
    if (process.env.NODE_ENV === "production") {
        return [];
    }

    return aliases.map((alias) => {
        return adjustAlias(alias);
    });

    function adjustAlias(alias: {
        regex: RegExp;
        replacement: string;
        externalPath?: string;
        folderName?: string;
        localPath?: string;
    }) {
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
                let resolvedPath = "";

                resolvedPath = path.resolve(
                    __dirname,
                    importer?.includes(alias.folderName)
                        ? alias.externalPath!
                        : alias.localPath!,
                    source.replace(alias.replacement, ""),
                );

                // use Vite's (in fact, rollup's) resolution function
                return (await this.resolve(resolvedPath))?.id;
            },
        };
    }
}
