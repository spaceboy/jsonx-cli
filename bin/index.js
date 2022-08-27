#!/usr/bin/env node

// Declare options:
const yargs = require("yargs");
const options = yargs
	.usage("Usage: -i <inputfile> [-o <outputfile>] [-w] [-r --reformat2 --reformat-tab] [--crlf] [-b]")
	.option("i", {
		"alias": "inputfile",
		"describe": "Input (.jsonx) file",
		"type": "string",
		"demandOption": true
	})
	.option("o", {
		"alias": "outputfile",
		"describe": "Output (.json) file",
		"type": "string",
		"demandOption": false
	})
	.option("w", {
		"alias": "overwrite",
		"describe": "Allows overwrite existing <outputfile>"
	})
	.boolean("w")
	.option("r", {
		"alias": "reformat",
		"describe": "Reformats output (.json) file (decodes JSON and encodes it again w/ 4 spaces indentation)",
	})
	.boolean("r")
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
	.option("display", {
		"alias": "d",
		"describe": "Just displays result; doesn't write output file"
	})
	.boolean("display")
	.option("b", {
		"alias": "blank",
		"describe": "Adds one blank line at end of file"
	})
	.boolean("b")
	.help()
	.argv;

const fs = require("fs");
const readline = require('readline');

var outputfile = (options.outputfile ?? options.inputfile.replace(/\.jsonx$/, ".json"));

// Check source and target files:
if (
	!options.display
	&& fs.realpathSync.native(options.inputfile) === fs.realpathSync.native(outputfile)
) {
	console.log("Input and output files are identical.");
	process.exit(2);
}

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

// Write output to file:
function writeFile (content) {
	try {
		fs.writeFileSync(outputfile, content);
	} catch (err) {
		console.log(`Error writing file (${outputfile}).`);
		process.exit(2);
	}
	console.log("Done.");
}

// Process source file:
async function processFile() {
	var out = [];
	const fileStream = fs.createReadStream(options.inputfile);
	const rl = readline.createInterface({
		input: fileStream
	});

	// Choose EOL type:
	var eol = "\n";
	if (options.crlf) {
		eol = "\r\n";
	}
	if (options.lfcr) {
		eol = "\n\r";
	}

	// Replace comments:
	for await (const line of rl) {
		//var l = line.replace(/\s*(#|\/\/)(?=([^(\"|')\\]*(\\.|(\"|')([^(\"|')\\]*\\.)*[^(\"|')\\]*(\"|')))*[^(\"|')]*$).*$/, "");
		var l = line
			.replace(/^\s*(#|\/\/)(.)*$/, "")
			.replace(/\s*(#|\/\/)(?=([^(\"|')\\]*(\\.|(\"|')([^(\"|')\\]*\\.)*[^(\"|')\\]*(\"|')))*[^(\"|')]*$).*$/, "");
		if (l.trim()) {
			out.push(l);
		}
	}

	// Join JSON:
	var json = out.join(eol);

	// Replace trailing commas:
	json = json.replace(/\,(?!\s*?[\{\[\"\'\w])/gm, "");

	// Reformat output:
	try {
		switch (true) {
			case options.reformat:
				json = JSON.stringify(JSON.parse(json), null, 4);
				break;
			case options.reformat2:
				json = JSON.stringify(JSON.parse(json), null, "  ");
				break;
			case options["reformat-tab"]:
				json = JSON.stringify(JSON.parse(json), null, "\t");
				break;
			default:
		}
	} catch (err) {
		console.log(`ERROR: (${err.message}).`);
		process.exit(1);
	}

	// Use proper EOL:
	if (options.crlf || options.lfcr) {
		json = json.replaceAll("\n", eol);
	}

	// Add blank line:
	if (options.blank) {
		json = json + eol;
	}

	// Show result (write result into output file or just display it):
	if (options.display) {
		console.log(json);
	} else {
		writeFile(json);
	}
}

// Start conversion:
if (!options.display) {
	console.log(`Converting ${options.inputfile} to ${outputfile}.`);
}
processFile();
