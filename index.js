const express = require('express');
const fs = require('fs');
const ip = require('ip');
const archiver = require('archiver');

const app = express();
const upDir = __dirname + '/uploads';

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const initListener = () => {
  app.listen(3000,ip.address(), () => {
    console.log(`Server Listening On http://${ip.address()}:3000`);
  });
}

const sendOverStream = (url,ident) => {
  initListener();
  app.get('/download', (req,res) => {
  console.log(`Observed New Download From ${req.ip}`);
  res.set("Content-Disposition", `attachment;filename=${ident}`);
  res.set("Content-Type", "application/octet-stream");
  res.download(url);
  });
}

const handleDir = (dName) =>{
  if(fs.existsSync(__dirname + '/uploads/sendOverFiles.zip'))
    fs.unlinkSync(__dirname + '/uploads/sendOverFiles.zip');

  const target = fs.createWriteStream(__dirname + '/uploads/sendOverFiles.zip');
  const archive = archiver('zip',{ zlib: { level: 1 } });
  target.on('close', () => {
     console.log(archive.pointer() + ' total bytes');
     console.log('Finalized ');
  });
  archive.on('error', (err) => {
     throw err;
  });
  archive.pipe(target);
  archive.directory(upDir+'/'+dName, dName, { date: new Date() });
  archive.finalize();

  sendOverStream(upDir+'/'+'sendOverFiles.zip');
}

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
    const fPath = upDir +'/'+ fName;
    if(!fs.existsSync(fPath)){
      console.log('File Does Not Exist!');
      process.exit();
    }
    else
      fs.lstatSync(fPath).isDirectory() ? handleDir(fName) : sendOverStream(fPath,fName);
  }
}
