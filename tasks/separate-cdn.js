'use strict';

var util = require('util'),
    async = require('async'),
    path = require('path');


module.exports = function(grunt) {


    var unixifyPath = function(filepath) {
        var path = '';
        grunt.log.debug('unixifying ', filepath);
        if (process.platform === 'win32') {
            path = filepath.replace(/\\/g, '/');
        } else {
            path = filepath;
        }
        grunt.log.debug('unixified path is ', path);
        return path;
    };


    var detectDestType = function(dest) {
        if (dest[dest.length - 1] === '/') {
            return 'directory';
        } else {
            return 'file';
        }
    };

    var moveCdnTags = function (content, cdnPattern, cdnResultBlockPattern, section) {
        var matches_array =[];
        var result = '';
        var cdnScriptTags = [];
        var bowerTagStartIdx = content.indexOf("<!-- " + section + " -->");
        var bowerTagEndIdx = content.indexOf("<!-- endbower -->", bowerTagStartIdx);
        var bowerContent = content.substring(bowerTagStartIdx, bowerTagEndIdx);

        while ((matches_array = cdnPattern.exec(bowerContent)) !== null) {
            result = result + matches_array[0];
            cdnScriptTags.push(matches_array[0]);
        }

        for (var i = 0; i< cdnScriptTags.length; i++ ) {
            content = content.replace(cdnScriptTags[i], '');
        }

        content = content.replace(cdnResultBlockPattern, result);

        return content;
    };

    grunt.registerMultiTask('separatecdn', 'Moves cdn script tags outside the bower:js block', function() {

        var content, dest;
        var done = this.async();
        var options = this.options({
            section: 'bower:js',
            cdnPattern: /\s+<script src="\/\/.*[^>]><\/script>/g,
            cdnResultBlockPattern: /<!-- cdnresultblock -->/
        });


        async.forEach(this.files, function(file, files_done) {
            async.forEach(file.src, function(src, src_done) {
                if (!grunt.file.exists(src)) {
                    return src_done(src + ' file not found');
                }

                if (grunt.file.isDir(src)) {
                    return src_done();
                }

                if (detectDestType(file.dest) === 'directory') {
                    if (grunt.file.doesPathContain(file.dest, src)) {
                        dest = path.join(file.dest, src.replace(file.dest, ''));
                    } else {
                        dest = path.join(file.dest, src);
                    }
                } else {
                    dest = file.dest;
                }

                dest = unixifyPath(dest);

                content = grunt.file.read(src);
                content = moveCdnTags(content, options.cdnPattern, options.cdnResultBlockPattern, options.section);
                grunt.file.write(dest, content);
                grunt.log.writeln('File ' + dest + ' created.');

                return src_done();
            }, files_done);
        }, function(err) {
            if (err) {
                grunt.log.error(err);
                done(false);
            }
            done();
        });

    });

};
