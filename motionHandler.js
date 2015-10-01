var cp = require('child_process');
var q = require('q');

var motionHandler = function() {
  var processName = 'motion';
  var processCmd = 'motion';
  var processCmdParams;// = ['/Users/p_kos/Documents/dev/subLocator/app'];
  var motionps;

  function motionStatus(){
    var defered = q.defer();
    var cmd = 'ps aux | grep "' + processName;
    if (processCmdParams){
      cmd += ' ' + processCmdParams;
    }
    cmd += '$"';
    console.log('cmd: '+ cmd);
    cp.exec(cmd, function (error, stdout, stderr) {
      if (error){
        if (String(error.signal) === "null" ){
          defered.resolve({on:false});
        }
        else {
          defered.reject(error);
        }
      }
      else if(stderr){
        defered.reject(stderr);
      }
      else{
        var pattern = /[0-9]+/;
        var out = pattern.exec(stdout);
        if (out){
          processId = out[0];
          defered.resolve({on:true, processId: processId});
        }

        if (!processId){
          defered.resolve({on:false});
        }
      }
    });
    return defered.promise;
  }

  function killMotion(processId){
    var defered = q.defer();
    var cmd = "kill " + processId;
    cp.exec(cmd, function (error, stdout, stderr) {
      if (error){
        defered.reject(error);
      }
      else if(stderr){
        defered.reject(stderr);
      }
      else{
        defered.resolve({success:true});
      }
    });
    return defered.promise;
  }

  function turnOnMotion(){
    var defered = q.defer();
    var cmd = processCmd;
    var child;
    if (processCmdParams) {
      child = cp.spawn(cmd, processCmdParams);
    }
    else{
      child = cp.spawn(cmd);
    }
    waitForProcess(child, function(pid){
      defered.resolve(child.pid);
    });

    return defered.promise;
  }

  function waitForProcess(child, callback){
    if (child.pid){
      return callback(child.pid);
    }
    setTimeout(waitForProcess(child), 1000);
  }

  return {
    motionStatus: motionStatus ,

    startStopMotion:function(on){
      var defered = q.defer();
      var turnOn = 0;
      motionStatus()
        .then(function(data) {
          if (data.on === true && on === false) {
            return killMotion(data.processId);
          }
          else if (data.on === false && on === true) {
            return turnOnMotion();
          }
          var newDefered = q.defer();
          newDefered.resolve('noaction');
          return newDefered.promise;
        })
        .then(function(data){
          return motionStatus();
        })
        .done(function(data){
        defered.resolve(data);
      });
      return defered.promise;
    }
  }
}

module.exports ={
  motionHandler: motionHandler
}





