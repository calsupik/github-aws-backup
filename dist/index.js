#!/usr/bin/env node

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var fs_1 = __importDefault(require("fs"));
var tar_1 = __importDefault(require("tar"));
var uuid_1 = require("uuid");
var aws_1 = require("./libs/aws");
var github_1 = require("./libs/github");
(function ghaws() {
    return __awaiter(this, void 0, void 0, function () {
        var backupInstancePrefix, fullPrefixBase, repos, _i, repos_1, repo, filePathInBucket, fileData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, 8, 9]);
                    backupInstancePrefix = Date.now() + "__" + uuid_1.v4();
                    fullPrefixBase = [
                        process.env.AWS_S3_PREFIX || 'github',
                        backupInstancePrefix,
                    ];
                    return [4 /*yield*/, github_1.getOrgRepos()];
                case 1:
                    repos = _a.sent();
                    _i = 0, repos_1 = repos;
                    _a.label = 2;
                case 2:
                    if (!(_i < repos_1.length)) return [3 /*break*/, 6];
                    repo = repos_1[_i];
                    console.log("Backing up repo \"" + repo.name + "\" to S3...");
                    if (fs_1.default.existsSync(repo.name + ".git"))
                        fs_1.default.rmSync(repo.name + ".git", { recursive: true });
                    if (fs_1.default.existsSync(repo.name + ".git.tar.gz"))
                        fs_1.default.rmSync(repo.name + ".git.tar.gz");
                    // https://github.com/steveukx/git-js
                    return [4 /*yield*/, github_1.cloneRepo(repo.name, repo.name + ".git")
                        // https://github.com/npm/node-tar
                    ];
                case 3:
                    // https://github.com/steveukx/git-js
                    _a.sent();
                    // https://github.com/npm/node-tar
                    tar_1.default.c({ gzip: true, sync: true, file: repo.name + ".git.tar.gz" }, [
                        repo.name + ".git",
                    ]);
                    filePathInBucket = __spreadArray(__spreadArray([], fullPrefixBase), [repo.name + ".git.tar.gz"]);
                    fileData = fs_1.default.readFileSync(repo.name + ".git.tar.gz");
                    return [4 /*yield*/, aws_1.uploadObject(filePathInBucket.join('/'), fileData)];
                case 4:
                    _a.sent();
                    if (fs_1.default.existsSync(repo.name + ".git"))
                        fs_1.default.rmSync(repo.name + ".git", { recursive: true });
                    if (fs_1.default.existsSync(repo.name + ".git.tar.gz"))
                        fs_1.default.rmSync(repo.name + ".git.tar.gz");
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    console.log("Successfully saved your repos to:");
                    console.log("s3://" + process.env.AWS_S3_BUCKET + "/" + fullPrefixBase.join('/'));
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _a.sent();
                    console.error("Error processing repos", err_1);
                    return [3 /*break*/, 9];
                case 8:
                    process.exit();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
})();
