// getting-started.js
const mongoose = require('mongoose');
require('dotenv').config(); 

const URI = process.env.MONGODB_URI 

main()
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(URI);
}
 
module.exports = main;