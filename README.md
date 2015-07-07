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

Takes as parameter the headers to put in the po file.

```js
gettext({
    headers: {
        "content-type": "text/plain; charset=UTF-8",
        "plural-forms": "nplurals=2; plural=(n!=1);"
    }
})
```

License
=======

[MIT License](LICENSE).
