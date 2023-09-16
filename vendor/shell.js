const { exec } = require("child_process");

class Shell {
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(new Error(stderr));
          return;
        }
        resolve(stdout);
      });
    });
  }

  async executeNow(cmd) {
    try {
      const result = await this.executeCommand(cmd);
      return result;
    } catch (err) {
      console.error("[error] Failed to execute command: ", err);
      throw err;
    }
  }
}

module.exports = Shell;
