const express = require('express')
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

const PORT = "4000";

app.use(cors());
app.use(express.json())
app.use(bodyParser.json());

app.use("/api", require("./api"));


const runServer = () => {
    app.listen(PORT, () => {
      console.log(`Live on port: http://localhost:${PORT}/`);
    });
  };


  runServer();


module.exports = app; 