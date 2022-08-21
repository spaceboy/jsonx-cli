# JSONX
### Command line tool for JSONX to JSON file conversion

## 1. What is JSONX?
JSONX (**JSON eXtended**) is the extension for JSON format which allows using trailing commas and comments in JSON format files.

Let's look at `example.jsonx` file:
```
# DEVEL configuration:
{
    # Description for "key1"
    "key1": "value1",

    # "key2" is list of [something very important]:
    "key2": [
        "value2.1", # Disable when ...
        # "value2.2", # Enable when ...
        "value2.3", # Trailing comma allows adding anothwer value with only one row change in version diff
    ],
}
```

## 2. JSONX command line tool

### 2.1 Installation
Once you have installed [npm](https://www.npmjs.com/), in command line type:
```
$ npm install -g @spaceboy.cz/jsonx
```

### 2.2 Parameters

- ### -i --inputfile
  Input (source) JSONX file.

- ### -o --outputfile
  Output (target) JSON file. When not specified, output file name is created automatically (by adding .json as extension to input file name). Eg. `test.jsonx` to `test.json`.

- ### -w --overwite
  Allows overwriting existing `output file`.

- ### -r --reformat
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with four spaces.

  Recommended argument.

- ### --reformat2
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with two spaces.

- ### --reformat-tab
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with tab.

- ### --crlf
  CRLF [**\r\n**] sequence is used for line endings in output file. (Default is LF [**\n**].)

- ### -b --blank
  Adds blank line to end of document (required by some systems).

## 3. Example
Let's try to convert example JSONX file from paragraph 1.

In command line, type
```
$ jsonx -i example.jsonx
```

File `example.json` should appear with this content:
```
{
    "key1": "value1",
    "key2": [
        "value2.1",
        "value2.2",
        "value2.3"
    ]
}
```

Type the same command again. On the second try an error message should appear:
```
$ jsonx -i example.jsonx
Output file already exists (example.json). Run command again with overwrite enabled.
```

Convert file again with `--overwrite` (or `-w`) argument. Now the command should be executed successfully:
```
$ jsonx -i example.jsonx -w
Converting example.jsonx to example.json.
Done.
```
