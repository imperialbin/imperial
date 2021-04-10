import { CronJob } from "cron";
import { Documents, IDocument } from "../models/Documents";
import { existsSync, unlinkSync } from "fs";

export default new CronJob("00 00 00 * * *", () => {
  Documents.find({}, (err: string, documents: Array<IDocument>) => {
    for (const document of documents) {
      if (Number(new Date().getTime) >= document.deleteDate) {
        try {
          const _id = document._id;
          Documents.deleteOne({ _id });
          if (
            document.imageEmbed &&
            existsSync(`../public/assets/img/${document.URL}.jpg`)
          )
            unlinkSync(`../public/assets/img/${document.URL}.jpg`);
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}).start();
