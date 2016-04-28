// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global console:true, */
"use strict";
// connect to server
var socket = io();
var toDoObjects, toDos;
// send "Hello" to server
socket.emit("new", "Hello");
// server send all tasks
socket.on("data", function(data) {
    toDoObjects = data;
    toDos = toDoObjects.map(function(toDo) {
        // we'll just return the description of this toDoObject
        return toDo.description;
    });
    $(".tabs a span").toArray().forEach(function(element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function() {
            var $content, i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function(todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

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

                console.log(tagObjects);

                tagObjects.forEach(function(tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");

                    tag.toDos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $alert = $("<p>").text("Data is  added"),
                    $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");
                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
                $button.on("click", function() {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description": description,
                            "tags": tags
                        };
                    // add new task and send to server
                    socket.emit("addTask", newToDo);
                    // receive and update data
                    socket.on("newData", function(data) {
                        toDoObjects = data;
                        toDos = toDoObjects.map(function(toDo) {
                            return toDo.description;
                        });
                        $input.val("");
                        $tagInput.val("");
                        $("main .content").empty();
                        $content = $("<div>").append($alert)
                            .append($inputLabel)
                            .append($input)
                            .append($tagLabel)
                            .append($tagInput)
                            .append($button);
                        $("main .content").append($content);
                    });
                });

            }
            $("main .content").append($content);

            // all users exclude sender receive and update data
            socket.on("newVal", function(data) {
                toDoObjects = data;
                toDos = toDoObjects.map(function(toDo) {
                    return toDo.description;
                });
                console.log("New value: " + toDos);
                var $content, i;
                $("main .content").empty();
                if ($(".tabs .active").text() === "Newest") {
                    console.log($(".tabs .active").text());
                    $content = $("<ul>");
                    for (i = toDos.length - 1; i >= 0; i--) {
                        $content.append($("<li>").text(toDos[i]));
                    }
                } else if ($(".tabs .active").text() === "Oldest") {
                    $content = $("<ul>");
                    toDos.forEach(function(todo) {
                        $content.append($("<li>").text(todo));
                    });

                } else if ($(".tabs .active").text() === "Tags") {
                    var tags = [];

                    toDoObjects.forEach(function(toDo) {
                        toDo.tags.forEach(function(tag) {
                            if (tags.indexOf(tag) === -1) {
                                tags.push(tag);
                            }
                        });
                    });
                    console.log(tags);

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

                    console.log(tagObjects);

                    tagObjects.forEach(function(tag) {
                        var $tagName = $("<h3>").text(tag.name),
                            $content = $("<ul>");


                        tag.toDos.forEach(function(description) {
                            var $li = $("<li>").text(description);
                            $content.append($li);
                        });

                        $("main .content").append($tagName);
                        $("main .content").append($content);
                    });
                }
                $("main .content").append($content);
                $("main .content").slideUp("slow");
                $("main .content").slideDown("slow");
            });
            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");

});
