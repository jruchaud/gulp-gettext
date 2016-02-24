"use strict";

// Run with
// $gulp --gulpfile test/gulpfile.js

var gettext = require("../index.js");
var gulp = require("gulp");

gulp.task("default", function() {
    return gulp.src("./test/Sample.js")
            .pipe(gettext())
            .pipe(gulp.dest("."));
});
