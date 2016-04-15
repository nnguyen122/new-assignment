"use strict";

//import molules
var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    app = express();

//connect data
mongoose.connect ("mongodb://localhost:27017/mongodb/data");

var linkSchema = mongoose.Schema({
      title: String,
      link: String,
      clicks: Number
      });
app.use(express.urlencoded());
var links = mongoose.model("links", linkSchema);
//model.export = links;
var sTitle, sLink;

app.get("/links", function (req, res){
    links.find({}, function (err, results){
        if (err){
           console.log(err);
        }else{
            res.json(results);
            res.end();
        }
    });
});

app.post("/links", function (req, res){
  sTitle = req.body.title;
  sLink = req.body.link;
  //push data to mongoose
  links.push({"title" : sTitle, "link" : sLink, "clicks" : 0});
  //save mongoose
  links.save(function (err){
      if (err){
          console.log(err);
          res.send("ERROR");
      }
  });
});

app.get("/click/:title", function (req, res){
    sTitle = req.body.title;
    links.find({"title" : "sTitle"}, function (err, results){
      if (err){
        res.send("ERROR");
      }else {
        //update click
        results.clicks = results.clicks + 1;
        //redirect link
        res.redirect(results.link);
        res.end();
      }
    });
});

//listen for request
http.createServer(app).listen(3000);
