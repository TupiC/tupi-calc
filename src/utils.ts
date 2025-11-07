import * as vscode from "vscode";

export const calculateExpression = (
    text: string,
    document: vscode.TextDocument
): vscode.DecorationOptions[] => {
    const regex = /(\d|\.)+(?:\s*[+\-*/]\s*(\d|\.)+)+/g;
    const matches = [...text.matchAll(regex)];
    const resultColor =
        vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
            ? "rgba(255, 255, 255, 0.5)"
            : "rgba(0, 0, 0, 0.5)";

    return matches.map((match) => {
        const formula = match[0];
        const startPos = document.positionAt(match.index!);
        const endPos = document.positionAt(match.index! + formula.length);
        let result;
        try {
            result = ` = ${eval(
                formula.replace(/\s/g, "").replace(/([+\-*/])/g, " $1 ")
            )
                .toFixed(5)
                .replace(/\.00000$/, "")}`;
        } catch (error) {
            result = "";
        }
        return {
            range: new vscode.Range(startPos, endPos),
            renderOptions: {
                after: {
                    contentText: result,
                    color: resultColor,
                    fontStyle: "italic",
                },
            },
        };
    });
};
