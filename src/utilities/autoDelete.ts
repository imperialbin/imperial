import { CronJob } from "cron";
import fs from "fs";
import Datastore from "nedb";

const link = new Datastore({ filename: "../databases/links" });

export default new CronJob("00 00 00 * * *", () => {
  link.loadDatabase();
  link.find({}, (err: string, documents: Array<any>) => {
    for (const document of documents) {
      if (new Date().getTime >= document.deleteDate) {
        try {
          const _id = document._id;
          link.remove({ _id });

          if (
            document.imageEmbed &&
            fs.existsSync(`../public/assets/img/${document.URL}.jpg`)
          ) {
            fs.unlinkSync(`../public/assets/img/${document.URL}.jpg`);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}).start();
