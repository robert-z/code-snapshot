import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const VIEW_TYPE = 'codeSnapshot';
const WEB_VIEW_TITLE = 'Code Snapshot';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "code-snapshot" is now active!');

	const htmlTemplatePath = path.resolve(context.extensionPath, "src/template/index.html");
	let panel: vscode.WebviewPanel;

	let disposableCodeSnapshotInit = vscode.commands.registerCommand('extension.code.snapshot.init', () => {
		panel = vscode.window.createWebviewPanel(
			VIEW_TYPE,
			WEB_VIEW_TITLE,
			vscode.ViewColumn.Two
		);
		
		panel.webview.html = fs.readFileSync(htmlTemplatePath, "utf-8");
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

export function deactivate() {}
