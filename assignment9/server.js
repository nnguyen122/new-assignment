"use strict";
var express = require("express"),
    mongoose = require("mongoose"),
    app = express();

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

//connect to the amazeriffic data store in mongo
mongoose.connect("mongodb://localhost/amazeriffic");
// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

server.listen(port, function() {
    console.log("Server listening at port %d", port);
});

io.sockets.on("connection", function(socket) {
    console.log("a user connected" + socket.id);
        // When a client connects, send them all the tasks.
        ToDo.find({}, function(err, toDos) {
            socket.emit("data", toDos);
        });

    // Client add new task and send to server
    socket.on("addTask", function(data) {
        console.log("New Taks:" + data);
        var newToDo = new ToDo({
            "description": data.description,
            "tags": data.tags
        });
        newToDo.save(function(err) {
            if (err !== null) {
                // the element did not get saved to mongodb!
                console.log(err);
            } else {
                // our client expects *all* of the todo items to be returned, so we'll do
                // an additional request to maintain compatibility
                ToDo.find({}, function(err, result) {
                    if (err !== null) {
                        // the element did not get saved!
                        console.log(err);
                    }
                    // send data to sender
                    socket.emit("newData", result);
                    // send data to all users
                    socket.broadcast.emit("newVal", result);
                });
            }
        });
    });
});
