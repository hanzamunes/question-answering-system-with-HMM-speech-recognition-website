var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require ('express-session');
var bodyParser = require('body-parser');
var flash = require ('connect-flash');
var async = require('async');
var cp = require ('child_process');
var fs = require ('fs');
var CronJob = require ('cron').CronJob;
var rimraf = require ('rimraf');

var routes = require('./routes/index');
var sound = require ('./routes/sound');
var text = require ('./routes/text');
var soundtext = require ('./routes/sound-text');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'login',saveUninitialized:false, resave:false}));
app.use (flash());

app.use('/', routes);
app.use('/sound',sound);
app.use('/text',text);
app.use('/sound-text',soundtext);

new CronJob("0 0 * * * *", function(){
  var outputPath = process.cwd()+"/backend/output/questionOutput";
  console.log(outputPath);
  fs.readdir(outputPath,function(err,files){
    files.forEach(function(file, index) {
      fs.stat(path.join(outputPath, file), function(err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 3600000;
        if (now > endTime) {
          return rimraf(path.join(outputPath, file), function(err) {
            if (err) {
              return console.error(err);
            }
            console.log('successfully deleted');
          });
        }
      });
    });
  });
},null,true);

app.post('/getAnswer',function(req,res){
  var question = req.body.question;
  var outputPath = process.cwd()+"/backend/output/questionOutput";
  var fileName = Date.now();
  var backendPath = process.cwd()+"/backend/questionAnsweringSystem.jar";
  var execCommand = 'java -jar "'+backendPath+'" "'+question+'" '+fileName;
  var ls = cp.exec (execCommand,function (err,stdout){
    if (err)
    {
      console.log (err);
      return;
    }
    else
    {
      console.log(stdout);
      console.log ("uda masuk nih");
      fs.readdir(outputPath,function (err,files){
      if (err)
      {
        console.log('error '+err);
      }
      else
      {
        var temp = fileName+'.json';
        if (files.indexOf(temp)!=-1)
        {
          var jsonContent = JSON.parse(fs.readFileSync(outputPath+'/'+temp));
          jsonContent.content = jsonContent.content.replace("\\n","<br>");
          req.flash('jawaban',jsonContent.jawaban);
          req.flash('title',jsonContent.titleDoc);
          req.flash('dokumen',jsonContent.content);
          req.flash('question',question);
          res.redirect('back');
        }
      }
    });
    }
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
