function deleteMessage(client, message) {
  if (client.user.id === message.author.id) {
    message.delete();
  } else {
    let p = message.channel.permissionsFor(client.user).serialize().MANAGE_CHANNELS;
    if (p) {
      message.delete();
    }
  }
}

exports.deleteMessage = deleteMessage;
