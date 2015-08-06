# grunt-move-cdn-block

> Moves the cdn script tags outside of the bower:js block. Should be used after cdnify and before usemin

This project was originally authored by [royteeuwen](https://github.com/royteeuwen/). The repository that he had setup has since been taken down. I found value in his project and decided to resurrect it and give it a home.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-move-cdn-block --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-move-cdn-block');
```

## The "move-cdn-block" task

### Overview
In your project's Gruntfile, add a section named `move-cdn-block` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  move-cdn-block: {
    dist: {
        files: {
            'test/result.html': 'test/index.html'
        }
    }
  },
});
```

### Options

#### options.cdnPattern
Type: `String`
Default value: `/\s+<script src="\/\/.*[^>]><\/script>/g`

A string value that is used to match cdn script tags.

#### options.cdnResultBlockPattern
Type: `String`
Default value: `/<!-- cdnresultblock -->/`

A string value that is used to match the result block on the page that should be replaced by the cdn script tags

