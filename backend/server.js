require('dotenv').config();
const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoutes = require('./routes/userRoutes')
const cardRoutes = require('./routes/cardRoutes')

//init app
const app = express();
const port = 8080;


// Connect to the database (check if needed)
connection();

//middleware
app.use(express.json());
app.use(cors());

//routes -middleware router "const router = express.Router();"
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);



app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})