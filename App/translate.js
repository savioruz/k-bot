class Translate {
  constructor(chat) {
    this.chat = chat;
  }

  async doTranslate(apiKey, queries, source = "en", target = "id") {
    const encodedParams = new URLSearchParams();
    encodedParams.set("source", source);
    encodedParams.set("target", target);
    encodedParams.set("q", queries);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      console.log("[error] Failed to fetch url translation: ", err);
    }
  }

  async sendTranslate(msg) {
    try {
      let text;

      if (msg.body === COMMAND_TR) {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.body) {
                text = quotedMsg.body;
            }
            const request = await this.doTranslate(key, text);
            const result = request.data.translations[0].translatedText;

            await this.chat.sendReply(msg, `Translate result:\n${result}`);
        } else {
            await this.chat.sendReply(msg, "Quote chat to translate !");
        }
      }
    } catch (err) {
      console.log("[error] Failed to send translate: ", err);
    }
  }
}

const Chat = require("../vendor/chat");
const axios = require("axios");

const key = "d5d4e9bb7cmshfb961a1e2c72fd1p13586fjsn984a527fb6cb";
const COMMAND_TR = "/tr";

const chat = new Chat();
const translate = new Translate(chat);

module.exports = translate;
