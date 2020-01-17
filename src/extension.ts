import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "code-snapshot" is now active!');

	let disposableCodeSnapshotInit = vscode.commands.registerCommand('extension.code.snapshot.init', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

export function deactivate() {}
