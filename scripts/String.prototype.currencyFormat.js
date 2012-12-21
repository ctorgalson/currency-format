/**
 * @file
 * Provides string function for converting currency-formatted strings to strings
 * ready for float conversion, and string function for converting newly stringified
 * floats into currency format. See comments for details.
 *
 * @author Christopher Torgalson <manager@bedlamhotel.com>
 */


/**
 * String prototype function to format a string of digits and (possibly) a
 * decimal as currency. Expected to be used on a float cast as a string.
 *
 * Note that we deliberately do NOT add decimals to incoming values that don't
 * already have them. This makes it possible to format for currencies such as
 * the Korean Won or Japanese Yen where units valued < 1 are rarely or never
 * shown.
 *
 * In cases where calculations may yield values with no decimals, but decimals
 * should be shown, use toFixed(2) on the float before casting to string.
 *
 * For example:
 *
 *  // This code returns an alert box containing "$ 123,456.78":
 *  var exampleFloat = 123456.78901234456789,
 *      exampleString = String(float.toFixed(2));
 *  alert(exampleString.currencyFormat('$ ', ',', '.'));
 *
 * @param string symbol
 *    Currency symbol such as '$', &euro; etc
 * @param string groupSeparator
 *    Separator for thousands; usually comma, space or period
 * @param string decimalSeparator
 *    Separator for 'cents'; usually period or comma. NOTE: this value is used
 *    only to separate the 'dollars' from the 'cents' within the function. It
 *    does NOT replace the decimal in the incoming value.
 * @return string output
 *    Formatted currency string
 *
 * @todo
 *    Make it possible to alter the position of the currency symbol by, e.g.
 *    providing a pattern something like "%symbol %dollars%cents".
 * @version 1.0
 */
String.prototype.currencyFormat = function(symbol, groupSeparator, decimalSeparator) {
    // No matter the circumstances, we need an output variable:
    var output = '';
    // We only do this the hard way if there is an incoming value for
    // groupSeparator. It's hard to see why this function would be called
    // without it, but it's not hard to check:
    if (groupSeparator !== '') {
      // Variables we'll need for this job:
      var decimalPosition = this.lastIndexOf(decimalSeparator), // Where is the decimal?
          decimals = decimalPosition > -1 ? this.slice(decimalPosition) : '', // Separate the 'cents' if any...
          digits = decimalPosition > -1 ? this.slice(0, decimalPosition).split('').reverse(): this.split('').reverse(), // Separate out and reverse the 'dollars' only...
          digitsLength = digits.length, // Find out how many places of 'dollars' we're dealing with...
          units = ''; // We need a variable for the formatted string...
      // Loop through the reversed digits:
      for (var i in digits) {
        // At each iteration, add the latest digit to the LEFT of the string...
        units = digits[i] + units;
        // If the iterator is evenly divisible by 3, and if this is not the last
        // digit, we also need to add the separator:
        if ((i + 1) % 3 === 0 && i < digitsLength - 1) {
          units = groupSeparator + units;
        }
      }
      // Concatenate the various parts:
      output = symbol + units + decimals;
    }
    // Otherwise, just give back what we got in with a currency symbol:
    else {
      output = symbol + this;
    }
    // Return the processed string:
    return output;
}; /* String.prototype.currencyFormat */


/**
 * String prototype function to UN-format currency strings such as may be found
 * in html in preparation for calculation. Should obviously only be called on
 * string values, and will usually be passed through parseFloat().
 *
 * For example:
 *
 *  // This code returns an alert box containing "12345678.90":
 *  var exampleString = 'Total: $ 12,345,678.90 (annual)',
 *      exampleFloat = parseFloat(exampleString.currencyUnformat());
 *  alert(exampleFloat);
 *
 * Note that, given the simplicity of the code, digits in the incoming string
 * that are NOT part of the currency amount WILL be incorporated into the
 * resulting float and should either be removed prior to calling this function,
 * or should be removed by passing a more suitable regular expression to this
 * function.
 *
 * @param string regex
 *    The regx used to match everything EXCEPT the digits and decimal marker
 *    to be retained. If not specified, the default value /[^\d|^\.]+/g will
 *    be used. The most common reason for overriding this parameter is to deal
 *    with a decimal marker other than ','--a simple regex can't preserve both
 *    ',' and '.', since we may have incoming strings such as "$1.234,56" or
 *    "$1,234.56"
 *  @return string
 *    The incoming value with all non-numeral and non-decimal characters
 *    removed.
 */
String.prototype.currencyUnformat = function(regex) {
  var pattern = regex ? regex : /[^\d|^\.]+/g;
  return this.replace(pattern, '');
}; /* String.prototype.currencyUnformat */