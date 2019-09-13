const express = require('express');
const fs = require('fs');
const ip = require('ip');
const archiver = require('archiver');
const qr = require('qr-image');

const app = express();
const upDir = __dirname + '/uploads';
const port = 3000;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const initListener = (ident,len) => {
  app.get('/', (req,res) => {
    res.render('index',{ident : ident,size : Number(len*0.00000095367432).toFixed(2)});
  });

  app.listen(port,ip.address(), () => {
    console.log(`Server Listening On http://${ip.address()}:${port}`);
    const img = qr.image(`http://${ip.address()}:${port}/download`, { type: 'png', size : 6, margin: 1 });
    img.pipe(fs.createWriteStream('./public/qr.png'));
  });
}

const sendOverStream = (url,ident,len) => {
  initListener(ident,len);
  app.get('/download', (req,res) => {
      console.log(`Observed New Download From ${req.ip}`);
      res.set("Content-Disposition", `attachment;filename=${ident}`);
      res.set("Content-Type", "application/octet-stream");
      res.download(url);
  });
}

const handleDir = (dName) =>{
  if(fs.existsSync(upDir + '/sendOverFiles.zip'))
    fs.unlinkSync(upDir + '/sendOverFiles.zip');

  const target = fs.createWriteStream(upDir + '/sendOverFiles.zip');
  const archive = archiver('zip',{ zlib: { level: 1 } });
  target.on('close', () => {
     console.log(`Archived Contents Of ${dName} to Zip ${archive.pointer()} Bytes`);
     sendOverStream(upDir+'/'+'sendOverFiles.zip',dName,fs.statSync(upDir+'/sendOverFiles.zip').size);
  });
  archive.on('error', (err) => {
     throw err;
  });
  archive.pipe(target);
  archive.directory(upDir+'/'+dName, dName, { date: new Date() });
  archive.finalize();
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
      fs.lstatSync(fPath).isDirectory() ? handleDir(fName) : sendOverStream(fPath,fName,fs.statSync(fPath).size);
  }
}
