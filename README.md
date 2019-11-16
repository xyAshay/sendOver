# SendOver
![logo](public/log.png)

A simple web utility written in NodeJS to send files to devices within the same network.

# Usage
To install the dependancies run :
```bash
npm i OR yarn install 
```

Serving file/directory :
```bash
     node index.js -f [filename/directory]
Ex : node index.js -f test.txt
```
## Arguments
```
--version           
-h,-help            display help
-f,--file           target file/directory to serve
-p,--port           set target port for the server(default 3000)
```
## Screens
![](public/web.png) 
![](public/mobile.png)