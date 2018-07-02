'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function filterline(rex_str: string, mode: string) {

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    let regexp = new RegExp(rex_str);

    for (var selection of editor.selections) {
        let text = editor.document.getText(selection);
        let result: string[] = [];
        for (var line of text.split("\n")) {
            if (mode === 'flush') {
                if (!regexp.test(line)) {
                    result.push(line);
                }
            } else {
                if (regexp.test(line)) {
                    result.push(line);
                }
            }
        }
        if (result.length) {
            editor.edit(function (editb) {
                editb.replace(selection, result.join("\n"));
            }
            );
        }
    }
}

function _validate_input(text: string): string | undefined  {
    if (text){
        try {
            RegExp(text);
        } catch (Error) {
            return Error.message;
        }
    }
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-filter-line" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let flushlines = vscode.commands.registerCommand('extension.flushlines', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        let rex_prompt: vscode.InputBoxOptions = {
            prompt: "Regexp to flush lines: ",
            placeHolder: "a regexp eg. password\\w ",
            validateInput: _validate_input,
        };

        vscode.window.showInputBox(rex_prompt).then(function (value) {
            if (!value) {
                return;
            }
            filterline(value, 'flush');
        });

    });

    context.subscriptions.push(flushlines);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let keeplines = vscode.commands.registerCommand('extension.keeplines', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let rex_prompt: vscode.InputBoxOptions = {
            prompt: "Regexp to keep lines: ",
            placeHolder: "a regexp eg. myword\\w ",
            validateInput: _validate_input,
        };

        vscode.window.showInputBox(rex_prompt).then(function (value) {
            if (!value) {
                return;
            }
            filterline(value, 'keep');
        });

    });

    context.subscriptions.push(keeplines);
}

// this method is called when your extension is deactivated
export function deactivate() {
}