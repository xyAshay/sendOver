const express = require('express');
const fs = require('fs');
const ip = require('ip');

const app = express();
const upDir = __dirname + '/uploads';
var fPath;

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/download', (req,res) => {
  console.log(`Observed New Download From ${req.ip}`);
  res.set("Content-Disposition", `attachment;filename=${process.argv[2]}`);
	res.set("Content-Type", "application/octet-stream");
  res.download(fPath);
});

if(!fs.existsSync(upDir)){
  fs.mkdir(upDir, (err) => {
    if(err)
      throw err;
  });
  console.log('Place The Files In The /uploads Directory And Try Again.');
  process.exit();
}
else{
  if(process.argv.length < 3){
    console.log('Invalid Arguments Check Usage.');
    console.log('Usage : Node index.js fileName.txt');
  }
  else{
    const fName = process.argv[2];
    fPath = upDir +'/'+ fName;
    if(!fs.existsSync(fPath)){
      console.log('File Does Not Exist!');
      process.exit();
    }
    else{
      if(!fs.lstatSync(fPath).isDirectory())
        console.log(`Serving File ${fName}`);
      else
        console.log('Directory Support Unavailable.');
    }
    app.listen(3000,ip.address(), () => {
    console.log(`Server Listening On http://${ip.address()}:3000`);
    });
  }
}
