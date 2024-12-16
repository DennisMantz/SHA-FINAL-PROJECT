const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoutes = require('./routes/userRoutes')
//init app
const app = express();
const port = 8080;

//middleware
app.use(express.json());
app.use(cors());

//routes -middleware router "const router = express.Router();"
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
    });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})