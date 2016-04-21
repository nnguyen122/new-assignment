"use strict";

//import molules
var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

//connect data
mongoose.connect("mongodb://localhost:27017/mongodb/data");

var linkSchema = mongoose.Schema({
    title: String,
    link: String,
    clicks: Number,
    __v: {
        type: Number,
        select: false
    },
});

var links = mongoose.model("links", linkSchema);

var sTitle, sLink;

app.use(bodyParser.json());

app.get("/links", function(req, res) {
    links.find({}, {
        "_id": 0
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.send(results);
            //res.json(results);
            res.end();
        }
    });
});

app.post("/links", function(req, res) {
    sTitle = req.body.title;
    sLink = req.body.link;
    links.findOne({
        "title": sTitle
    }, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            if (results === null) {
                //prepare mongoose data
                var newLink = links({
                    "title": sTitle,
                    "link": sLink,
                    "clicks": 0
                });
                //save mongoose
                newLink.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send("Can't save to Mongoose" + err);
                    } else {
                        console.log(newLink);
                        res.end();
                    }
                });
            } else {
                res.send("Title already exists");
                res.end();
            }
        }
    });
});

app.get("/click/:title", function(req, res) {
    sTitle = req.params.title;
    console.log(sTitle);
    //find and Update clicks
    links.findOneAndUpdate({
        "title": sTitle
    }, {
        $inc: {
            clicks: 1
        }
    }, function(err, results) {
        if (err) {
            res.send("ERROR");
        } else {
            //redirect link
            console.log("Redirect to: " + results.link);
            res.redirect(results.link);
            res.end();
        }
    });
});

app.delete("/delete", function(req, res) {
    links.remove({}, function(err) {
        if (err) {
            res.send("ERROR");
        } else {
            res.end();
        }
    });
});
//listen for request
http.createServer(app).listen(3000);
