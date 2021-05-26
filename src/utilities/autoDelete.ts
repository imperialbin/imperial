import { CronJob } from "cron";
import { Documents } from "../models/Documents";
import { existsSync, unlinkSync } from "fs";

export default new CronJob("00 00 00 * * *", async () => {
  console.log("Running deletion");
  const documentsReadyToBeDelete = await Documents.find({
    deleteDate: { $lte: Number(new Date().getTime()) },
  });

  for (const document of documentsReadyToBeDelete) {
    await Documents.deleteOne({ _id: document._id });
    try {
      if (
        document.imageEmbed &&
        existsSync(`../public/assets/img/${document.URL}.jpg`)
      ) {
        unlinkSync(`../public/assets/img/${document.URL}.jpg`);
      }
    } catch (err) {
      console.log(err);
    }
  }
}).start();
