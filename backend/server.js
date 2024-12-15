const express = require('express')
const port = 8080;
const cors = require('cors')



const app = express();
app.use(express.json());
app.use(cors());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})