import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "code-snapshot" is now active!');

	let disposableCodeSnapshotInit = vscode.commands.registerCommand('extension.code.snapshot.init', () => {

		showPanel();
		
		// vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

export function deactivate() {}

function showPanel() {
	let panel: vscode.WebviewPanel;

	panel = vscode.window.createWebviewPanel(
		'codeSnapshot',
		'Code Snapshot',
		vscode.ViewColumn.Two,
		{
			enableScripts: true,
		}
	);
	
	panel.webview.html = '<h1>Hello World!</h1>';
}