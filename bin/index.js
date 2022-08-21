#!/usr/bin/env node

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

try {
	if (fs.realpathSync.native(options.inputfile) === fs.realpathSync.native(outputfile)) {
		return console.log("Input and output files are identical.");
	}
} catch (err) {
}

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
}

function writeFile (content) {
	try {
		fs.writeFileSync(outputfile, content);
	} catch (err) {
		console.log(`Error writing file (${outputfile}).`);
		process.exit(1);
	}
	console.log("Done.");
}

async function processFile() {
	var out = [];
	const fileStream = fs.createReadStream(options.inputfile);
	const rl = readline.createInterface({
		input: fileStream
	});
	let crlf = (options.crlf ? "\r\n" : "\n");

	// Replace comments:
	for await (const line of rl) {
		//var l = line.replace(/#(?=([^\"\\]*(\\.|\"([^\"\\]*\\.)*[^\"\\]*\"))*[^\"]*$).+$/, "");
		var l = line.replace(/\s*#(?=([^(\"|')\\]*(\\.|(\"|')([^(\"|')\\]*\\.)*[^(\"|')\\]*(\"|')))*[^(\"|')]*$).+$/, "");
		if (l.trim()) {
			out.push(l);
		}
	}

	// Replace trailing commas:
	var json = out.join(crlf).replace(/\,(?!\s*?[\{\[\"\'\w])/gm, "");

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
	if (options.crlf) {
		json = json.replaceAll("\n", crlf);
	}

	// Add blank line:
	if (options.blank) {
		json = json + crlf;
	}

	// Write result:
	writeFile(json);
}

console.log(`Converting ${options.inputfile} to ${outputfile}.`);
processFile();
