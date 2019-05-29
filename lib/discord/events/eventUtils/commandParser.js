function parser(data) {
  // Get JSON
  const regexp = /((?<!\[\s*)(?<!,\s*))\[.*?(\]((?!\s*\])(?!\s*,)))|(?<!\{\s*)(?<!,\s*)\{.*?(\}((?!\s*\})(?!\s*,)))|(\S*)(".*?")|(\S*)/g;
  var jsonStrings = [];
  while((match = regexp.exec(data)) !== null && match[0] !== "") {
    jsonStrings.push(match[0]);
  }
  return jsonStrings;
}

exports.parse = parser;
