class Chat {
  startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
  }

  async sendMsg(msg, client, text) {
    await client
      .sendMessage(msg.from, text)
      .then((result) => {
        console.log("[info] Result: ", result);
      })
      .catch((err) => {
        console.error("[error] Failed to send message: ", err);
      });
  }

  async sendReply(msg, text) {
    await msg
      .reply(text)
      .then((result) => {
        console.log("[info] Result: ", result);
      })
      .catch((err) => {
        console.error("[error] Failed to reply message: ", err);
      });
  }
}

module.exports = Chat;
