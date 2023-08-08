const express = require('express')
const app = express();
const cors = require("cors")

const PORT = "4000";

app.use(cors)

const runServer = () => {
    app.listen(PORT, () => {
      console.log(`Live on port: ${PORT}`);
    });
  };


  runServer();


module.exports = app;