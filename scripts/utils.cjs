const fs =require("fs")
const path =require("path")

/**
 * Logs an error message to the console and exits the process with code 1.
 * @param {string} message - The error message to log.
 */
 function logErrorAndExit(message) {
  console.log(addPunctuation(message))
  console.log(colorizeString("Cancelling script.", 1))
  process.exit(1)
}

/**
 * Adds specified punctuation mark (or a default dot ".") to the end of a string, ensuring that the string does not already end with !, ?, or ., and trims any whitespaces.
 *
 * @param {string} str - The input string.
 * @param {string} [punctuation=."] - The punctuation mark to add.
 * @returns {string} - The string with the specified punctuation mark added to the end, if necessary.
 */
function addPunctuation(str, punctuation =".") {
  const trimmedStr =str.trim()
  return trimmedStr.endsWith(".") || trimmedStr.endsWith("!") || trimmedStr.endsWith("?")
    ? trimmedStr
    : trimmedStr + punctuation
}

/**
 * Returns a string colored according to the specified input.
 * @param {string} input - The input string to color.
 * @param {number} color - The color code to apply to the string.
 * @param {boolean} [reset=true] - If true, reset the color to default at the end of the string
 * @returns {string} - The colored string.
 */
function colorizeString(input, color, reset =true) {
  return `\x1b[${30 + color}m${input}${reset ? "\x1b[39m" : ""}`
}

/**
 * Creates a file in a specified workspace directory and logs a success message.
 * @param {string} filePath - The name of the file to create.
 * @param {string} fileContent - The content of the file to create.
 * @param {number} [color=2] - The color of the filename in success message.
 * @param {number} [depth=2] - How many parent directories should be printed
 */
function createFileAndLogSuccess(filePath, fileContent,color =2,depth =3) {
  const fileName =path.parse(filePath).base
  const fileParents =filePath.replace(/^(\.+)?\//,"").match(/\/?[^\/]+/g) || []

  const detailedDir =fileParents.length < 2 ? "" : ".." +fileParents.splice(fileParents.length -depth,depth -1).join("") +"/" +fileName

  try {
    fs.writeFileSync(filePath,fileContent.trim().concat("\n"))
    console.log(`${colorizeString("Successfully",2)} created file "${colorizeString(fileName,color)}".\n${colorizeString(detailedDir,0)}`)

  } catch (error) {
    logErrorAndExit(`An error occurred while creating file "${fileName}": ${colorizeString(error,1)}`)
  }
}

/**
 * Parse a string to its respective type
 *
 * @param {string} input - The input string to parse
 * @returns {(number|string|object|boolean|null)} The type of the parsed input
 */
function getTypeFromString(input) {
  try {
    return typeof JSON.parse(input.replace(/"?([a-zA-Z0-9]*)"?:/g, '"$1":'))
  }
  catch (_) {
    logErrorAndExit(`An error occurred while parsing input: ${colorizeString(input,1)}`)
  }
}


module.exports ={ addPunctuation, colorizeString, logErrorAndExit, createFileAndLogSuccess, getTypeFromString }
