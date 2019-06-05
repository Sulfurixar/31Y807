function checkAliases(commands) {
  var aliases = [];
  var disabledAliases = [];
  for (let key in commands) {
    aliases.push(commands[key].command.aliases);
  }
	for (let i in aliases) {
    var aliases2 = aliases.slice(i+1);
    if (aliases2.length !== 0){
      for (let j in aliases2) {
        var aliasGroup = aliases[i];
        var aliasGroup2 = aliases2[j];
        for (let k in aliasGroup) {
          var alias = aliasGroup[k];
          for (let l in aliasGroup2) {
            if (alias === aliasGroup2[l]) {
              disabledAliases.push(alias);
            }
          }
        }
      }
    }
  }
  return disabledAliases;
}

exports.checkAliases = checkAliases;
