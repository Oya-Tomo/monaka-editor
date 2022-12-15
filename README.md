# Monaka Editor ~ content-editable div controlling

<p align="center">
    <img src="./assets/monaka.png" alt="monaka" title="monaka" width=300>
</p>

## description

This repository conteins base text area to create a highlighted text editor.</br>
Parody of monaco-editor</br>
But so "Simple".

## tech

[![Used Skills](https://skillicons.dev/icons?i=react,html,css,javascript,typescript)](https://skillicons.dev)

## input proccess

1. get editor info
    - cursor position
    - text content
2. check input mode
    - if cjk input mode, the editor does not repaint contents.
    - if input completed, the editor repaint contents.
3. parse text content
    - escape < and > to \&lt; and \&gt;
    - parse text to html
4. repaint editor
5. set cursor position

## assets

-   monaka image : IRASUTOYA
