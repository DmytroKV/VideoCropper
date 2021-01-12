const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

var fs = require('fs');
var ffmpeg = require('ffmpeg');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
/*
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
  */
  app.post("/video", (req, res) => {

    //var spawn = require('child_process').spawn;
    //var cmd = '/snap/bin/ffmpeg';
    var path = '/home/ooyashi/Downloads/small.mp4'
    /*
    var args = [
      '-i', '/home/ooyashi/Downloads/small.mp4',
      '-f', 'ffmetadata'
    ];
    */
    //var process = spawn(cmd, args)
    //var file = fs.readFileSync(path, 'binary');
    //ffmpeg -i /home/ooyashi/Downloads/small.mp4 -f ffmetadata - checking metadata by vscode terminal
    
      const {spawn} = require('child_process');
      
      const child = spawn('ffmpeg', [
        '-i',
        ' /home/ooyashi/Downloads/samplemkv.mkv',
        ' -f',
        ' ffmetadata'
      ])
      
     
      child.stdout.on('data', function(data) {
        console.log(data);
    });
    
    child.stderr.setEncoding("utf8")
    child.stderr.on('data', function(data) {
        console.log(data);
    });
  
    child.on('close', function() {
    console.log('finished');
    });
  });
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.listen(5000, () => {
    console.log("App is listening on Port 5000")
})
        //const file = `${__dirname}`;
        //res.download(file); // Set disposition and send it.


//ffmpeg -i /home/ooyashi/Downloads/small.mp4 -f ffmetadata - checking metadata by vscode terminal