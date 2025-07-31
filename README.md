# printfy [![npm version](https://img.shields.io/npm/v/printfy?style=flat-square)](https://www.npmjs.com/package/printfy)

A lightweight JavaScript library implements C-style `printf` functionality.

![license](https://img.shields.io/github/license/jsvibe/printfy?style=flat-square&color=blue)
![author](https://img.shields.io/badge/Author-Indian%20Modassir-blue?style=flat-square)
[![jsDelivr Hits](https://img.shields.io/jsdelivr/npm/hm/printfy?style=flat-square)](https://www.jsdelivr.com/package/npm/printfy)
[![downloads month](https://img.shields.io/npm/dm/printfy?style=flat-square)](https://www.npmjs.com/package/printfy)

---

## 🌟 Features

- Fully functional `printf`, `sprint`, and `vsprint` methods.
- C-style format specifiers support:
  - `%d`, `%f`, `%s`, `%x`, `%b`, `%o`, `%u`, `%c`, `%e`, `%g`, `%G`, etc.
-  Padding, alignment, width, and precision controls
- Argument indexing like `%2$08.2f`
- Supports most common C-style format specifiers.
- Distinct handling for `%f` (locale) and `%F` (non-locale)
- Float, Integer, Hex, Octal, Binary, Char, and String formatting
- Custom width, padding, alignment flags.
- Float precision control up to JavaScript's max (53 bits).
- Handles NaN, Infinity and signed values.
- Works in **Node.js**, modern browsers, and CommonJS/AMD environments.
- No external dependencies

---

## How to install printfy
To include printfy in [Node](https://nodejs.org/), first install with npm.

```bash
npm install printfy
```

## How to build printfy
Clone a copy of the main Sizzle git repo by running:

```bash
git clone git://github.com/jsvibe/printfy.git
```

In the `printfy/dist` folder you will find build version of printfy along with the minified file.

## Including printfy
Below are some of the most common ways to include printfy.

### Browser

**CDN Link**

```html
<script src="https://cdn.jsdelivr.net/npm/printfy@2.0.0/dist/printfy.min.js"></script>
```

You can add the script manually to your project:

```html
<script src="printfy.js"></script>
```

### Webpack / Browserify / Babel
There are several ways to use [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/) or [Babel](https://babeljs.io/). For more information on using these tools, please refer to the corresponding project's documentation. In the script, including printfy will usually look like this:

```js
import {sprint, printf, vsprint} from "printfy";
```

### Node.js

Fully compatible with [Node.js](https://nodejs.org/), this library lets you use familiar C-style printf formatting in server-side code—ideal for CLI tools, logging, and backend output formatting.

```js
const {sprint, printf, vsprint} = require("printfy");
```

---

## API Usage

### `printf(format, ...args)`
Logs the formatted output to the console.

```js
printf("Hello %s, you have %d new messages", "Alice", 5);
// Output: Hello Alice, you have 5 new messages
```

### `sprint(format, ...args)`
Returns a formatted string (like `sprintf` in C).

```js
let result = sprint("Value: %08.2f", 3.14);
console.log(result); // Output: Value: 00003.14
```

### `vsprint(format, args[])`
Same as `sprint`, but accepts arguments as an array.

```js
vsprint("User: %s, Score: %d", ["Bob", 100]);
// Output: User: Bob, Score: 100
```

---

## 🔢 Supported Specifiers

| Specifier | Meaning                               | Example                         |
|-----------|---------------------------------------|---------------------------------|
| `%s`      | String                                | `sprint("%s", "abc")` → `"abc"` |
| `%S`      | Uppercase string                      | `"abc"` → `"ABC"`               |
| `%d`      | Integer (decimal)                     | `42`                            |
| `%u`      | Unsigned integer (64-bit)             | `-1` → `"18446744073709551615"` |
| `%b`      | Binary                                | `5` → `"101"`                   |
| `%o`      | Octal                                 | `8` → `"10"`                    |
| `%x`, `%X`| Hexadecimal (lower/upper)             | `255` → `"ff"` or `"FF"`        |
| `%f`, `%F`| Float (fixed-point)                   | `3.14` → `"3.140000"`           |
| `%e`, `%E`| Float (scientific notation)           | `3.14` → `"3.14e+0"`            |
| `%g`, `%G`| Auto float/scientific (shortest form) | `123000` → `"1.23e+5"`          |
| `%c`      | Character from ASCII code             | `65` → `"A"`                    |
| `%%`      | Literal percent sign                  | `%`                             |

---

## ⚙️ Format Options

**Format syntax:**

```
%[index$][padding][flag][width][.precision]specifier
```

---

## 🧪 Examples

```js
sprint("Binary: %08b", 5);            // Binary: 00000101
sprint("Hex: %#x", 255);             // Hex: ff
sprint("Char: %c", 65);             // Char: A
sprint("Padded: %10s", "text");     // Padded:      text
sprint("Left: %-10s!", "text");     // Left: text     !
sprint("Float: %.2f", 3.14159);     // Float: 3.14
sprint("Scientific: %.2e", 1200);   // Scientific: 1.20e+3
```

---

## ⚠️ Errors & Warnings

- **ArgumentCountError**: Thrown if insufficient arguments are passed for format specifiers.
- **ValueError**: Invalid specifier detected.
- **RangeError**: Padding exceeds safe integer limit.
- **Precision Truncation**: Float precision is capped at JavaScript's safe limit (53 digits).

---

## 🔄 Comparison with Other Libraries

| Feature / Library      | printfy ✅         | sprintf-js 🟡 | fast-printf 🟢 | printf (npm) 🔵    |
| ---------------------- | ------------------ | ------------- | -------------- | -------------------- |
| C-style specifiers     | ✅ Full            | ✅ Full        | ✅ Partial      | ✅ Partial       |
| %2\$ style arg index   | ✅ Yes             | ✅ Yes         | ❌ No           | ❌ No            |
| BigInt support         | ✅ Yes             | ❌ No          | ❌ No           | ❌ No            |
| %f vs %F (locale)      | ✅ Separate        | ❌ Combined    | ❌ Combined     | ❌ No            |
| Custom padding ('x)    | ✅ `'x`, `0`, etc. | ❌ No          | ❌ No           | ❌ No            |
| String return (sprint) | ✅ Yes             | ✅ Yes         | ✅ Yes          | ❌ No            |
| Lightweight / No deps  | ✅ Yes             | ✅ Yes         | ✅ Yes          | ✅ Yes           |
| Unicode emoji safe     | Partial            | Partial         | ❌ No           | ❌ No            |
| Performance            | Good               | Good            | Best             | Good             |

---

## 📦 Module Support

This library supports the following environments:

- **Browser** (`<script>`)
- **CommonJS / Node.js**
- **AMD (Asynchronous Module Definition)**

---

## 🔐 License

MIT License © 2025 [Indian Modassir](https://github.com/indianmodassir)  
See [LICENSE](LICENSE) for details.

---

## 🙌 Contributions

Pull requests, bug reports, and feedback are welcome!  
Visit the [GitHub Repository](https://github.com/jsvibe/printfy) to contribute.

---