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
			vscode.ViewColumn.Two,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'assets'))]
			}
		);
		
		panel.webview.html = getTemplate(htmlTemplatePath);
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

export function deactivate() {}

function getTemplate(htmlTemplatePath:string) {
	const htmlContent = fs.readFileSync(htmlTemplatePath, "utf-8");
	return htmlContent.replace(/script src="([^"]*)"/g, (match, src) => {
		let assetsPath = vscode.Uri.file(path.resolve(htmlTemplatePath, '..', src)).with({
			scheme: "vscode-resource"
		}).toString();
		return `script src="${assetsPath}"`
	})
}