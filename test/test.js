"use strict";

var gettext = require("../index.js");
var gulp = require("gulp");
var fs = require("fs");
var assert = require("assert");

describe("gulp-gettext-parser", function() {

    describe("#parser()", function() {

        it("Should return a gettext file", function(done) {
            gulp.src("./test/examples/Sample.js")
            .pipe(gettext())
            .pipe(gulp.dest("./test"))
            .on("end", function() {
                var result = fs.readFileSync("./test/gettext.po");
                assert(!!result);
                assert(result.indexOf("Hello") !== -1);
                done();
            });
        });

        it("Should return a gettext file for JSX", function(done) {
            gulp.src("./test/examples/React.js")
            .pipe(gettext())
            .pipe(gulp.dest("./test"))
            .on("end", function() {
                var result = fs.readFileSync("./test/gettext.po");
                assert(!!result);
                assert(result.indexOf("React") !== -1);
                done();
            });
        });

    });
});
