const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Child_process = require("child_process");
const { v4: uuidv4 } = require('uuid');

var fs = require('fs');
var ffmpeg = require('ffmpeg');

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/tmp", express.static(__dirname + '/../tmp'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

  app.post("/video", (req, res) => {
    var filename = __dirname + '/../tmp/' + uuidv4() + '.avi';

    Child_process.execSync(
      'ffmpeg -i /home/ooyashi/Documents/VideoCropperClone/VideoCropper/1280.avi -s 1280x720 -vf crop=720:720,setdar=1:1,setsar=1:1 ' + filename
    )
    
    res.json({videoURL : "/tmp/" + filename});
  });
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})
/*
Child_process.execSync(
  `ffmpeg -i ${
    video
  } -s ${width}x${height} -vf crop=${size}:${size},setdar=1:1,setsar=1:1 ${
    uploadingPath
  }`
  */