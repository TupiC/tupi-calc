import * as vscode from 'vscode';
import * as acorn from 'acorn';
import * as math from 'mathjs';

export const calculateExpression = (text: string, document: vscode.TextDocument): vscode.DecorationOptions[] => {
    const regex = /\b\d+(?:\s*[+\-*/]\s*\d+)+\b/g;
    const matches = [...text.matchAll(regex)];

    return matches.map(match => {
        const formula = match[0];
        const startPos = document.positionAt(match.index!);
        const endPos = document.positionAt(match.index! + formula.length);
        let result;
        try {
            result = eval(
                formula
                    .replace(/\s/g, '')
                    .replace(/([+\-*/])/g, ' $1 ')
            );
        } catch (error) {
            result = 'Error';
        }
        return {
            range: new vscode.Range(startPos, endPos),
            renderOptions: {
                after: {
                    contentText: ` = ${result}`,
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontStyle: 'italic'
                }
            }
        };
    });
};

export const extractVariables = (code: string): { [key: string]: any } => {
    const variables: { [key: string]: any } = {};
    const ast = acorn.parse(code, { ecmaVersion: 2020 });

    ast.body.forEach((node: any) => {
        if (node.type === 'VariableDeclaration') {
            node.declarations.forEach((declaration: any) => {
                if (declaration.init && declaration.id.type === 'Identifier') {
                    try {
                        variables[declaration.id.name] = math.evaluate(declaration.init.raw);
                    } catch (error) {
                    }
                }
            });
        }
    });

    return variables;
}