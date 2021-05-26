import { CronJob } from "cron";
import { Documents } from "../models/Documents";
import { s3 } from "./aws";

export default new CronJob("00 00 00 * * *", async () => {
  console.log("Running deletion");
  const documentsReadyToBeDelete = await Documents.find({
    deleteDate: { $lte: Number(new Date().getTime()) },
  });

  for (const document of documentsReadyToBeDelete) {
    await Documents.deleteOne({ _id: document._id });
    try {
      if (document.imageEmbed)
        await s3
          .deleteObject({
            Bucket: "imperial",
            Key: `${document.URL}.jpg`,
          })
          .promise();
    } catch (err) {
      console.log(err);
    }
  }
}).start();
