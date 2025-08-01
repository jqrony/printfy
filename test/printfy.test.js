// test.js for printfy v2.0.2
// Run using: node test.js

const { printf, sprintf, vprintf, vsprintf } = require("../lib/printfy");

// Utility for clean output comparison
function test(label, actual, expected) {
  const passed = actual === expected;
  console.log(`${passed ? '✔' : '✘'} ${label}`);
  if (!passed) {
    console.log(`   Expected: "${expected}"`);
    console.log(`   Received: "${actual}"\n`);
  }
}

// Capture console output for printf/vprintf tests
function captureConsoleOutput(callback) {
  const originalLog = console.log;
  let output = "";
  console.log = (msg) => { output += msg + "\n"; };
  callback();
  console.log = originalLog;
  return output.trim();
}

// --- Basic String Tests ---
test('String: simple', sprintf("Hello %s", "World"), "Hello World");
test('String: padded', sprintf("Name: %10s", "Alice"), "Name:      Alice");
test('String: left-aligned', sprintf("Name: %-10s!", "Bob"), "Name: Bob       !");
test('String: precision', sprintf("%.4s", "Elephant"), "Elep");

// --- Integer Tests ---
test('Decimal: positive', sprintf("Age: %d", 25), "Age: 25");
test('Decimal: negative', sprintf("Debt: %d", -350), "Debt: -350");
test('Zero-padded', sprintf("ID: %05d", 42), "ID: 00042");
test('Left-align', sprintf("Left: %-5d!", 9), "Left: 9    !");
test('Unsigned: large number', sprintf("Big: %u", -123), "Big: 18446744073709551493");

// --- Binary, Octal, Hex Tests ---
test('Binary', sprintf("Bin: %08b", 10), "Bin: 00001010");
test('Octal', sprintf("Oct: %o", 123), "Oct: 173");
test('Hex lowercase', sprintf("Hex: %x", 255), "Hex: ff");
test('Hex uppercase', sprintf("Hex: %X", 255), "Hex: FF");

// --- Character ---
test('Character: %c', sprintf("Char: %c", 65), "Char: A");

// --- Float Tests ---
test('Float: default precision', sprintf("Pi: %f", 3.14159), "Pi: 3.141590");
test('Float: .2f', sprintf("Pi: %.2f", 3.14159), "Pi: 3.14");
test('Float: fixed-point %F', sprintf("Fixed: %.3F", 12.3456), "Fixed: 12.346");
test('Float: scientific %e', sprintf("Sci: %.2e", 123456), "Sci: 1.23e+5");
test('Float: uppercase %E', sprintf("Sci: %.2E", 123456), "Sci: 1.23E+5");
test('Float: auto %g', sprintf("Auto: %.4g", 123.456), "Auto: 123.5");
test('Float: uppercase auto %G', sprintf("Auto: %.3G", 0.0001234), "Auto: 0.000123");

// --- Positional Arguments ---
test('Positional args', sprintf("%2$s %1$s!", "World", "Hello"), "Hello World!");

// --- vsprintf and vprintf ---
test('vsprintf basic', vsprintf("Total: %d, Name: %s", [99, "Item"]), "Total: 99, Name: Item");

// --- sprintf and vsprintf ---
test('sprintf basic', sprintf("Hello %s!", "World"), "Hello World!");
test('vsprintf array', vsprintf("Total: %d, Name: %s", [99, "Item"]), "Total: 99, Name: Item");

// --- printf Tests ---
let result = captureConsoleOutput(() => printf("User: %s, ID: %04d", "Alice", 7));
test('printf output', result, "User: Alice, ID: 0007");

result = captureConsoleOutput(() => printf("Hex: %X", 255));
test('printf hex upper', result, "Hex: FF");

result = captureConsoleOutput(() => printf("Float: %.2f", 3.14159));
test('printf float 2dp', result, "Float: 3.14");

// --- vprintf Tests ---
result = captureConsoleOutput(() => vprintf("User: %s, Age: %d", ["Bob", 32]));
test('vprintf array', result, "User: Bob, Age: 32");

result = captureConsoleOutput(() => vprintf("Hex: %02x", [15]));
test('vprintf padded hex', result, "Hex: 0f");

result = captureConsoleOutput(() => vprintf("Char: %c", [65]));
test('vprintf char', result, "Char: A");

console.log("\nAll tests completed.");