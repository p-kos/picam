var express = require('express');
var q = require('q');
var sqlite3=require('sqlite3').verbose();
var app = express();
var http = require('http').createServer(app);
var motionHandler = require('./motionHandler.js').motionHandler();
var fs = require('fs');

app.use('/api',express.static(__dirname ) );
app.use('/bower_components', express.static(__dirname  + '/bower_components' ));
app.use('/captures', express.static(__dirname  + '/captures' ));
app.use(express.static(__dirname + '/webapp' ) );

var dbFile = __dirname + "/dbImages.db";
var db;

function getImagesByDay(date){

  var defered = q.defer();
  if (date) {
    db = new sqlite3.Database(dbFile);

    var newDate = date.substring(0, 10);
    var dateFrom = newDate + ' 00:00:00';
    var dateTo = newDate + ' 23:59:59';

    var qry = "SELECT _id, FileName, Path, Date FROM Image WHERE Date >= Datetime('" + dateFrom + "') "
      + " and Date <= Datetime('" + dateTo + "') ORDER BY Date";

    db.all(qry, function (err, rows) {
      if (err) {
        defered.reject(err);
      }
      else {
        defered.resolve(rows);
      }
    });
  }
  else{
    defered.reject("Date is empty");
  }
  return defered.promise;
}

app.get('/api/images', function(request, response){
  db=new sqlite3.Database(dbFile);
  db.all("SELECT _id, FileName, Path, Date FROM Image ORDER BY Date", function (err, rows) {
    if (err) {
      response.send(err);
    }
    else {
      response.send(rows);
    }
  });
});

app.get('/api/images/:id', function(request, response){
  db=new sqlite3.Database(dbFile);
  db.all("SELECT _id, FileName, Path, Date FROM Image WHERE _id=? ORDER BY Date", request.params.id,function (err, rows) {
    if (err) {
      response.send(err);
    }
    else {
      response.send(rows[0]);
    }
  });
});

app.get('/api/images/date/:date', function(request, response) {

  getImagesByDay(request.params.date)
    .then(function(data){
      response.send(data);
    },
    function(error){
      response.send(error);
    }
  );
});

app.get('/api/getLastedImageByDate', function(request, response) {
  db=new sqlite3.Database(dbFile);

  var date = new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1);
  var day = String(date.getDate());
  if (month.length == 1){
    month = '0' + month;
  }
  if (day.length == 1){
    day = '0' + day;
  }
  var date = year + '-' + month + '-' + day + ' 23:59:59';

  var qry = "SELECT MAX(Date) AS Date FROM Image WHERE Date <= Datetime('" + date +"')";

  db.all(qry, function (err, rows) {
    if (err) {
      response.send(err);
    }
    else {
      var newDate = rows[0].Date;
      getImagesByDay(newDate)
        .then(function(data){
          response.send(data);
        },
        function(error){
          response.send(error);
        }
      );
    }
  });
});

app.get('/api/dates', function(request, response){
  db=new sqlite3.Database(dbFile);
  var qry = "SELECT  img.*, t.Cnt FROM Image img INNER JOIN (SELECT SUBSTR(date, 1, 10), MIN(_id) as _id, COUNT(1) AS Cnt FROM Image GROUP BY substr(date, 1, 10))  as t ON img._id = t._id ORDER BY date DESC";
  db.all(qry, request.params.id,function (err, rows) {
    if (err) {
      response.send(err);
    }
    else {
      response.send(rows);
    }
  });

 });

app.get('/api/motion', function(request, response){
  motionHandler.motionStatus()
    .then(function(data){
      response.send(data);
    }, function(error){
      response.send(error);
    })
});

app.get('/api/motion/:status', function(request, response){
  var status = request.params.status === "1";
  motionHandler.startStopMotion(status)
    .then(function(data){
      response.send(data);
    }, function(error){
      response.send(error);
    });
});

app.delete('/api/images/dates/:date', function(request, response) {
  var newDate = request.params.date.substr(0, 10);
  var dateFrom = newDate + ' 00:00:00';
  var dateTo = newDate + ' 23:59:59';

  var qry = "SELECT _id, FileName, Path, Date FROM Image WHERE Date >= Datetime('" + dateFrom + "') "
    + " and Date <= Datetime('" + dateTo + "') ORDER BY Date";

  db.each(qry, function (error, image) {
    var filePath = __dirname + '/captures/' + image.FileName;
    try {
      fs.unlinkSync(filePath)
    }
    catch (e) {
      console.log(e);
    }
    db.run('DELETE FROM Image WHERE _id = ?', image._id);
  });
  response.end();

});

var port = 3705;
http.listen(port);
console.log('picam server is running at port ' + port);
