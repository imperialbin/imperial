const CronJob = require('cron').CronJob;
const fs = require('fs');
const Datastore = require('nedb');
const link = new Datastore({ filename: './databases/links' });

module.exports = new CronJob('00 00 00 * * *', () => {
  link.loadDatabase();
  link.find({}, (err, data) => {
    console.log('attempting')
    for (var entry = 0, len = data.length; entry < len; entry++) {
      if (new Date().getTime() >= data[entry].deleteDate) {
        try {
          const id = data[entry]._id;
          fs.unlink(`./pastes/${data[entry].URL}.txt`, err => {
            if (err) return err;
            link.remove({ _id: id })
          })
          if (data[entry].imageEmbed) {
            fs.unlink(`./public/assets/img/${data[entry].URL}.jpeg`, err => { if (err) console.log(err) })
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
}, null, true, 'America/Los_Angeles').start();