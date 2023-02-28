export function getHexTime(hexString, startTimestamp) {
  // Convert the hexadecimal string to a decimal number of seconds
  let seconds = parseInt(hexString, 16);

  // Calculate the difference between the start timestamp and the current time in milliseconds
  let timeDifference = Date.now() - startTimestamp;

  // Add the time difference to the number of seconds
  seconds += Math.floor(timeDifference / 1000);

  // Convert the result back to a hexadecimal string
  let hexValue = seconds.toString(16);

  // Pad the string with zeros if necessary
  while (hexValue.length < hexString.length) {
    hexValue = '0' + hexValue;
  }

  return hexValue;
}
/**
 *
 * @param hexString - hex string to split
 * @param offset - offset to apply to the hex string, in seconds
 * @returns
 */
export function splitHexIntoHighAndLow(hexString, offset) {
  // Convert the hexadecimal string to a decimal number of seconds
  let seconds = parseInt(hexString, 16);
  let secondsWithOffset = seconds + offset;
  // Convert the result back to a hexadecimal string
  let hexValue = secondsWithOffset.toString(16);
  // Split the hexadecimal string into two parts
  let utcLowHex = hexValue.slice(-8); // last 8 hex digits (low-order bits)
  let utcHighHex = hexValue.slice(0, -8); // the rest (high-order bits)

  // Convert the high-order and low-order hex strings to decimal numbers
  let utcHigh = parseInt(utcHighHex, 16);
  let utcLow = parseInt(utcLowHex, 16);

  // Return an object with the utc_high and utc_low values
  return { utc_high: utcHigh, utc_low: utcLow };
}
