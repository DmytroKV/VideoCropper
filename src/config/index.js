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
  app.post("/crop", (req, res) => {
    var path = '/home/ooyashi/Downloads/small.mp4'
    //var file = fs.readFileSync(path, 'binary');

    try {
      //Problem:
      //By shell it displays metadata, but node.js for some reason cannot!
      var process = new ffmpeg(path);
      process.then(function (video) {
        // Video metadata
        console.log(video.metadata);
        // FFmpeg configuration
        console.log(video.info_configuration);
      }, function (err) {
        console.log('Error: ' + err);
      });
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
    }
    

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