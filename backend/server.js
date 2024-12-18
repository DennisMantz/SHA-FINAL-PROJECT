require('dotenv').config();
const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoutes = require('./routes/userRoutes')

//init app
const app = express();
const port = 8080;


// Connect to the database
connection();

//middleware
app.use(express.json());
app.use(cors());

//routes -middleware router "const router = express.Router();"
app.use("/users", userRoutes);



app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})