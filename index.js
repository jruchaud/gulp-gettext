"use strict";

var path = require("path");

var gettextParser = require("gettext-parser");
var through = require("through2");
var acorn = require("acorn-jsx");
var walk = require("acorn/dist/walk");
var gutil = require("gulp-util");

var DEFAULT_FUNCTION_NAMES = {
    gettext: ["msgid"],
    dgettext: ["domain", "msgid"],
    ngettext: ["msgid", "msgid_plural", "count"],
    dngettext: ["domain", "msgid", "msgid_plural", "count"],
    pgettext: ["msgctxt", "msgid"],
    dpgettext: ["domain", "msgctxt", "msgid"],
    npgettext: ["msgctxt", "msgid", "msgid_plural", "count"],
    dnpgettext: ["domain", "msgctxt", "msgid", "msgid_plural", "count"]
};

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

    var functionNames = opts.functionNames || DEFAULT_FUNCTION_NAMES;

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
    var defaultContext = data.translations.context;

    var transform = through.obj(function(file, encoding, cb) {

        let src = file.contents.toString();

        var ast = acorn.parse(src, {
            ecmaVersion: 6,
            sourceType: "module",
            plugins: {jsx: true}
        });

        walk.simple(ast, {
            CallExpression: function(node) {
                if (functionNames.hasOwnProperty(node.callee.name)
                    || node.callee.property && functionNames.hasOwnProperty(node.callee.property.name)) {

                    var functionName = functionNames[node.callee.name] || functionNames[node.callee.property.name];
                    var translate = {};

                    var args = node.arguments;
                    for (var i = 0, l = args.length; i < l; i++) {
                        var name = functionName[i];

                        if (name && name !== "count" && name !== "domain") {
                            var arg = args[i];
                            var value = arg.value;

                            if (value) {
                                translate[name] = value;
                            }

                            if (name === "msgid_plural") {
                                translate.msgstr = ["", ""];
                            }
                        }
                    }

                    var context = defaultContext;
                    var msgctxt = translate.msgctxt;
                    if (msgctxt) {
                        data.translations[msgctxt] = data.translations[msgctxt] || {};
                        context = data.translations[msgctxt];
                    }

                    context[translate.msgid] = translate;
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
