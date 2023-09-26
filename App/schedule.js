class Schedule {
  constructor(time, chat) {
    this.time = time;
    this.chat = chat;
  }

  async currentSchedule() {
    try {
      const dayOfWeek = await this.time.getDay();
      const currentMsg = msgDay[dayOfWeek];
      if (currentMsg) {
        console.log("[info] Current day: ", dayOfWeek);
      } else {
        console.log("[info] Unknown day");
      }
      return currentMsg;
    } catch (err) {
      console.error("[error] Failed to get day of week: ", err);
    }
  }

  sanitizeUser(phoneNumber) {
    return phoneNumber.match(/\d+/);
  }

  getPhoneNumber(msg) {
    const from = msg.author || "";
    const match = from.match(/\d+/);
    return match ? match[0] : "";
  }

  async scheduleTrigger(msg) {
    try {
      if (msg.body === COMMAND_SINGLE) {
        const replyMsg =
          "Schedule command usage: \n\n" +
          "```# |   Command   |Args|             Function        \n" +
          "--|-------------|----|-----------------------------\n" +
          " 1| /sched      |all | menampilkan semua jadwal    \n" +
          " 2| /sched      |now | menampilkan jadwal hari ini \n" +
          " 3| /sched      |set | menyimpan jadwal kamu       \n" +
          " 4| /sched      |me  | menampilkan jadwal kamu     \n" +
          " 5| /sched      |info| menampilkan jadwal orang    ```\n";

        await this.chat.sendReply(msg, replyMsg);
      } else if (msg.body === COMMAND_NOW) {
        const replyMsg =
          "Jadwal kelas hari ini: *" +
          (await this.time.getDate()) +
          "*\n" +
          (await this.currentSchedule());
        await this.chat.sendReply(msg, replyMsg);
      } else if (msg.body === COMMAND_ALL) {
        await this.chat.sendReply(msg, allSchedule);
      } else if (this.chat.startsWith(msg.body, COMMAND_SET)) {
        let param;

        if (msg.from.includes("@g.us")) {
          param = msg.author;
        } else {
          param = msg.from;
        }

        const fileName = `${this.sanitizeUser(param)}.txt`;
        const filePath = path.join(storageDirectory, fileName);
        const removeLine = msg.body.split("\n").slice(1);

        try {
          fs.writeFileSync(filePath, removeLine.join("\n"));
          await this.chat.sendReply(msg, "Berhasil menyimpan jadwal");
        } catch (err) {
          console.log("[error] Failed to save: ", err);
        }
      } else if (msg.body === COMMAND_ME) {
        let param;

        if (msg.from.includes("@g.us")) {
          param = msg.author;
        } else {
          param = msg.from;
        }

        const fileName = `${this.sanitizeUser(param)}.txt`;
        const filePath = path.join(storageDirectory, fileName);

        try {
          if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, "utf-8");
            await this.chat.sendReply(msg, `Jadwal kamu: \n${fileContents}`);
          } else {
            const msgReply =
              "Kamu tidak mempunyai jadwal tersimpan.\nCara menyimpan jadwal:\n/sched set\n1. jadwal ...\n2. jadwal ...\ndst...";
            await this.chat.sendReply(msg, msgReply);
          }
        } catch (err) {
          console.error("[error] Failed to fetch file: ", err);
        }
      } else if (msg.body === COMMAND_INFO && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        const phoneNumber = this.getPhoneNumber(quotedMsg);
        const fileName = `${this.sanitizeUser(phoneNumber)}.txt`;
        const filePath = path.join(storageDirectory, fileName);

        try {
          if (msg.from.includes("@g.us")) {
            if (fs.existsSync(filePath)) {
              const fileContents = fs.readFileSync(filePath, "utf-8");
              await this.chat.sendReply(msg, `Jadwal kamu: \n${fileContents}`);
            } else {
              const msgReply = "Tidak ada jadwal tersimpan";
              await this.chat.sendReply(msg, msgReply);
            }
          } else {
            await this.chat.sendReply(msg, "Pls use this command on group.");
          }
        } catch (err) {
          console.error("[error] Failed to fetch file: ", err);
        }
      }
    } catch (err) {
      console.error("[error] Failed when sending message: ", err);
    }
  }
}

const Chat = require("../vendor/chat");
const TimeDate = require("../vendor/time");
const fs = require("fs");
const path = require("path");

const storageDirectory = "./storage/users/";
const COMMAND_NOW = "/sched now";
const COMMAND_ALL = "/sched all";
const COMMAND_SET = "/sched set";
const COMMAND_ME = "/sched me";
const COMMAND_INFO = "/sched info";
const COMMAND_SINGLE = "/sched";

// table generate from: https://ozh.github.io/ascii-tables/
const msgDay = {
  Sunday: "Libur ndan 😁\n",
  Monday:
    "\n" +
    "```+--------------+-------+-------+----------+\n" +
    "|    Senin     | start |  end  |    🏢    |\n" +
    "+--------------+-------+-------+----------+\n" +
    "| P statistika | 12:00 | 15:00 | Daring   |\n" +
    "| statistika   | 15:15 | 17:50 | 4.1.5.69 |\n" +
    "+--------------+-------+-------+----------+\n```",
  Tuesday: "Libur ndan 😁\n",
  Wednesday:
    "\n" +
    "```+------------+-------+-------+------------+\n" +
    "|    Rabu    | start |  end  |     🏢     |\n" +
    "+------------+-------+-------+------------+\n" +
    "| database   | 09:35 | 12:10 | 4.1.5.60   |\n" +
    "| P database | 13:30 | 16:30 | Basis Data |\n" +
    "+------------+-------+-------+------------+\n```",
  Thursday:
    "\n" +
    "```+-------------+-------+-------+------------+\n" +
    "|    Kamis    | start |  end  |     🏢     |\n" +
    "+-------------+-------+-------+------------+\n" +
    "| P str. data | 09:00 | 10:30 | Kom. Dasar |\n" +
    "| P OS        | 10:30 | 12:00 | Kom. Dasar |\n" +
    "| P OOP       | 16:30 | 18:00 | Multimedia |\n" +
    "+-------------+-------+-------+------------+\n```",
  Friday:
    "\n" +
    "```+---------------+-------+-------+----------+\n" +
    "|     Jumat     | start |  end  |    🏢    |\n" +
    "+---------------+-------+-------+----------+\n" +
    "| struktur data | 14:15 | 16:05 | 4.1.5.55 |\n" +
    "+---------------+-------+-------+----------+\n```",
  Saturday:
    "\n" +
    "```+---------+-------+-------+----------+\n" +
    "|  Sabtu  | start |  end  |    🏢    |\n" +
    "+---------+-------+-------+----------+\n" +
    "| OOP     | 08:45 | 10:25 | 4.1.5.57 |\n" +
    "| English | 10:30 | 12:10 | 4.1.4.53 |\n" +
    "| OS      | 12:30 | 14:10 | Daring   |\n" +
    "| Aqidah  | 15:15 | 16:05 | 4.1.4.35 |\n" +
    "+---------+-------+-------+----------+\n```",
};

const allSchedule =
  "```\n" +
  "Hari |    Matkul    | start |  end  |    🏢    \n" +
  "-----|--------------|-------|-------|--------- \n" +
  "Senin| P statistika | 12:00 | 15:00 | Daring   \n" +
  "Senin| statistika   | 15:15 | 17:50 | 4.1.5.69 \n" +
  "Rabu | database     | 09:35 | 12:10 | 4.1.5.60 \n" +
  "Rabu | P database   | 13:30 | 16:30 | Bs. Data \n" +
  "Kamis| P str. data  | 09:00 | 10:30 | Kom. Das \n" +
  "Kamis| P OS         | 10:30 | 12:00 | Kom. Das \n" +
  "Kamis| P OOP        | 16:30 | 18:00 | M. media \n" +
  "Jumat| str. data    | 14:15 | 16:05 | 4.1.5.55 \n" +
  "Sabtu| OOP          | 08:45 | 10:25 | 4.1.5.57 \n" +
  "Sabtu| English      | 10:30 | 12:10 | 4.1.4.53 \n" +
  "Sabtu| OS           | 12:30 | 14:10 | Daring   \n" +
  "Sabtu| Aqidah       | 15:15 | 16:05 | 4.1.4.35 \n```";

const time = new TimeDate();
const chat = new Chat();
const schedule = new Schedule(time, chat);

module.exports = schedule;
