import React, { useEffect, useRef, useState } from "react";

interface EditorProps {
    className?: string;
    initText?: string;
    setEditorText?: (text: string) => void;
    parse?: (text: string) => string;
}

const defaultEditorProps: EditorProps = {
    initText: "",
    parse: (text: string): string => {
        const lines = text.split("\n");
        var innerText = "";

        for (const line of lines) {
            if (line.length > 0) {
                var parsedLine = line.replaceAll("<", "&lt;");
                parsedLine = parsedLine.replaceAll(">", "&gt;");

                innerText += "<div>" + parsedLine + "</div>";
            } else {
                innerText += "<div></br></div>";
            }
        }
        return innerText;
    },
};

export const Editor: React.FC<EditorProps> = ({
    className,
    initText,
    setEditorText,
    parse,
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isInputting, setIsInputting] = useState(false);
    const [text, setText] = useState<string>("");
    const [caretPosition, setCaretPosition] = useState<number>(0);

    useEffect(() => {
        setText(initText ? initText : defaultEditorProps.initText!);
    }, [initText]);

    useEffect(() => {
        const editor = editorRef.current;
        if (editor == null) {
            return;
        }
        if (isInputting) {
            return;
        }

        editor.innerHTML = parse
            ? parse(text)
            : defaultEditorProps.parse!(text);
        moveCaret(editor, caretPosition);
        if (setEditorText !== undefined) {
            setEditorText(text);
        }
    }, [text, isInputting, caretPosition, parse, setEditorText]);

    const onInput = () => {
        const editor = editorRef.current;
        const [text, pos] = getEditorInfo(editor!);
        setText(text);
        setCaretPosition(pos);
    };

    return (
        <div
            ref={editorRef}
            className={className}
            contentEditable={true}
            onInput={onInput}
            onCompositionStart={setIsInputting.bind(null, true)}
            onCompositionEnd={setIsInputting.bind(null, false)}
        ></div>
    );
};

const getEditorInfo = (editor: HTMLElement): [string, number] => {
    const selection = document.getSelection();

    const searchLineCaret = (
        line: Node,
        target: Node,
        count: number = 0
    ): [number, boolean] => {
        const searchCaret = (
            nodes: Node[],
            target: Node,
            count: number = 0
        ): [number, boolean] => {
            const [head, ...tail] = nodes;
            if (head == null) {
                return [count, false];
            }

            if (head.nodeName === "#text") {
                if (head === target) {
                    return [count, true];
                } else {
                    return searchCaret(
                        tail,
                        target,
                        count + (head.textContent?.length ?? 0)
                    );
                }
            }
            return searchCaret(
                [...Array.from(head.childNodes), ...tail],
                target,
                count
            );
        };

        if (line.nodeName === "DIV") {
            if (line === target) {
                return [count, true];
            } else {
                return searchCaret(Array.from(line.childNodes), target, count);
            }
        } else if (line.nodeName === "#text") {
            return searchCaret([line], target, count);
        } else {
            return [count, false];
        }
    };

    var text: string = "";
    const target = selection?.focusNode;
    var charsCount = 0;
    var foundCaret = false;

    if (editor === target) {
        foundCaret = true;
    }

    for (const line of Array.from(editor.childNodes)) {
        text += line.textContent;

        if (foundCaret) {
        } else {
            var [count, found] = searchLineCaret(line, target!, charsCount);
            foundCaret = found;
            charsCount = count;
        }

        if (line !== editor.lastChild) {
            text += "\n";
            if (!foundCaret) {
                charsCount += 1;
            }
        }
    }
    return [text, charsCount + (selection?.focusOffset ?? 0)];
};

const moveCaret = (editor: HTMLElement, pos: number): void => {
    const findFocusTarget = (
        nodes: Node[],
        remainLength: number
    ): [number, Node] => {
        for (const part of nodes) {
            if (remainLength - (part.textContent?.length ?? 0) <= 0) {
                if (part.nodeName === "#text") {
                    return [remainLength, part];
                } else {
                    return findFocusTarget(
                        Array.from(part.childNodes),
                        remainLength
                    );
                }
            } else {
                remainLength -= part.textContent?.length ?? 0;
            }
        }
        console.log("something wrong !!");
        return [0, editor];
    };

    const setCaret = (target: Node, offset: number) => {
        const selection = document.getSelection();
        const range = document.createRange();
        range.setStart(target, offset);
        selection?.removeAllRanges();
        selection?.addRange(range);
    };

    var remainLength = pos;
    for (const line of Array.from(editor.childNodes)) {
        if (line.nodeName === "DIV") {
            if (remainLength - (line.textContent?.length ?? 0) <= 0) {
                if ((line.textContent?.length ?? 0) > 0) {
                    const [offset, target] = findFocusTarget(
                        Array.from(line.childNodes),
                        remainLength
                    );
                    setCaret(target, offset);
                    return;
                } else {
                    setCaret(line, remainLength);
                    return;
                }
            } else {
                remainLength -= line.textContent?.length ?? 0;
                remainLength -= 1;
            }
        } else if (line.nodeName === "#text") {
            if (remainLength - (line.textContent?.length ?? 0) <= 0) {
                const [offset, target] = findFocusTarget([line], remainLength);
                setCaret(target, offset);
                return;
            } else {
                remainLength -= line.textContent?.length ?? 0;
                remainLength -= 1;
            }
        } else {
        }
    }
};
