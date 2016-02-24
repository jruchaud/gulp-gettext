"use strict";

var Gettext = require("node-gettext");
var gt = new Gettext();

var fs = require("fs");
var fileContents = fs.readFileSync("et.po");
gt.addTextdomain("et", fileContents);

class React {

    render() {
        return (
            <div>
                {gt.gettext("React!")}
                {/* whatever */}
            </div>
        );
    }

}
