#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var sys = require('util');

var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
console.log("%s does not exist. Exiting.", instr);
process.exit(1); 
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioURL = function(htmlurl) {
    return cheerio.load(htmlurl);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtml = function(html, checksfile) {
    $ = html;
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
var present = $(checks[ii]).length > 0;
out[checks[ii]] = present;
    }
    return out;
};

var processFormat = function(htmlfile, url, checksfile) {
    if (!htmlfile) { 
rest.get(url).on('complete', function(result) {
console.log(checkHtml(cheerioURL(result), checksfile));
return checkHtml(cheerioURL(result), checksfile);
});
    } else {
return checkHtml(cheerioHtmlFile(htmlfile), checksfile);
    }
};

var clone = function(fn) {
    return fn.bind({});
};

if(require.main == module) {
    program
.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
.option('-u, --url <url>', 'Check passed URL')
.parse(process.argv);
    var checkJson = processFormat(program.file, program.url, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtml = checkHtml;
}
