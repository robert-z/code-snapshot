import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const VIEW_TYPE = 'codeSnapshot';
const WEB_VIEW_TITLE = 'Code Snapshot';

const init = (context: vscode.ExtensionContext) => {
	const activeTextEditor = vscode.window.activeTextEditor;

	const panel = createPanel(context);

	const selectionHandler = vscode.window.onDidChangeTextEditorSelection(e => {
		if (hasTextSelected(e.textEditor.selection)) {
			update(panel)
		}
	});

	panel.onDidDispose(() => selectionHandler.dispose());

	if (hasTextSelected(activeTextEditor?.selection)) update(panel);
}

const createPanel = (context: vscode.ExtensionContext) : vscode.WebviewPanel => {
	const htmlTemplatePath = path.resolve(context.extensionPath, "webview/index.html");
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
	return htmlContent.replace(/script src="([^"]*)"/g, (_match, src) => {
		let assetsPath = vscode.Uri.file(path.resolve(htmlTemplatePath, '..', src)).with({
			scheme: "vscode-resource"
		}).toString();
		return `script src="${assetsPath}"`
	})
}

const update = (panel:vscode.WebviewPanel): void => {
	vscode.commands.executeCommand('editor.action.clipboardCopyAction');
	
	panel.webview.postMessage({
		type: 'updateCode',
	});
};

const hasTextSelected = (selection:vscode.Selection | undefined): Boolean => !!selection && !selection.isEmpty;

export const activate = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(
		vscode.commands.registerCommand('codesnapshot.init', () => init(context))
	);
}

export const deactivate = () => {}
