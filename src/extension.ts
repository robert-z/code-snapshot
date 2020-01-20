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
		const activeTextEditor = vscode.window.activeTextEditor;

		if (!activeTextEditor) {
			vscode.window.showErrorMessage("Open a file first to copy text");
			return;
		}

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

		vscode.window.onDidChangeTextEditorSelection(e => {
			if (!e.textEditor.selection.isEmpty) {
				vscode.commands.executeCommand('editor.action.clipboardCopyAction');
				
			  	panel.webview.postMessage({
					type: 'updateCode',
			  	})
			}
		})
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

export function deactivate() {}

const getTemplate = (htmlTemplatePath:string) => {
	const htmlContent = fs.readFileSync(htmlTemplatePath, "utf-8");
	return htmlContent.replace(/script src="([^"]*)"/g, (match, src) => {
		let assetsPath = vscode.Uri.file(path.resolve(htmlTemplatePath, '..', src)).with({
			scheme: "vscode-resource"
		}).toString();
		return `script src="${assetsPath}"`
	})
}