# JSONX
### Command line tool for JSONX to JSON file conversion

---

## **Table of contents**
* **[1. What is JSONX](#head1)**
* **[2. JSONX command line utility](#head2)**
  * **[2.1 Installation](#head21)**
  * **[2.2 Arguments](#head22)**
  * **[2.3 Error codes](#head23)**
* **[3. JSONX command line utility example](#head3)**
* **[4. Process automation](#head4)**
  * **[4.1 Using GRUNT](#head41)**
  * **[4.2 Using GULP](#head42)**
  * **[4.3 Using VS Code](#head43)**
  * **[4.4 Using PHP Storm](#head44)**
  * **[4.5 Other systems](#head45)**

---


## <a name="head1"></a> **1. What is JSONX?**
JSONX (**JSON eXtended**) is an extension to the JSON format that allows trailing commas and comments to be used in JSON files.

Comments begin with `#` or `//`; anything after one of those tags is treated as a comment and ignored.
(Of course not when the tag is part of a quotation mark (") bordered key or value.)

Trailing commas allow you to add/remove the last item of a list without changing other lines. It makes smaller differences in version control; your code is syntactically more stable against changes.

Let's look at `example.jsonx` file:
```
#  __  __         ____            _
# |  \/  |_   _  / ___| _   _ ___| |_ ___ _ __ ___
# | |\/| | | | | \___ \| | | / __| __/ _ \ '_ ` _ \
# | |  | | |_| |  ___) | |_| \__ \ ||  __/ | | | | |
# |_|  |_|\__, | |____/ \__, |___/\__\___|_| |_| |_|
#         |___/         |___/
#
# Configuration of My System; version X.Y.Z (YYYY-MM-DD)
# @author: author
# @package: package
#
{
   // Description for "key1"
  "key1": "value1",

    # "key2" is list of [something very important]:
    "key2": [
         "value2.1", // Disable when ... /
     // "value2.2", // Enable when ... //
         "value2.3", # Trailing comma allows adding/deleting another value
                     # with only one line change in version control diff
    ],
    "key3#": ["foo", "bar", #Some comment
"baz",
  // Misformated source can be
  // repaired using --reformat option.
],# <- note the trailing comma
}


```
Note the big title (generated with [TAAG](https://patorjk.com/software/taag/)). Not only does it look cool, but it also makes it easier for developers to keep track of which configuration they're actually editing when working on multiple projects at the same time.

Also notice how badly the file is formatted. Its because of reasons (which you will get to understand later in this text).


## <a name="head2"></a> **2. JSONX command line utility**

### <a name="head21"></a> **2.1 Installation**
Once you have installed [npm](https://www.npmjs.com/) on your system, install `jsonx` utility by command line:
```
$ npm install -g @spaceboy.cz/jsonx
```
Since then, `jsonx` should be globally available on your computer.


### <a name="head22"></a> **2.2 JSONX command line utility arguments**

- ### **--inputfile (-i)**
  Input (source) JSONX file.

- ### **--outputfile (-o)**
  Output (target) JSON file. When not specified, output file name is created automatically (by adding .json as extension to input file name). Eg. `test.jsonx` to `test.json`.

- ### **--overwite (-w)**
  Allows overwriting existing `output file`.

- ### **--reformat (-r)**
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with four spaces.

  Recommended argument.

- ### **--reformat2**
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with two spaces.

- ### **--reformat-tab**
  Reformats input JSONX (by parsing JSON and stringyfying it again). Output is indeted with tab.

- ### **--crlf**
  **CRLF** [`\r\n`] sequence is used for line endings in output file. (Default is **LF** [`\n`].)

- ### **--lfcr**
  **LFCR** [`\n\r`] sequence is used for line endings in output file. (Default is **LF** [`\n`].)

- ### **--blank (-b)**
  Adds blank line to end of document (required by some systems).


### <a name="head23"></a> **2.3 JSONX command line error codes**
| Code | Description |
|---|---|
| 1 | JSON parsing error |
| 2 | Filesystem error (input file unreachable, output file already exists and overwrite is not allowed etc.) |


## <a name="head3"></a> **3. JSONX command line utility example**
Let's try to convert example JSONX file from paragraph 1.

In command line, type
```
$ jsonx -i example.jsonx
```

File `example.json` should appear with content looking like this:
```
{
  "key1": "value1",
    "key2": [
         "value2.1",
         "value2.3"
    ],
    "key3#": ["foo", "bar",
"baz"
]
}
```
Well, the result is still not very nice (remember the bad formatting of the `example.jsonx` source file?).

Fortunately, we can fix the formatting. Enter the same command again, this time with the `--reformat` (or `-r`) option. On the second try, you should get an error message:

```
$ jsonx -i example.jsonx -r
Output file already exists (example.json). Run command again with overwrite enabled.
```

Convert file again with `--overwrite` (or `-w`) option. Now the command should be executed successfully:
```
$ jsonx -i example.jsonx -r -w
Converting example.jsonx to example.json.
Done.
```

This time, `example.json` should look like this:
```
{
    "key1": "value1",
    "key2": [
        "value2.1",
        "value2.3"
    ],
    "key3#": [
        "foo",
        "bar",
        "baz"
    ]
}
```


## <a name="head4"></a> **4. Process automation**

It is very inconvenient to generate a new JSON file after every change to the source JSONX file by running the command from the command line. That's why we try to automate this process as much as possible.


### <a name="head41"></a> **4.1 Watching file changes using GRUNT**
Stay tuned, we trying create plugin for **Grunt**.

If you can help us create plugins for Grunt, please contact us!


### <a name="head42"></a> **4.2 Watching file changes using GULP**
Stay tuned, we trying create plugin for **Gulp**.

If you can help us create plugins for Gulp, please contact us!


### <a name="head43"></a> **4.3 Visual Studio Code plugin**
Stay tuned, we trying create plugin for **VS Code**.

If you can help us create plugins for VS Code, please contact us!


### <a name="head44"></a> **4.4 PHP Storm plugin**
Stay tuned, we trying create plugin for **PHP Storm**.

If you can help us create plugins for PHP Storm, please contact us!


### <a name="head45"></a> **4.5 Other tools plugin**
If you can help us create plugins for other development tools, please contact us!
