class Chat {
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
