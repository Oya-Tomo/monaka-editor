import React from "react";
import "./App.css";
import { Editor } from "./Editor/editor";

function App() {
    const textParser = (text: string): string => {
        if (text === "") {
            return '<div class="editor-line"></br></div>';
        }
        const lines = text.split("\n");
        var innerText = "";

        for (const line of lines) {
            if (line.length > 0) {
                var parsedLine = line.replaceAll("<", "&lt;");
                parsedLine = parsedLine.replaceAll(">", "&gt;");

                parsedLine = parsedLine.replaceAll(
                    "#",
                    '<span class="hashtag">#</span>'
                );
                parsedLine = parsedLine.replaceAll(
                    "*",
                    '<span class="asterisk">*</span>'
                );
                parsedLine = parsedLine.replaceAll(
                    "-",
                    '<span class="hyphen">-</span>'
                );

                innerText +=
                    '<div class="editor-line">' + parsedLine + "</div>";
            } else {
                innerText += '<div class="editor-line"></br></div>';
            }
        }
        return innerText;
    };
    return (
        <div className="App">
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap');
            </style>
            <Editor className={"text-editor"} parse={textParser} />
        </div>
    );
}

export default App;
