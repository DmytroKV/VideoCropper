const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Child_process = require("child_process");
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const storageConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
app.use(multer({storage: storageConfig}).single('file'));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/uploads", express.static(__dirname + '/../uploads'));
app.use("/tmp", express.static(__dirname + '/../tmp'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

  app.post("/video", (req, res) => {

    //storing file data   
    let filedata = req.file;
    //getting path file for processing
    let pathFile = filedata.path;
    //getting file name for crop command
    let fileUploadName = filedata.filename; 
    
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
        pathFile
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