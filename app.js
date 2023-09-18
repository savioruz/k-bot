const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const command = require("./App/command");
const schedule = require("./App/schedule");
const media = require("./App/media");
const notify = require("./App/notify");
const translate = require("./App/translate");

let rejectCalls = true;
const myGroup = "120363160807612693@g.us";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    puppeteer: {
      args: [
        "--no-sandbox",
        "--disable-web-security",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-sync",
        "--disable-translate",
        "--hide-scrollbars",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-first-run",
        "--safebrowsing-disable-auto-update",
        "--ignore-certificate-errors",
        "--ignore-ssl-errors",
        "--ignore-certificate-errors-spki-list",
      ],
    },
    headless: true,
  },
});

try {
  const res = client.initialize();
  console.log("[info] Initializing: ", res);
} catch (error) {
  console.error("[error] Failed to initialzie: ", error);
}

client.on("qr", (qr) => {
  try {
    console.log("[info] Qr received", qr);
    qrcode.generate(qr, { small: true });
  } catch (err) {
    console.error("[error] Failed to received qr: ", err);
  }
});

client.on("authenticated", () => {
  try {
    console.log("[info] Authenticated");
  } catch (err) {
    console.error("[error] Failed to get auth: ", err);
  }
});

client.on("ready", async () => {
  try {
    console.log("[info] Client ready");

    await client
    .sendMessage(myGroup, "Bot is alive")
    .then((result) => {
      console.log("[info] Result: ", result);
    })
    .catch((err) => {
      console.error("[error] Failed to send message: ", err);
    });

    await notify.job(myGroup, client);
  } catch (err) {
    console.error("[error] Client failed to start: ", err);
  }
});

client.on("call", async (call) => {
  console.log("Call received, rejected", call);
  if (rejectCalls) await call.reject();
  await client.sendMessage(
    call.from,
    `[${call.fromMe ? "Outgoing" : "Incoming"}] Phone call from ${
      call.from
    }, type ${call.isGroup ? "group" : ""} ${
      call.isVideo ? "video" : "audio"
    } call. ${
      rejectCalls ? "This call was automatically rejected by the script." : ""
    }`
  );
});

client.on("message", async (msg) => {
  console.log("[info] Received new message: ", msg);
  await command.list(msg, client);
  await schedule.scheduleTrigger(msg);
  await media.sendMedia(msg, client);
  await translate.sendTranslate(msg);
});
