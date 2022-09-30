#!/usr/bin/env node

// Includes:
const yargs = require("yargs");
const fs = require("fs");
const JsonX = require("./JsonX.js");

// Declare CLI options:
const options = yargs
    .usage("Usage: -i <inputfile> [-o <outputfile>] [-w] [-r --reformat2 --reformat-tab] [--crlf] [-b]")
    .option("inputfile", {
        "alias": "i",
        "describe": "Input (.jsonx) file",
        "type": "string",
        "demandOption": true
    })
    .option("outputfile", {
        "alias": "o",
        "describe": "Output (.json) file",
        "type": "string",
        "demandOption": false
    })
    .option("overwrite", {
        "alias": "w",
        "describe": "Allows overwrite existing <outputfile>"
    })
    .boolean("overwrite")
    .option("display", {
        "alias": "d",
        "describe": "Just displays result; doesn't write output file"
    })
    .boolean("display")
    .option("blank", {
        "alias": "b",
        "describe": "Adds one blank line at end of file"
    })
    .boolean("blank")
    .option("reformat", {
        "alias": "r",
        "describe": "Reformats output (.json) file (decodes JSON and encodes it again w/ 4 spaces indentation)",
    })
    .boolean("reformat")
    .option("reformat2", {
        "describe": "Reformats output (.json) file (decodes JSON and encodes it again w/ 2 spaces indentation)",
    })
    .boolean("reformat2")
    .option("reformat-tab", {
        "describe": "Reformats output (.json) file (decodes JSON and encodes it again w/ tabs indentation)",
    })
    .boolean("reformat-tab")
    .option("crlf", {
        "describe": "Uses CRLF as EOL"
    })
    .boolean("crlf")
    .option("lfcr", {
        "describe": "Uses LFCR as EOL"
    })
    .boolean("lfcr")
    .option("silent", {
        "alias": "s",
        "describe": "Runs in silent mode."
    })
    .boolean("silent")
    .help()
    .argv;


let outputfile = (options.outputfile ?? options.inputfile.replace(/\.jsonx$/, ".json"));

// Check source file:
try {
    fs.accessSync(options.inputfile, fs.constants.R_OK);
    var stats = fs.lstatSync(options.inputfile);
    if (!stats.isFile()) {
        console.log(`Source is not file (${options.inputfile}).`);
        process.exit(2);
    }
}
catch (err) {
    console.log(`File not exists or is not readable (${options.inputfile}).`);
    process.exit(2);
}

// Check target file:
if (!options.display) {
    if (fs.realpathSync.native(options.inputfile) === fs.realpathSync.native(outputfile)) {
        console.log("Input and output files are identical.");
        process.exit(2);
    }
    try {
        fs.accessSync(outputfile, fs.constants.W_OK);
        var stats = fs.lstatSync(options.inputfile);
        if (!stats.isFile()) {
            console.log(`Target is not file or is not writable (${outputfile}).`);
            process.exit(2);
        }
        if (!options.overwrite) {
            console.log(`Output file already exists (${outputfile}). Run command again with overwrite enabled.`);
            process.exit(2);
        }
    } catch (err) {
        console.log("An error occcured.");
        process.exit(2);
    }
}

// Start conversion:
if (!options.display && !options.silent) {
    console.log(`Converting ${options.inputfile} to ${outputfile}.`);
}

// Load input file:
try {
    JsonX.source = fs.readFileSync(options.inputfile, {"encoding": "utf-8"});
} catch (err) {
    console.log(err);
    process.exit(2);
}

// Set EOL:
switch (true) {
    case options.crlf:
        JsonX.eol = "\r\n";
        break;
    case options.lfcr:
        JsonX.eol = "\n\r";
        break;
    default:
        JsonX.eol = "\n";
}

// Remove comments & trailing commas:
JsonX.removeComments();
JsonX.removeTrailingCommas();

// Reformat:
try {
    switch (true) {
        case options.reformat:
            JsonX.reformat4spc();
            break;
        case options.reformat2:
            JsonX.reformat2spc();
            break;
        case options["reformat-tab"]:
            JsonX.reformatTabs();
            break;
        default:
    }
} catch (err) {
    console.log(`ERROR: (${err.message}).`);
    process.exit(1);
}

// Use proper EOL:
if (options.crlf || options.lfcr) {
    JsonX.applyEol();
}

// Add blank line:
if (options.blank) {
    JsonX.addBlankLine();
}

// Show result (write result into output file or just display it):
if (options.display) {
    console.log(JsonX.source);
} else {
    try {
        fs.writeFileSync(outputfile, JsonX.source);
    } catch (err) {
        console.log(`Error writing file (${outputfile}).`);
        process.exit(2);
    }
}

// End app:
if (!options.display && !options.silent) {
    console.log("Done.");
}
process.exit(0);
