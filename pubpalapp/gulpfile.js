var gulp = require('gulp');
const replace = require('gulp-replace');
var argv = require('yargs').argv;
var exec = require('child_process').exec;
const { series } = require('gulp');
var prodBuild = argv.prod;
var destFolder = argv.destfolder;
var captype = argv.captype;

function updateBundledWebRuntime() {
    console.log('Changing bundledWebRuntime in capacitor.config.json to true');

    return gulp.src(['./capacitor.config.json'])
        .pipe(replace('"bundledWebRuntime": false,', '"bundledWebRuntime": true,'))
        .pipe(gulp.dest('./'));
}

function addCapacitorJSReference() {
    console.log('Adding capacitor.js to index.html');

    return gulp.src(['./src/index.html'])
        .pipe(replace('<!-- <script src="capacitor.js"></script> -->', '<script src="capacitor.js"></script>'))
        .pipe(gulp.dest('./src/'));
}

function buildApp() {
    var _buildcommand = 'ionic build';
    if (prodBuild) {
        _buildcommand += ' --prod --release';
    }
    console.log('Running ' + _buildcommand);

    return exec(_buildcommand, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
}

function initSite() {
    console.log(`Running "npx cap copy web"`);

    return exec('npx cap copy web', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
}

function copySiteFilesToDest() {
    if (!destFolder) {
        console.log('No destination folder provided.  Provide "--destfolder=[YOURFOLDER]" as part of your gulp task.');
        return null;
    }
    console.log(`Copying files to site folder ${destFolder}`);
    return gulp.src(['./www/**/*']).pipe(gulp.dest(destFolder));
}

function syncCapAndroid() {
    captype = 'android';
    return syncCap();
}

function syncCap() {
    var _capcommand = "npx cap sync";
    switch (captype) {
        case 'android':
            _capcommand = _capcommand + ' android';
            break;
        case 'ios':
            _capcommand = _capcommand + ' ios';
            break;
        case 'web':
            _capcommand = _capcommand + ' web';
            break;
    }
    console.log(`Running ${_capcommand}`);

    return exec(_capcommand, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
}

function finish(done) {
    done();
}

exports.SiteBuildAndDeploy = series(updateBundledWebRuntime, addCapacitorJSReference, buildApp, initSite, copySiteFilesToDest, finish);

exports.AndroidBuildAndSync = series(buildApp, syncCapAndroid, finish);