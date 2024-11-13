import * as vscode from 'vscode';
import { calculateExpression } from './utils';

export function activate(context: vscode.ExtensionContext) {
	let decorationType: vscode.TextEditorDecorationType;

	const updateDecorations = () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		const text = document.getText();
		const decorations = calculateExpression(text, document);

		if (!decorationType) {
			decorationType = vscode.window.createTextEditorDecorationType({});
		}

		editor.setDecorations(decorationType, decorations);
	};

	updateDecorations();

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(updateDecorations),
		vscode.workspace.onDidChangeTextDocument(event => {
			if (event.document === vscode.window.activeTextEditor?.document) {
				updateDecorations();
			}
		})
	);
}

export function deactivate() {
}