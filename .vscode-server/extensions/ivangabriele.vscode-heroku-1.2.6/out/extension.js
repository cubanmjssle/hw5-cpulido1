"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const HerokuStatus_1 = require("./components/HerokuStatus");
const linkWorkspace_1 = require("./lib/linkWorkspace");
function activate(context) {
    new HerokuStatus_1.default();
    const linkWorkspaceDisposable = vscode.commands.registerCommand('extension.vscode-heroku.linkWorkspace', () => linkWorkspace_1.default());
    context.subscriptions.push(linkWorkspaceDisposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
