import path from "path";

export const aliasLocalPackage = (
    aliases: Array<{
        regex: RegExp;
        replacement: string;
        externalPath?: string;
        folderName?: string;
        localPath?: string;
        inProduction?: boolean;
    }>,
) => {
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
};
