const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Child_process = require("child_process");
const { v4: uuidv4 } = require('uuid');

var fs = require('fs');
var ffmpeg = require('ffmpeg');
var ffmpeg_fluent = require('fluent-ffmpeg');

ffmpeg_fluent.setFfprobePath('/snap/bin/ffmpeg.ffprobe');

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
    //storing file data
    let file = req.files.file;
    //getting temporary path file for processing
    let pathFile = file.tempFilePath;
    //getting file name for crop command
    let fileUploadName = file.name; 

    var width; 
    var height;

    //getting width and height from ffmpeg command
    width = Child_process.execSync(
      `ffprobe -v error -show_entries stream=width -of csv=p=0:s=x ${
        pathFile}`
    )
    height = Child_process.execSync(
      `ffprobe -v error -show_entries stream=height -of csv=p=0:s=x ${
        pathFile}`
    )
    //parsing integers from result strings (I know, bad approach, 
    //but no ffmpeg libraries have given me such info :/)

    let realWidth = parseInt(width, 10);
    let realHeight = parseInt(height, 10);

    //file info
    console.log('File ' + fileUploadName + ' has resolution of ' + realWidth + 'x' + realHeight);
    
    //unique name for processed video
    var filename = __dirname + '/../tmp/' + uuidv4() + '.avi';
    
    Child_process.execSync(
      `ffmpeg -i ${
        fileUploadName
      } -s ${realWidth}:${realHeight} -vf crop=${realHeight}:${realHeight},setdar=1:1,setsar=1:1 ` + filename
    )
    
    //video url for download
    res.json({videoURL : filename});
    
  });
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})
//WIDTH
//ffprobe -v error -show_entries stream=width -of csv=p=0:s=x /home/ooyashi/Documents/VideoCropperClone/VideoCropper/1280.avi
//HEIGHT
//ffprobe -v error -show_entries stream=height -of csv=p=0:s=x /home/ooyashi/Documents/VideoCropperClone/VideoCropper/1280.avi