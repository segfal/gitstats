const express = require('express')
const app = express();
const cors = require("cors")

const PORT = "4000";

app.use(cors());
app.use(express.json())


app.use("/api", require("./api"));


const runServer = () => {
    app.listen(PORT, () => {
      console.log(`Live on port: ${PORT}`);
    });
  };


  runServer();


module.exports = app; 