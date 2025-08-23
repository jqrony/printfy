/**
 * printfy pure JavaScript Libaray v2.0.3
 * A lightweight JavaScript library implements C-style `printf` functionality.
 * https://github.com/jsvibe/printfy
 * 
 * @license MIT License
 * @author Indian Modassir
 * 
 * Date: 20 August 2025 12:59 GMT+05030
 */
(function(global, factory) {

'use strict';

var printfy = factory();

/* EXPOSE */
if (typeof define === 'function' && define.amd) {
  define(function() {
    return printfy;
  });
} else {
  typeof module === 'object' && module.exports
    ? module.exports = printfy
    : Object.assign(global, printfy);
}
/* EXPOSE */

})(typeof window !== "undefined" ? window : this, function() {

'use strict';

// Internal shortcuts
var arr = [];
var slice = arr.slice;
var Console = console;

// Constants
var MAX_ARGS = 2147483647;
var SAFE_INT = Number.MAX_SAFE_INTEGER;
var MAX_PRECISION = 53;

/**
 * Regex captures format string segments like:
 * %2$08.2f — meaning: 2nd arg, zero-padded, width 8, precision 2, float.
 *
 * %[argument][padding][flags][width][.precision][length]specifier
 * 
 * - Captured Groups:
 * 1: Argument   Refers to the specific argument position
 * 2: Padding    (e.g., 0, (space), 'char)
 * 3: Flags      (e.g., +, -)
 * 4: Width      Minimum number of characters
 * 5: .Precision Decimal places (for floats) or max chars (for strings)
 * 6: Specifier  (e.g.,  d, f, s etc.)
 * 7: Literal %  (escaped percent sign)
 */
var rspecifier = /%(?:(?:(\d+\$|)((?:\'.)?(?:[0\x20])?|)([+-]|)((?:\d+|\*)|)(\.(?:\d+|\*)?|)([a-z]))|(%))/gi;
var rswap = /%(?:([+-]|)((?:\'.)?(?:[0\x20])?))/gi;

/**
 * Specifier functions
 * Each key corresponds to a supported format specifier.
 * Handles integer, float, and string conversions.
 * 
 * Specifier keys:
 * - Integer [d, u, c, o, X, x, b]
 * - Float   [f, F, g, G, E, e]
 * - String  [s]
 */
var specifiers = {
  /* INTEGER */
  // Binary integer (%b)
  // Converts number to base-2 string.
  b: function(value, padding, flag, width) {
    return doAdjust(value.toString(2), padding, flag, width);
  },
  
  // ASCII character from int (%c)
  // Converts integer to ASCII character code.
  c: function(value, padding, flag, width) {
    value = value < 0 ? "" : value;
    return doAdjust(String.fromCharCode(value), padding, flag, width);
  },

  // Decimal integer (%d)
  d: function(value, padding, flag, width) {
    return doAdjust(value, padding, flag, width);
  },

  // Octal format or Unsigned 64-bit (%o)
  // Converts signed number to unsigned 64-bit, then to base-8.
  o: function(value, padding, flag, width) {
    // 2^64 + (-210)
    var us64 = (BigInt(1) << BigInt(64)) + BigInt(value);
    value = (value < 0 ? us64 : value).toString(8);
    return doAdjust(value, padding, flag, width);
  },

  // Unsigned decimal integer (%u)
  // Always positive; wraps negative values into 64-bit unsigned space.
  u: function(value, padding, flag, width) {
    value = parseInt(value) || 0;
    value = ((BigInt(value) + 2n ** 64n) % (2n ** 64n)).toString();
    return doAdjust(value, padding, flag, width);
  },

  // Hexadecimal lowercase (%x)
  // Converts signed number to unsigned 64-bit, then to base-16.
  x: function(value, padding, flag, width) {
    // 2^64 + (-210)
    var us64 = (BigInt(1) << BigInt(64)) + BigInt(value);
    value = (value < 0 ? us64 : value).toString(16);
    return doAdjust(value, padding, flag, width);
  },

  // Hexadecimal uppercase (%X)
  // Same as %x but outputs in uppercase.
  X: function(value, padding, flag, width) {
    return this.x(value, padding, flag, width).toUpperCase();
  },

  /* FLOAT */
  // Scientific notation lowercase (%e)
  // Uses exponential form with `precision` decimal places.
  e: function(value, padding, flag, width, precision, origVal) {
    value = value.toExponential(precision);
    return doAdjust(InfNaN(origVal, value), padding, flag, width);
  },

  // Scientific notation uppercase (%e)
  E: function(value, padding, flag, width, precision, origVal) {
    return this.e(value, padding, flag, width, precision, origVal).toUpperCase();
  },

  // Fixed-point notation (locale-aware) (%f)
  // Locale-aware formatting with given precision.
  f: function(value, padding, flag, width, precision, origVal) {
    value = value.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: false
    });

    return doAdjust(InfNaN(origVal, value), padding, flag, width);
  },

  // Fixed-point (non-locale, forced digits) (%F)
  // Similar to %f but always uses strict `toFixed()`.
  F: function(value, padding, flag, width, precision, origVal) {
    value = value.toFixed(precision);
    return doAdjust(InfNaN(origVal, value), padding, flag, width);
  },

  // Auto scientific or fixed-point format (%g)
  // Automatically chooses fixed-point (%f) or scientific (%e)
  // depending on exponent and precision.
  g: function(value, padding, flag, width, precision, origVal) {
    var X, formatted,
      regNoFloat = /(\.|0)+$/,

      // Get exponent X
      strExp = this.e(value, "", "", null, precision),
      regExp = /e([+-]?\d+)/;

    // Exponent
    X = +(regExp.exec(strExp) || [])[1];

    // If P > X ≥ -4
    // then use fixed-point style (%f) with precision = P - (X + 1)
    if ((precision > X) && (X >= -4)) {
      formatted = this.f(value, "", "", null, Math.max(precision - (X + 1), 0), origVal);

    // Otherwise,
    // use scientific style (%e) with precision = P - 1
    } else {
      formatted = this.e(value, "", "", null, Math.max(precision - 1, 0), origVal);
    }

    // remove trailing zeros in float
    value = precision <= 16 ? formatted.replace(regNoFloat, "") : formatted;
    return this.s(value, padding, flag, width);
  },

  // Uppercase version of g (%G)
  // Same as %g but outputs uppercase.
  G: function(value, padding, flag, width, precision, origVal) {
    return this.g(value, padding, flag, width, precision, origVal).toUpperCase();
  },

  /* STRING */
  // String format (%s)
  // Applies width/precision truncation and padding.
  s: function(value, padding, flag, width, precision) {
    return doAdjust(value, padding, flag, width, precision, true);
  },

  // Uppercase string (%S)
  // Same as %s but converts to uppercase.
  S: function(value, padding, flag, width, precision) {
    return this.s(value, padding, flag, width, precision).toUpperCase();
  }
};

// Handle NaN and Infinity cases for float formatting.
function InfNaN(value, afterValue) {
  return Number.isNaN(value) || Math.abs(value) === Infinity ? value : afterValue;
}

// Adjusts the formatted value with padding, flags, width, and precision.
function doAdjust(value, padding, flag, width, precision, isStr) {
  if (isStr) value = value.slice(0, precision) || value;
  return setPadding(value + "", padding, flag, width, !isStr);
}

// Applies padding and alignment to the value.
function setPadding(value, padding, flag, width, isNumeric) {
  var setFlag = function(flag, value, padding = '') {
    var rFlag = /^[+-]/, valueSign = rFlag.exec(value);

    value = value.replace(rFlag, '');

    // Remove padding by one character if valueSign doesn't match
    if (flag === '+' && !valueSign) padding = padding.slice(1);

    // Overwrite flag value, if valueSign exists.
    if (valueSign) flag = valueSign[0];

    return padding[0] === '0' ? flag + padding + value : padding + flag + value;
  };

  // Remove leading single quote from padding character if present
  // And remove leading [.char] from padding character if present
  padding = padding.replace(/^'(?:\.(.))?/g, "$1") || "\x20";

  // Calculate the number of padding characters needed
  width = +width - value.length;

  // Check if the required padding width exceeds a safe integer threshold
  if (width > SAFE_INT || (width + value.length) < 0) {
    throw new RangeError('Width must be greater than 0 and less than ' + SAFE_INT);
  }

  // Apply padding if necessary
  if (width > 0) {

    // Do not lead with padding 0 if alignment is right
    if (padding === '0' && flag === '-' && isNumeric) {
      padding = '\x20';
    }

    padding = padding.repeat(width);

    // Apply the padding based on the flag and value type
    // For non-numeric or '-' flag
    if (!isNumeric || flag === '-') {
      value = flag === '-' ? value + padding : padding + value;

    // Otherwise handle numeric specifier
    } else {
      value = setFlag(flag, value, padding);
    }

  // Handle only flag and value for numeric specifier without padding
  } else if (isNumeric) {
    value = setFlag(flag, value);
  }

  return value;
}

// Format function for replacing specifiers with argument values.
function fnFormat(values) {
  var i = 0;
  return function(_, $arg, padding, flag, width, precision, specifier, percent) {
    if (percent) return '%';

    var args, value,
      precision = precision.slice(1),
      fn = specifiers[specifier],
      length = values.length,
      arg = parseInt($arg),
      copyValues = values.slice(),
      rfloatspecifier = /^(?:f|g|e)$/i,
      rstrspecifier = /^s$/i;

    if (width === '*') {
      width = values.shift();
    }

    if (precision === '*') {
      precision = values.shift();
    }

    value = values[i];
    i++;

    // Default precision for float specifiers = 6.
    if (rfloatspecifier.test(specifier) && !precision) {
      precision = 6;
    }

    precision = +precision || 0;

    // Validate supported specifier.
    if (!fn) {
      throw new Error('ValueError: Unknown format specifier [' + specifier + '].');
    }

    // Handle explicit argument index (e.g., %2$d).
    if (!isNaN(arg)) {
      if (arg <= 0 || arg >= MAX_ARGS) {
        throw new Error('ValueError: Argument number specifier must be greater than zero and less than ' + MAX_ARGS);
      }

      value = copyValues[arg - 1];
      i--;
    }

    // Check argument count consistency.
    if (i > length || arg > length) {
      if (arg > length) {
        i = arg;
      }
    
      throw new Error('ArgumentCountError: ' + (i + 1) + ' arguments are required, ' + (length + 1) + ' given.');
    }

    // Enforce max precision allowed in JavaScript (53).
    if (precision > MAX_PRECISION) {
      throw new Error("Requested precision of " + precision + " digits was truncated to JS maximum of " + MAX_PRECISION  + " digits");
    }

    // Build argument array:
    // [value, padding, flag, width, precision, originalValue]
    args = [padding, flag, width, precision, value];

    /**
     * Convert argument types before applying specifier handler:
     * - Strings  → always stringified
     * - Floats   → parsed as float
     * - Integers → parsed as int
     */
    args.unshift(rstrspecifier.test(specifier)
      ? value + "" : (rfloatspecifier.test(specifier)
        ? parseFloat(value)
        : parseInt(value)
      ) || 0
    );

    return fn.apply(specifiers, args);
  };
}

function doFormat(format, values) {
  return format.replace(rswap, '%$2$1').replace(rspecifier, fnFormat(values));
}

return {

  /**
   * Format a string using C-style and PHP-style specifiers.
   * 
   * @param {string} format The format string
   * @param {...any} values The values to insert
   * @returns {string} Return a formatted string
   */
  sprintf: function(format) {
    return doFormat(format, slice.call(arguments, 1));
  },

  /**
   * Format a string using an array of values.
   * 
   * @param {string} format The format string
   * @param {Array} values Array of values
   * @returns {string} Return a formatted string
   */
  vsprintf: function(format, values) {
    return doFormat(format, values);
  },

  /**
   * Print a formatted string directly to the console.
   * 
   * @param {string} format The format string
   * @param {Array} values Array of values
   */
  vprintf: function(format, values) {
    Console.log(doFormat(format, values));
  },

  /**
   * Print a formatted string directly to the console.
   * 
   * @param {string} format The format string
   * @param {...any} values The values to insert
   */
  printf: function(format) {
    Console.log(doFormat(format, slice.call(arguments, 1)));
  }
};
});