import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext){

    // autoArray.definition
    // Generates a defenition of an array with elements of chosen type, with chosen name, with elements {element1, element2...}
    // Command Palette name: Generate an array of chosen type and size definition
    // Usage: <type> <name> <element1> <element2>...
    const def_command = vscode.commands.registerCommand('autoArray.definition',  () =>{
        const editor = vscode.window.activeTextEditor;

        if(!editor){
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }

        const selection = editor.selection;
        if(!selection.isSingleLine){
            vscode.window.showErrorMessage("Too much lines selected! Select 1 line per call");
            return;
        }

        const selected_text=editor.document.getText(selection);

        if(!selected_text || selected_text.trim().length === 0) {
            vscode.window.showErrorMessage("No relevant text selected");
            return;
        }

        const document = editor.document;
        const line = document.lineAt(selection.start);
        const find_indent = line.text.match(/^(\s*)/);
        const indent = find_indent? find_indent[0] : '';
        const words = line.text.split(/\s+/);

        let k = indent.length>0?1:0;

        if(words.length - k < 3){
            vscode.window.showErrorMessage("Array must contain at least 1 element");
            return;
        }
        
        let array_def = indent+words[k] + " " + words[k+1] + "[] = {";
        for(let i =k+2; i<words.length; ++i){
            array_def = array_def + words[i];
            if(!(i === words.length-1)){
                array_def = array_def + ", ";
            }
        }
        array_def = array_def+"};";

        const succes =editor.edit(edit_builder => {
            edit_builder.replace(selection, array_def);
        });
        if(!succes) {
            vscode.window.showErrorMessage("Something went wrong");
        }
    });

    context.subscriptions.push(def_command);

    // autoArray.output
    // Generates a printing of an array with chosen name to cout. Elements divided with space, printing std::endl at the end of array
    // Command Palette name: Generate an array output to cout
    // Usage: <name>
    const output_command = vscode.commands.registerCommand('autoArray.output', () =>{
        const editor = vscode.window.activeTextEditor;

        if(!editor){
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }

        const selection = editor.selection;
        if(!selection.isSingleLine){
            vscode.window.showErrorMessage("Too much lines selected! Select 1 line per call");
            return;
        }

        const selected_text=editor.document.getText(selection);

        if(!selected_text || selected_text.trim().length === 0) {
            vscode.window.showErrorMessage("No relevant text selected");
            return;
        }

        const document = editor.document;
        const line = document.lineAt(selection.start);
        const find_indent = line.text.match(/^(\s*)/);
        const indent = find_indent? find_indent[0] : '';
        const words = line.text.split(/\s+/);

        let k = indent.length>0?1:0;

        if(words.length - k > 1){
            vscode.window.showErrorMessage("Too much arguments!\n Usage: <name>");
            return;
        }
        
        let array_output = indent+ "for(auto& i : " + words[k] + ") std::cout<<i<<\" \";\n"+
        indent+"std::cout<<std::endl";

        const succes = editor.edit(edit_builder => {
            edit_builder.replace(selection, array_output);
        });
        if(!succes) {
            vscode.window.showErrorMessage("Something went wrong");
        }
    });

    context.subscriptions.push(output_command);

    // autoArray.input
    // Generates a defenition of an array with elements of chosen type, with chosen name and read his elements from cin
    // Command Palette name: Generate an array input from cin
    // Usage: <type> <name> <size>
    const input_command = vscode.commands.registerCommand('autoArray.input', () =>{
        const editor = vscode.window.activeTextEditor;

        if(!editor){
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }

        const selection = editor.selection;
        if(!selection.isSingleLine){
            vscode.window.showErrorMessage("Too much lines selected! Select 1 line per call");
            return;
        }

        const selected_text=editor.document.getText(selection);

        if(!selected_text || selected_text.trim().length === 0) {
            vscode.window.showErrorMessage("No relevant text selected");
            return;
        }

        const document = editor.document;
        const line = document.lineAt(selection.start);
        const find_indent = line.text.match(/^(\s*)/);
        const indent = find_indent? find_indent[0] : '';
        const words = line.text.split(/\s+/);

        let k = indent.length>0?1:0;

        if(words.length - k > 3){
            vscode.window.showErrorMessage("Too much arguments!\n Usage: <type> <name> <size>");
            return;
        }
        
        let array_input = indent+words[k] + " " + words[k+1] + "["+words[k+2]+"];\n" + 
        indent+ "for(auto& i : " + words[k+1] + ") std::cin>>i;";

        const succes = editor.edit(edit_builder => {
            edit_builder.replace(selection, array_input);
        });
        if(!succes) {
            vscode.window.showErrorMessage("Something went wrong");
        }
    });

    context.subscriptions.push(input_command);
}