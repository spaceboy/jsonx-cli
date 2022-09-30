class JsonX {

    static eol = "\n";

    static source;

    static addBlankLine () {
        JsonX.source = JsonX.source + JsonX.eol;
    }

    static applyEol () {
        JsonX.source = JsonX.source.replaceAll("\n", eol);
    }

    static removeComments () {
        var out = [];
        for (var line of JsonX.source.split(/\r?\n\r?/)) {
            line = line
                .replace(/^\s*(#|\/\/)(.)*$/, "")
                .replace(/\s*(#|\/\/)(?=([^(\"|')\\]*(\\.|(\"|')([^(\"|')\\]*\\.)*[^(\"|')\\]*(\"|')))*[^(\"|')]*$).*$/, "");
            if (line.trim()) {
                out.push(line);
            }
        }
        JsonX.source = out.join(JsonX.eol);
    }

    static removeTrailingCommas () {
        JsonX.source = JsonX.source.replace(/\,(?!\s*?[\{\[\"\'\w])/gm, "");
    }

    static #reformat (repl) {
        JsonX.source = JSON.stringify(JSON.parse(JsonX.source), null, repl);
    }

    static reformat4spc () {
        JsonX.#reformat(4);
    }

    static reformat2spc () {
        JsonX.#reformat("  ");
    }

    static reformatTabs () {
        JsonX.#reformat("\t");
    }
}

module.exports = JsonX;
