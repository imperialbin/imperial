import { CronJob } from "cron";
import { Documents, IDocument } from "../models/Documents";
import fs from "fs";

export default new CronJob("00 00 00 * * *", () => {
  Documents.find({}, (err: string, documents: Array<IDocument>) => {
    for (const document of documents) {
      if (Number(new Date().getTime) >= document.deleteDate) {
        try {
          const _id = document._id;
          Documents.remove({ _id });
          if (
            document.imageEmbed &&
            fs.existsSync(`../public/assets/img/${document.URL}.jpg`)
          )
            fs.unlinkSync(`../public/assets/img/${document.URL}.jpg`);
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}).start();
