const {sprintf, vsprintf} = require('../lib/printfy');

let totalChecks = 0;
let passed = 0;
let failed = 0;
let timeoutId;

function expect(output, expected) {
  totalChecks++;
  console.log(output === expected ? (passed++, '✓') : (failed++, '✗'), expected);

  clearInterval(timeoutId);
  timeoutId = setTimeout(() => {
    console.log(`\nTests Result: [passed: ${passed}/${totalChecks}], [failed: ${failed}/${totalChecks}]`);
    if (!failed) {
      console.log('✓ All tests passed!');
    }
  }, 1000);
};

expect(sprintf("Value: %*.*f", 10, 4, 3.1415926), 'Value:     3.1416');
expect(sprintf("%3\$s has scored %1\$05d and GPA %2\$.3f", 89, 3.8765, "Afsara"), 'Afsara has scored 00089 and GPA 3.877');
expect(sprintf("%2\$s got %1\$d%% marks in %3\$s", 95, "Afsara", "Math"), 'Afsara got 95% marks in Math');
expect(sprintf("Sci: %.2e | Hex: %X | Name: %s", 12345.678, 3735928559, "Debug"), 'Sci: 1.23e+4 | Hex: DEADBEEF | Name: Debug');
expect(sprintf("Signed: %+08d | Unsigned: %08u", 123, 123), 'Signed: +0000123 | Unsigned: 00000123');
expect(sprintf("Name: %.5s", "AfsaraBano"), 'Name: Afsar');
expect(sprintf("Binary: %016b", 42), 'Binary: 0000000000101010');
expect(sprintf("%2\$010.3f vs %1\$-10.2f", 3.1, 123.456), '000123.456 vs 3.10      ');
expect(sprintf("%4\$s | %1\$d | %3\$.2f | %2\$X", 77, 255, 12.3456, "Mix"), 'Mix | 77 | 12.35 | FF');
expect(vsprintf("Dynamic: %3\$*.*f", [3, 8, 123.4567]), 'Dynamic: 123.45670000');
expect(sprintf("NegSpace:[% d] PosSpace:[% d]", -45, 67), 'NegSpace:[-45] PosSpace:[67]');
expect(sprintf("Grouped: %s", (1234567890.9876).toLocaleString(3)), 'Grouped: 1,234,567,890.988');
expect(sprintf("%3\$s => Hex:%1\$x Oct:%2\$o", 255, 64, "Value"), 'Value => Hex:ff Oct:100');
expect(sprintf("Char:%c | Dec:%d | Bin:%b", 65, 65, 65), 'Char:A | Dec:65 | Bin:1000001');
expect(sprintf("a=%.1f | b=%.3f | c=%07.2f", 3.1415, 3.1415, 3.1415), 'a=3.1 | b=3.142 | c=0003.14');
expect(sprintf("%2\$.3s scored %1\$d", 90, "AfsaraBano"), 'Afs scored 90');
expect(sprintf("Dynamic Pi: %.*f", 6, Math.PI), 'Dynamic Pi: 3.141593');
expect(sprintf("Bell:[%c] NewLine:[%c]", 7, 10), 'Bell:[' + String.fromCharCode(7) + '] NewLine:[' + String.fromCharCode(10) + ']');
expect(vsprintf("Coords: (%.2f, %.2f, %.2f)", [12.3456, -7.89, 0.456]), 'Coords: (12.35, -7.89, 0.46)');
expect(sprintf("%4\$s-%2\$d-%1\$04d GPA:%3\$.2f", 9, 2025, 3.9867, "Roll"), 'Roll-2025-0009 GPA:3.99');
expect(sprintf("%+010.2f | %-10.2f", 45.67, 45.67), '+000045.67 | 45.67     ');
expect(sprintf("Left align: %*s", 10, "JSP"), 'Left align:        JSP');
expect(vsprintf("%1\$s (Age:%2\$d) -> Score:%.2f", ["Afsara", 22, 99.456]), 'Afsara (Age:22) -> Score:0.00');
expect(sprintf("Bin:%2\$08b | Char:%1\$c", 90, 90), 'Bin:01011010 | Char:Z');
expect(sprintf("%3\$.4s-%1\$03d-%.2f", 7, "ignore", "Afsara123"), 'Afsa-007-7.00');
expect(sprintf("Oct:%o Dec:%d Hex:%X", 255, 255, 255), 'Oct:377 Dec:255 Hex:FF');
expect(sprintf("%.5e", 0.0000001234), '1.23400e-7');
expect(sprintf("%.15f", Math.PI), '3.141592653589793');