const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Child_process = require("child_process");

var fs = require('fs');
var ffmpeg = require('ffmpeg');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

     //ffmpeg -i /home/ooyashi/Downloads/small.mp4 -f ffmetadata - checking metadata by vscode terminal
  app.post("/video", (req, res) => {
    const uploadingPath = __dirname;

    Child_process.execSync(
      'ffmpeg -i /home/ooyashi/Documents/VideoCropperClone/VideoCropper/1280.avi -s 1280x720 -vf crop=720:720,setdar=1:1,setsar=1:1 1280_1.avi'
    )
  });
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})