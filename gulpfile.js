const gulp = require('gulp')
const insert = require('gulp-insert')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

gulp.task('src', function () {
  return gulp
    .src(['src/**/*.ts', '!src/**/*.spec.ts'])
    .pipe(plumber())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('index', function () {
  return gulp
    .src('./dist/index.js')
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', gulp.series('src', 'index'))
