"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = require("await-to-js");
const command_exists_1 = require("command-exists");
const vscode_1 = require("vscode");
const exec_1 = require("../helpers/exec");
const showProgressNotification_1 = require("../helpers/showProgressNotification");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if "heroku" command alias is available
        if (!command_exists_1.sync('heroku')) {
            vscode_1.window.showErrorMessage(`The command "heroku" doesn't seem to be availble. Did you install Heroku CLI ?`);
            return;
        }
        const cwd = vscode_1.workspace.workspaceFolders[0].uri.fsPath;
        const [err1, herokuAppsNames] = yield await_to_js_1.default(showProgressNotification_1.default('Listing current Heroku apps...', () => __awaiter(this, void 0, void 0, function* () {
            const [err, herokuApps] = yield await_to_js_1.default(exec_1.default('heroku', ['apps', '--json'], { cwd }));
            if (err !== null) {
                vscode_1.window.showErrorMessage(`Something went wrong while trying to list your currents Heroku apps.`);
                throw err;
            }
            const herokuAppsJson = JSON.parse(herokuApps.trim());
            return herokuAppsJson.map(({ name }) => name);
        })));
        if (err1 !== null)
            return;
        const herokuAppName = yield vscode_1.window.showQuickPick(herokuAppsNames);
        if (herokuAppName === undefined)
            return;
        const [err2] = yield await_to_js_1.default(showProgressNotification_1.default('Listing current Heroku apps...', () => __awaiter(this, void 0, void 0, function* () {
            const [err] = yield await_to_js_1.default(exec_1.default('heroku', ['git:remote', '-a', herokuAppName], { cwd }));
            if (err !== null) {
                vscode_1.window.showErrorMessage(`Something went wrong while linking your Heroku app: "${herokuAppName}".`);
                return;
            }
        })));
        if (err2 !== null)
            return;
        vscode_1.window.showInformationMessage(`Your current workspace is now linked to the  "${herokuAppName}" Heroku app.`);
    });
}
exports.default = default_1;
