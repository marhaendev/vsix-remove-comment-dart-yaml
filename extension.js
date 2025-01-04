const vscode = require("vscode");

/**
 * Removes comments and formats code for .dart and .yaml files
 * @param {string} content
 * @param {string} language
 */
function processContent(content, language) {
  let cleanedContent = content;

  if (language === "dart") {
    // Remove comments for Dart
    cleanedContent = cleanedContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").trim();
  } else if (language === "yaml") {
    // Remove comments for YAML
    cleanedContent = cleanedContent.replace(/#.*/g, "").trim();
  }

  return cleanedContent;
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "remove-comment-dart-yaml.run",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No file is currently open.");
        return;
      }

      const document = editor.document;
      const language = document.languageId;

      // Only process .dart and .yaml files
      if (language !== "dart" && language !== "yaml") {
        vscode.window.showErrorMessage(
          "This extension only supports .dart and .yaml files."
        );
        return;
      }

      const content = document.getText();
      const processedContent = processContent(content, language);

      // Replace file content with the processed version
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(content.length)
      );
      edit.replace(document.uri, fullRange, processedContent);

      await vscode.workspace.applyEdit(edit);
      vscode.window.showInformationMessage("Comments removed and code formatted.");
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
