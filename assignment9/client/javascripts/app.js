// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console:true, io :true,ko: true */
"use strict";
// connect to server

var TabViewModel = function() {
    var self = this;
    var toDoObjects, toDos;
    var socket = io.connect("http://localhost:3000");
    //Set href value of element
    self.selected = ko.observable(null);
    self.newest = ko.observableArray([]);
    self.oldest = ko.observableArray([]);
    self.tagsArr = ko.observableArray([]);
    self.desc = ko.observable();
    self.tg = ko.observable();

    self.addTag = function() {
        var description = self.desc();
        var ta = self.tg();
        var newToDo = {
            "description": description,
            "tags": ta
        };
        socket.emit("addTask", newToDo);

        self.desc("");
        self.tg("");

    };
    //initial set to show first tabpanel when loading page
    self.init = ko.observable(1);

    //Get href value of element
    self.getHref = function() {
        var target;
        var element = event.target.hash;
        target = element.substr(1);
        return target;
    };

    //Show Tabpanel
    self.showBlock = function() {
        var target = self.getHref();
        self.selected(target);
        self.init(2);
    };
    socket.on("data", function(data) {
        toDoObjects = data;
        toDos = toDoObjects.map(function(toDo) {
            // we'll just return the description of this toDoObject
            return toDo.description;
        });
        var listTags = function() {
            var tags = [];

            toDoObjects.forEach(function(toDo) {
                toDo.tags.forEach(function(tag) {
                    if (tags.indexOf(tag) === -1) {
                        tags.push(tag);
                    }
                });
            });
            var tagObjects = tags.map(function(tag) {
                var toDosWithTag = [];

                toDoObjects.forEach(function(toDo) {
                    if (toDo.tags.indexOf(tag) !== -1) {
                        toDosWithTag.push(toDo.description);
                    }
                });

                return {
                    "name": tag,
                    "toDos": toDosWithTag
                };
            });

            return tagObjects;
        };
        for (var i = toDos.length; i >= 0; i--) {
            self.newest.push(toDos[i]);
        }
        for (var i = 0; i < toDos.length; i++) {
            self.oldest.push(toDos[i]);
        }
        for (var i = 0; i < listTags().length; i++) {
            self.tagsArr.push(listTags()[i]);
        }
        socket.on("newData", function(data) {
            toDoObjects = data;

            toDos = toDoObjects.map(function(toDo) {
                return toDo.description;
            });
            console.log("new data" + toDos);
            var listTags = function() {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                var tagObjects = tags.map(function(tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function(toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });

                return tagObjects;
            };
            console.log("selected: " + self.selected());
            if (self.selected() === "tab1") {
                for (var i = toDos.length; i >= 0; i--) {
                    self.newest.push(toDos[i]);
                }
            }
            if (self.selected() === "tab2") {
                for (var i = 0; i < toDos.length; i++) {
                    self.oldest.push(toDos[i]);
                }
            }
            if (self.selected() === 'tab3') {
                for (var i = 0; i < listTags().length; i++) {
                    self.tagsArr.push(listTags()[i]);
                }
            }
        });
    });
};
ko.applyBindings(new TabViewModel());
