var gulp = require('gulp');
const replace = require('gulp-replace');
var argv = require('yargs').argv;
var exec = require('child_process').exec;
const fileList = require('gulp-filelist');
const { series } = require('gulp');
var prodBuild = argv.prod === undefined ? false : (argv.prod ? argv.prod === 'true' || argv.prod === true : true);
var destFolder = argv.destfolder;
var captype = argv.captype;
var apiRepo = argv.apirepo;
var deployIcons = argv.deployicons;
var apiSite = argv.apisite;

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

function syncIconFiles(done) {
    if (apiRepo) {
        console.log(`Running sync icons file`);
        return gulp.src([apiRepo + '/pubpalapi/appcontent/icons/*.*'])
            .pipe(fileList('icons.json', { relative: true }))
            .pipe(gulp.dest(apiRepo + '/pubpalapi/appcontent/definitions'));
    } else {
        console.log(`Did not sync icons file`);
        done();
    }
}

function deployIconFiles(done) {
    if (deployIcons && apiSite) {
        console.log(`Running deploy icons file`);
        return gulp.src([apiRepo + '/pubpalapi/appcontent/**/*'])
            .pipe(gulp.dest(apiSite + '/appcontent'));
    } else {
        console.log(`Did not deploy icons file`);
        done();
    }
}

function finish(done) {
    done();
}

exports.SiteBuildAndDeploy = series(syncIconFiles, deployIconFiles, updateBundledWebRuntime, addCapacitorJSReference, buildApp, initSite, copySiteFilesToDest, finish);

exports.AndroidBuildAndSync = series(syncIconFiles, deployIconFiles, buildApp, syncCapAndroid, finish);

exports.SyncIconFiles = series(syncIconFiles, deployIconFiles, finish);