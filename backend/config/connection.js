// getting-started.js
const mongoose = require('mongoose');

const URI ="mongodb+srv://dmantzavinatos:SVhg3aXgrA45iNRN@syncbrodata.gquwu.mongodb.net/?retryWrites=true&w=majority&appName=SyncBroData";

main()
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
 
module.exports = main;