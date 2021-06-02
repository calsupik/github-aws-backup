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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = exports.getOrgRepos = exports.gh = void 0;
var assert_1 = __importDefault(require("assert"));
var simple_git_1 = __importDefault(require("simple-git"));
var GitHub = require('github-api');
var DEFAULT_ORG = process.env.GITHUB_ORG;
var DEFAULT_USERNAME = process.env.GITHUB_USERNAME;
var DEFAULT_TOKEN = process.env.GITHUB_TOKEN;
exports.gh = new GitHub({
    username: DEFAULT_USERNAME,
    token: DEFAULT_TOKEN,
});
function getOrgRepos() {
    return __awaiter(this, void 0, void 0, function () {
        var org, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    assert_1.default(DEFAULT_ORG, 'github org should be set in environment variables');
                    return [4 /*yield*/, exports.gh.getOrganization(DEFAULT_ORG)];
                case 1:
                    org = _b.sent();
                    return [4 /*yield*/, org.getRepos()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error);
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getOrgRepos = getOrgRepos;
function cloneRepo(repo, target) {
    return __awaiter(this, void 0, void 0, function () {
        var remote, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assert_1.default(DEFAULT_ORG, 'github org should be set in environment variables');
                    assert_1.default(DEFAULT_USERNAME, 'github username should be set in environment variables');
                    assert_1.default(DEFAULT_TOKEN, 'github token should be set in environment variables');
                    remote = "https://" + DEFAULT_USERNAME + ":" + DEFAULT_TOKEN + "@github.com/" + DEFAULT_ORG + "/" + repo;
                    return [4 /*yield*/, simple_git_1.default().clone(remote, target)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
exports.cloneRepo = cloneRepo;
