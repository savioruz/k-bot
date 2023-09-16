class Media {
  constructor(chat) {
    this.chat = chat;
  }

  async sendMedia(msg, client) {
    try {
      if (msg.body === COMMAND_IMAGE) {
        const imageUrl = "https://pic.re/image";
        const fullPath = `.wwebjs_cache/image_${Date.now()}.jpg`;
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        try {
          await writeFileAsync(fullPath, response.data);
          console.log("[info] Save image success");
        } catch {
          console.error("[error] Failed to save image");
        }
        const media = MessageMedia.fromFilePath(fullPath);
        try {
          await this.chat.sendReply(msg, media);
        } finally {
          await unlinkAsync(fullPath);
          console.log("[info] Image deleted");
        }
      } else if (msg.body === COMMAND_RESEND_MEDIA && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
          const attachmentData = await quotedMsg.downloadMedia();
          await client
            .sendMessage(msg.from, attachmentData, {
              caption: "Here's your requested media.",
            })
            .then((result) => {
              console.log("[info] Result: ", result);
            })
            .catch((err) => {
              console.error("[error] Failed to send media: ", err);
            });
        }
        if (quotedMsg.hasMedia && quotedMsg.type === "audio") {
          const audio = await quotedMsg.downloadMedia();
          await client
            .sendMessage(msg.from, audio, { sendAudioAsVoice: true })
            .then((result) => {
              console.log("[info] Result: ", result);
            })
            .catch((err) => {
              console.error("[error] Failed to send media: audio", err);
            });
        }
      }
    } catch (err) {
      console.error("[error] Failed when sending image: ", err);
    }
  }
}

const Chat = require("../vendor/chat");
const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");
const fs = require("fs");
const { promisify } = require("util");

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const COMMAND_IMAGE = "/image";
const COMMAND_RESEND_MEDIA = "/resendmedia";

const chat = new Chat();
const media = new Media(chat);

module.exports = media;
