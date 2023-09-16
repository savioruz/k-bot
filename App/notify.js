class Notify {
  constructor(time, schedule) {
    this.time = time;
    this.schedule = schedule;
  }

  async msg() {
    const data = {
      msg: null,
      time: null,
    };

    try {
      data.msg = await this.schedule.currentSchedule();
      data.time = await this.time.getDate();
      console.log("[info] Result: ", data.time, data.msg);
    } catch (err) {
      console.error("[error] Failed to fetch schedule and time: ", err);
    }

    return data;
  }

  async job(msg, client) {
    const cronJob = {
      PStatistika: "45 11 * * 1",
      Statistika: "7 15 * * 1",
      Database: "28 9 * * 3",
      PDatabase: "15 13 * * 3",
      PStrdata: "45 8 * * 4",
      POs: "20 10 * * 4",
      POop: "30 16 * * 4",
      Strdata: "55 13 * * 5",
      Oop: "38 8 * * 6",
      Os: "15 12 * * 6",
      Eng: "0 16 * * 6",
      Aqidah: "50 16 * * 6",
    };

    const data = await this.msg();
    const text = `Jadwal: ${data.time}\n${data.msg}`;

    for (let jobName in cronJob) {
      cron.scheduleJob(cronJob[jobName], () => {
        client
          .sendMessage(msg, text)
          .then((result) => {
            console.log("[info] Result: ", result);
          })
          .catch((err) => {
            console.error("[error] Failed to send message: ", err);
          });
      });
    }
  }
}

const TimeDate = require("../vendor/time");
const Schedule = require("./schedule");
const cron = require("node-schedule");

const time = new TimeDate();
const notify = new Notify(time, Schedule);

module.exports = notify;
