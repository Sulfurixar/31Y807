function exec(client, message, database, functions) {
  //// TODO:
  for (let f in functions) {
    try {
      functions[f].func(client, message, database);
    } catch (e) {
      console.log(e);
    }
  }
}

exports.exec = exec;
