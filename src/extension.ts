import * as vscode from 'vscode';
import { calculateExpression } from './utils';

export function activate(context: vscode.ExtensionContext) {

	function isExtensionDisabled(): boolean {
		const config = vscode.workspace.getConfiguration('tupicalc');
		return config.get('isDisabled') === true;
	}

	let toggleCommand = vscode.commands.registerCommand('tupicalc.toggleExtension', () => {
		const config = vscode.workspace.getConfiguration('tupicalc');
		const currentState = config.get('isDisabled');
		config.update('isDisabled', !currentState, true).then(() => {
			vscode.window.showInformationMessage(`TupiCalc extension is now ${!currentState ? 'disabled' : 'enabled'}`);
		});
	});

	let decorationType: vscode.TextEditorDecorationType;

	const updateDecorations = () => {
		if (isExtensionDisabled()) {
			return;
		}

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
		toggleCommand,
		vscode.window.onDidChangeActiveTextEditor(updateDecorations),
		vscode.workspace.onDidChangeTextDocument(event => {
			if (event.document === vscode.window.activeTextEditor?.document) {
				updateDecorations();
			}
		})
	);

	vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('tupicalc.isDisabled')) {
			updateDecorations();
		}
	});
}

export function deactivate() {
}