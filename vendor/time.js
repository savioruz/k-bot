class TimeDate {
  async fetchTime() {
    try {
      const response = await fetch(
        "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta"
      );

      const data = await response.json();

      return data;
    } catch (err) {
      console.log("[error] Failed to fetch current date and time: ", err);
    }
  }

  async getDay() {
    try {
      const data = await this.fetchTime();
      const dayOfWeek = data.dayOfWeek;

      return dayOfWeek;
    } catch (err) {
      console.error("[error] Failed to fetch day: ", err);
      return null;
    }
  }

  async getDate() {
    try {
      const data = await this.fetchTime();
      const currentDate = `${data.dayOfWeek}, ${data.date}`;
      return currentDate;
    } catch (err) {
      console.error("[error] Failed to fetch date: ", err);
      return null;
    }
  }
}

const fetch = require("node-fetch");

module.exports = TimeDate;
