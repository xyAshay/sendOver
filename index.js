const express = require('express');
const ip = require('ip');

const app = express();

app.get('/', (req,res) => {
  res.send('Hello World!');
})

app.listen(3000,ip.address(), () => {
  console.log(`Server Listening On http://${ip.address()}:3000`);
});
