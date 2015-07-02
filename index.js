"use strict";

var path = require("path");

var gettextParser = require("gettext-parser");
var through = require("through2");
var acorn = require("acorn-jsx");
var walk = require("acorn/dist/walk");
var gutil = require("gulp-util");

var DEFAULT_FUNCTION_NAMES = ["gettext", "dgettext", "ngettext", "dngettext", "pgettext", "dpgettext", "npgettext", "dnpgettext"];

var jsxBase = {
    JSXElement(node, st, c) {
        node.openingElement.attributes.forEach(function(attr) {
            c(attr, st, attr.type);
        });
        node.children.forEach(function(child) {
            c(child, st, child.type);
        });
    },
    JSXExpressionContainer(node, st, c) {
        c(node.expression, st, node.expression.type);
    },
    JSXAttribute(node, st, c) {
        if (node.value !== null) {
            c(node.value, st, node.value.type);
        }
    },
    JSXSpreadAttribute(node, st, c) {
        c(node.argument, st, node.argument.type);
    }
};
Object.setPrototypeOf(jsxBase, walk.base);

module.exports = function(opts) {

    var functionNames = opts.functionNames || DEFAULT_FUNCTION_NAMES;

    var data = {
        charset: "UTF-8",

        headers: {
            "content-type": "text/plain; charset=UTF-8",
            "plural-forms": "nplurals=2; plural=(n!=1);"
        },

        translations: {
            context: {
            }
        }
    };
    var context = data.translations.context;

    var transform = through.obj(function(file, encoding, cb) {

        let src = file.contents.toString();

        var ast = acorn.parse(src, {
            ecmaVersion: 6,
            sourceType: "module",
            plugins: {jsx: true}
        });

        walk.simple(ast, {
            CallExpression: function(node) {
                if (functionNames.indexOf(node.callee.name) !== -1
                    || node.callee.property && functionNames.indexOf(node.callee.property.name) !== -1) {

                    var args = node.arguments;

                    for (var i = 0, l = args.length; i < l; i++) {
                        var arg = args[i];
                        var value = arg.value;

                        if (value) {
                            context[value] = {
                                msgid: value
                            };
                        }
                    }
                }
            }
        }, jsxBase);

        cb();
    },

    function(cb) {
        var file = new gutil.File({
            base: __dirname,
            cwd: __dirname,
            path: path.join(__dirname, "./gettext.po")
        });

        file.contents = gettextParser.po.compile(data);
        this.push(file);
        cb();
    });

    return transform;
};
