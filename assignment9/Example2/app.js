/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global ko: true*/

"use strict";

var ViewModel = function(items) {
    this.items = ko.observableArray(items);
    this.itemToAdd = ko.observable("");
    this.addItem = function() {
        if (this.itemToAdd() !== "") {
            this.items.push(this.itemToAdd());
            this.itemToAdd("");
        }
    };
};

ko.applyBindings(new ViewModel(["This is a comment."]));
