const { CronJob } = require("cron");
const fs = require("fs");
const Datastore = require("nedb");
const link = new Datastore({ filename: "./databases/links" });

module.exports = new CronJob(
  "00 00 00 * * *",
  () => {
    link.loadDatabase();
    link.find({}, (err, data) => {
      for (const entry of data) {
        if (new Date().getTime() >= entry.deleteDate) {
          try {
            const id = entry._id;
            link.remove({ _id: id });

            if (entry.imageEmbed && fs.existsSync(`./public/assets/img/${entry.URL}.jpg`)) {
              fs.unlinkSync(`./public/assets/img/${entry.URL}.jpg`);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  },
  null,
  true,
  "America/Los_Angeles"
).start();
