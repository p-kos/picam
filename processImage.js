/**
 * Created by p_kos on 8/21/15.
 */

var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var q = require("q");
var socket = require('socket.io-client')('http://localhost:3705');
var dbfilename = process.argv[2];
var imagePath = process.argv[3];
var imageFilename = path.basename(imagePath);

if (path.extname(imagePath) == ".jpg") {

  var exists = fs.existsSync(dbfilename);
  var db = new sqlite3.Database(dbfilename);

  if (exists == false) {
    var qry = 'create table if not exists "Image" ("_id" INTEGER	PRIMARY KEY	AUTOINCREMENT NOT NULL UNIQUE' +
      ', "FileName" VARCHAR(200)' +
      ', "Path" VARCHAR(500)' +
      ', "Date" DATETIME DEFAULT CURRENT_TIMESTAMP' +
      ')';
    db.run(qry);
    return;
  }


  db.run("INSERT INTO Image(FileName, Path, Date ) VALUES(?,?,datetime(CURRENT_TIMESTAMP, 'localtime'))"
    , [imageFilename, imagePath], function (error) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Success, inserted " + imagePath);
        if (socket){
          socket.emit('refreshImg', imagePath);
          console.log('send to socket: ' + imagePath);
          setTimeout(function(){
            socket.disconnect();
          }, 500);
        }
      }
    });

}
