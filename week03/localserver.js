
//(2018 - update February 15) Config.js
//(2018 - updated February 14) Adding Database
//(2018 - updated February 13) Recreating the Express server exercise from DWD Servers class, but this time for localhosting. I'm comparing the originalr "server.js" with the "myapp/app.js" express file.

var config = require("./config.js");
var express = require ('express');
var bodyParser = require ('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true});

var path = require ('path')
var app = express();

//Connect to mLab MongoDB database (after installing the node module)
var mongojs = require('mongojs');
//Bad idea to put your password in a file that's going to be sent to Github. Better use a config.js - but don't know how to access it!
// var db = mongojs("brasil.gabriel:Idunnodwd2018@ds235768.mlab.com:35768/dwd2018", ["DBtest00"]);

var db = mongojs(config.db_username +":" + config.db_password + "@ds235768.mlab.com:35768/dwd2018", ["DBtest00"]);
console.log(config.db_username);
//mongodb://<dbuser>:<dbpassword>@ds235768.mlab.com:35768/dwd2018
//var db = mongojs("username:password@example.com:port/mydb", ["mycollection"]);

app.listen(8080, function(){
  console.log('Local host server on port 8080...')
})



//DB: Pull all records
db.DBtest00.find({}, function(err, saved){
  if(err||!saved){
    console.log("No Results");
  }
  else {
      saved.forEach(function(record){
        console.log(record);
      });
  }
});

app.use(urlencodedParser);

//activating TEMPLATE in "/views/template.ejs"
app.set('view engine', 'ejs');

//Allows for Express to access the static files (CSS, Images, etc) inside ""/public". Otherwise the .EJS file can't access CSS like a ".HTML" can.//
app.use(express.static(__dirname + '/public'));

//(OPTION 01)this uses the templates as the response to a request get/post//
//"person.name" and "person.other" are referencing the "template.ejs" file
// app.get('/templatetest', function (req, res){
//    var data= {person: {name: "Shawn", other: "blah"}};
//    res.render('template.ejs', data);
// });



//(OPTION 02) Array of DATA//
// app.get('/templatetest', function (req, res){
//    var data= {people: [{name: "Shawn", other: "blah"}, {name: "Juca", other: "No"}, {name: "Pedro", other: "Nope"}]};
//    res.render('template.ejs', data);
// });

//(OPTION 02-B test) Array of DATA//
app.get('/templatetest', function (req, res){
   var data= {people: [{name: "textfield", other: "blah"}, {name: "textfield02", other: "No"}, {name: "Pedro", other: "Nope"}]};
   res.render('template.ejs', data);

});

//"post" request
app.post('/processit', function(req, res) {
    var textvalue = req.body.textfield;
    var textvalue02 = req.body.textfield02;
    res.send("What make you think you are going to achieve " + textvalue +" ?!!"+ "And how dare you say " + textvalue02 +"? Not COOL!");
    //DB: Insert a record into the Database. (update Shawn 0215: cut and pasted the "db.DBtest00.save..."" inside this "app.post")
    db.DBtest00.save({"textfield":textvalue, "textfield02":textvalue02}, function(err, saved){
        if( err || !saved) console.log("Not saved");

        else console.log("saved");
    });
  });


//simple request//
// app.get('/somethingelse', function(req, res){
//   res.send('Fala aê mundo!')
// })
