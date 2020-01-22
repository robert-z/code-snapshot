import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const VIEW_TYPE = 'codeSnapshot';
const WEB_VIEW_TITLE = 'Code Snapshot';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "code-snapshot" is now active!');

	let disposableCodeSnapshotInit = vscode.commands.registerCommand('extension.code.snapshot.init', () => {
		const activeTextEditor = vscode.window.activeTextEditor;

		const panel = createPanel(context);

		const selectionHandler = vscode.window.onDidChangeTextEditorSelection(e => {
			if (hasTextSelected(activeTextEditor?.selection)) {
				update(panel)
			}
		});

		panel.onDidDispose(() => selectionHandler.dispose());
	});

	context.subscriptions.push(disposableCodeSnapshotInit);
}

const update = (panel:vscode.WebviewPanel): void => {
	vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		
	panel.webview.postMessage({
		type: 'updateCode',
	});
};

const createPanel = (context: vscode.ExtensionContext) : vscode.WebviewPanel => {
	const htmlTemplatePath = path.resolve(context.extensionPath, "src/template/index.html");
	const panel = vscode.window.createWebviewPanel(
		VIEW_TYPE,
		WEB_VIEW_TITLE,
		vscode.ViewColumn.Two,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(context.extensionPath)]
		}
	);

	panel.webview.html = getTemplate(htmlTemplatePath);

	return panel;
};

const getTemplate = (htmlTemplatePath:string): string => {
	const htmlContent = fs.readFileSync(htmlTemplatePath, "utf-8");
	return htmlContent.replace(/script src="([^"]*)"/g, (match, src) => {
		let assetsPath = vscode.Uri.file(path.resolve(htmlTemplatePath, '..', src)).with({
			scheme: "vscode-resource"
		}).toString();
		return `script src="${assetsPath}"`
	})
}

const hasTextSelected = (selection:vscode.Selection | undefined): Boolean => !!selection && !selection.isEmpty;

export function deactivate() {}
