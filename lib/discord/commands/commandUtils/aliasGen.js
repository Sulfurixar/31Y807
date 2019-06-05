function aliasGen(name) {
  var aliases = [name.toLowerCase()];
  let tmpAliases = name.split(/(?=[A-Z])/);
  aliases.push(tmpAliases[0][0].toLowerCase());
  for (let i in tmpAliases) {
    tmpAliases[i] = tmpAliases[i][0].toLowerCase();
  }
  aliases = appendAlias(tmpAliases.join(''), aliases);
  tmpAliases = name.toLowerCase().split(/(?=[aeiouAEIOU])./g).join('');
  tmpAliases = tmpAliases.split(/(.)\1+/g).join('');
  aliases = appendAlias(tmpAliases, aliases);
  return aliases;
}

function appendAlias(alias, aliases) {
  if (!aliases.includes(alias)) {
    aliases.push(alias);
  }
  return aliases;
}

exports.aliasGen = aliasGen;
