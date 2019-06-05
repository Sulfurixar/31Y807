exports.checkPerms = (member, permission, command) => {
  // if user or their roles have special permission for it
  // if user is server owner
  // if user is administrator
  // if access has been granted to everyone
  if (command.command.permissions[permission] === 'everyone') {
    return true;
  }
};
