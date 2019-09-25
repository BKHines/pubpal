var gulp = require('gulp');
const { series } = require('gulp');
var exec = require('child_process').exec;
var argv = require('yargs').argv;
var outputpath = argv.output;
var configuration = argv.config === undefined ? 'production' : argv.config;

function buildSite() {
    console.log(`Running "ng build --prod --configuration=${configuration}"`);

    return exec('ng build --prod --configuration=' + configuration, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
}

function copyFilesToDest() {
    if (!outputpath) {
        console.log('No destination folder provided.  Provide "--output=[YOURFOLDER]" as part of your gulp task.');
        return null;
    }
    console.log(`Copying files to site folder ${outputpath}`);
    return gulp.src(['dist/pubpalweb/**/*']).pipe(gulp.dest(outputpath));
}

function finish(done) {
    done();
}

exports.SiteBuild = series(buildSite, finish);
exports.SiteDeploy = series(copyFilesToDest, finish);
exports.SiteBuildAndDeploy = series(buildSite, copyFilesToDest, finish);
