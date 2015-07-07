# gulp-gettext-parser
Task for Gulp to extract gettext string with acorn. ES6 and JSX are supported.

Installation
============

`npm install gulp-gettext-parser --save-dev`

```js
var gettext = require("gulp-gettext-parser")
```

Example
=======

```js
var gettext = require("gulp-gettext-parser");
var rename = require("gulp-rename");

gulp.task("gettext", function() {
    return gulp.src("src/**/*.js")
        .pipe(gettext())
        .pipe(rename("bundle.po"))
        .pipe(gulp.dest("dist/"));
});
```

API
===

### `gettext(options)` ###

Take as parameter the functions list to extract from js. You have to precise where found the parameters
("domain", "msgctxt", "msgid", "msgid_plural" and "count") to be extract.

```js
gettext({
    functionNames: {
        myfunction: ["msgid"]
    }
})
```

License
=======

[MIT License](LICENSE).
