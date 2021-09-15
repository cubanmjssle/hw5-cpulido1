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
const moment = require("moment");
const vscode_1 = require("vscode");
const exec_1 = require("../helpers/exec");
const shortenMomentOutput_1 = require("../helpers/shortenMomentOutput");
// Icons: https://octicons.github.com
const STATUS = {
    ERROR: {
        name: 'Error',
        icon: 'alert',
        message: 'Heroku went wrong.',
        tooltip: `Sorry but something went wrong while checking Heroku status.`,
    },
    FAILED: {
        name: 'Failed',
        icon: 'alert',
        message: 'Heroku',
        tooltip: `The last Heroku deployment failed.`,
    },
    NONE: {
        name: 'None',
        icon: 'circle-slash',
        message: 'Heroku',
        tooltip: `No Heroku deployment for this project yet.`,
    },
    PENDING: {
        name: 'Pending',
        icon: 'clock',
        message: 'Heroku',
        tooltip: `Heroku deployment in progress...`,
    },
    SUCCESSFUL: {
        name: 'Successful',
        icon: 'check',
        message: 'Heroku',
        tooltip: `The last Heroku deployment succeeded.`,
    },
    SYNCING: {
        name: 'Syncing',
        icon: 'sync',
        message: 'Heroku',
        tooltip: `Fetching the current Heroku deployment status...`,
    },
    UNAVAILABLE: {
        name: 'Unavailable',
        icon: 'alert',
        message: 'Heroku CLI unavailable',
        tooltip: `The "heroku" command doesn't seem available. Did you install Heroku CLI ?`,
    },
};
const LOOP_DELAY = 2500;
class HerokuStatus {
    constructor() {
        this.cwd = vscode_1.workspace.workspaceFolders[0].uri.fsPath;
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        this.start();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isWorkspaceLinkedToHeroku())) {
                setTimeout(this.start.bind(this), LOOP_DELAY);
                return;
            }
            this.setStatusTo(STATUS.SYNCING);
            this.statusBarItem.show();
            yield this.checkHerokuDeployments();
        });
    }
    setStatusTo(status, version = 0, date = '') {
        let message = `$(${status.icon})  ${status.message}`;
        if (version !== 0)
            message += ` v${version}`;
        if (date !== '')
            message += ` (${shortenMomentOutput_1.default(moment(date).fromNow())})`;
        if (message === this.lastMessage && status.name === this.lastStatus)
            return;
        this.lastMessage = message;
        this.lastStatus = status.name;
        this.statusBarItem.text = message;
        this.statusBarItem.tooltip = status.tooltip;
    }
    checkHerokuDeployments() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!command_exists_1.sync('heroku')) {
                this.setStatusTo(STATUS.UNAVAILABLE);
                setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY);
                return;
            }
            const [err, out] = yield await_to_js_1.default(exec_1.default('heroku', ['releases', '-n=1', '--json'], { cwd: this.cwd }));
            if (err !== null) {
                this.setStatusTo(STATUS.ERROR);
                setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY);
                return;
            }
            const herokuReleases = JSON.parse(out.trim());
            if (herokuReleases.length === 0) {
                this.setStatusTo(STATUS.NONE);
                setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY);
                return;
            }
            // if (herokuReleases[0].status === 'pending') {
            //   this.setStatusTo(STATUS.PENDING, herokuReleases[0].version, herokuReleases[0].created_at)
            //   setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY)
            //   return
            // }
            if (herokuReleases[0].status === 'succeeded') {
                this.setStatusTo(STATUS.SUCCESSFUL, herokuReleases[0].version, herokuReleases[0].created_at);
                setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY);
                return;
            }
            this.setStatusTo(STATUS.FAILED, herokuReleases[0].version, herokuReleases[0].created_at);
            setTimeout(this.checkHerokuDeployments.bind(this), LOOP_DELAY);
        });
    }
    isWorkspaceLinkedToHeroku() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err] = yield await_to_js_1.default(exec_1.default('heroku', ['info'], { cwd: this.cwd }));
            return err === null;
        });
    }
}
exports.default = HerokuStatus;
