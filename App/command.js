class Command {
  constructor(shell, chat) {
    this.shell = shell;
    this.chat = chat;
  }

  async list(msg, client) {
    const startTime = process.hrtime();
    try {
      if (msg.body === COMMAND_PING) {
        const pingCmd = "ping -c 1 pps.whatsapp.net | grep -oP 'time=\\K\\S+'";
        const cmdResult = await this.shell.executeNow(pingCmd);
        const endTime = process.hrtime(startTime);
        const timeElapsed = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);
        const totalTime = (
          parseFloat(timeElapsed) + parseFloat(cmdResult)
        ).toFixed(2);
        const replyMsg = `🏓 Pong !!! ${totalTime} ms`;
        await this.chat.sendReply(msg, replyMsg);
      } else if (msg.body === COMMAND_HELP) {
        const endTime = process.hrtime(startTime);
        const timeElapsed = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);
        const replyMsg = `${helpMsg}\n\nDone in ${timeElapsed} ms`;
        await this.chat.sendReply(msg, replyMsg);
      } else if (msg.body === COMMAND_ABOUT) {
        const audioPath = "./storage/about.mp3";
        const audioData = MessageMedia.fromFilePath(audioPath);
        await this.chat.sendReply(msg, aboutMsg);
        await client
          .sendMessage(msg.from, audioData, { sendAudioAsVoice: true })
          .then((result) => {
            console.log("[info] Result: ", result);
          })
          .catch((err) => {
            console.error("[error] Failed to send voice: ", err);
          });
      }
    } catch (error) {
      console.error("[error] An error occurred:", error);
    }
  }
}

const Shell = require("../vendor/shell");
const Chat = require("../vendor/chat");
const { MessageMedia } = require("whatsapp-web.js");

const COMMAND_PING = "/ping";
const COMMAND_HELP = "/help";
const COMMAND_ABOUT = "/about";

const helpMsg =
  "list command: \n\n" +
  "/sched all - menampilkan semua jadwal\n" +
  "/sched now - menampilkan jadwal hari ini\n" +
  "/sched set - menyimpan jadwal kamu\n" +
  "/sched me - menampilkan jadwal kamu\n" +
  "/sched info - untuk menampilkan jadwal dia\n" +
  "/tr - untuk translate en -> id\n" +
  "/image - generate random anime image\n" +
  "/resendmedia - resend media, tested: image,voice\n" +
  "/ping - check latency to whatsapp server\n" +
  "/help - menampilkan menu bantuan\n" +
  "/about - tentang k-bot\n\n" +
  "in order to get better experience pls setting font size to *small* on ```Settings > Chats > Font Size```";

const aboutMsg =
  "k-bot is a whatsapp bot made with library wweb.js\n" +
  "this bot is made with ❤️ by Rill\n" +
  "if you encounter problem pls contact t.me/pethot";

const shell = new Shell();
const chat = new Chat();
const command = new Command(shell, chat);

module.exports = command;
