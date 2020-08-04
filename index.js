//Listar archivos.
const path = require('path');
const fs = require('fs');
var data=[];
const port = process.argv[2]; 


const fileUpload = require('express-fileupload');
var express = require('express');
var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true })) 

app.use(fileUpload());
app.use('/static', express.static('img'));

app.post('/saveImage',function (req, res) {
 
   if (!req.files || Object.keys(req.files).length === 0) {
      return res.send('No files were uploaded.');
   }else{
      let imgFile = req.files.imagen
      console.log(req.files.imagen.name);
      imgFile.mv('img/'+`${imgFile.name}`,err => {
           if(err) return res.status(500).send({ message : err })

           return res.status(200).json({"path": "img/"+req.files.imagen.name,
                                       "size":req.files.imagen.size/1048576,
                                       "name": req.files.imagen.name});
       });   
   }

 });

app.listen(port, function () {
  console.log('listening on port:' + port);
});

app.get('/availableSpace', function (req, res){
   scanDirs('img/');
   var availbleSpace = {"avaibleSpace" : 10-spaceFile()};
   res.send(availbleSpace);

});

function scanDirs(directoryPath){
   try{
      var ls=fs.readdirSync(directoryPath);

      for (let index = 0; index < ls.length; index++) {
         const file = path.join(directoryPath, ls[index]);
         var dataFile =null;
         try{
            dataFile =fs.lstatSync(file);
         }catch(e){}

         if(dataFile){
            data.push(
               {
                  path: file,
                  length: dataFile.size
               });
         }
      }
   }catch(e){}
}

function spaceFile(){
   var count = 0; 
   for  (let i = 0; i< data.length; i++) {
      var jsonData= data[i];
      count = count + jsonData.length;
   }
   return count/1048576;
}
