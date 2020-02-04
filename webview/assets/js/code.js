import { setProperty } from './utils.js';

const terminalCodeSnippetNode = document.querySelector('.terminal__code-snippet');
let lineNumberWidth;
let minHeight;
const PADDING_LEFT_EXTRA_PX = 15;

const getHtml = clip => clip.getData('text/html');

const setupTerminal = node => {
    node.innerHTML = replaceBrByDiv(node.innerHTML);

    const lines = node.querySelectorAll('div > div');

    lines.forEach((row, index) => {
        row.classList.add('editorLine');
        const lineNumber = document.createElement('div');
        lineNumber.classList.add('editorLineNumber');
        lineNumber.textContent = index + 1;
        row.insertBefore(lineNumber, row.firstChild);
    });

    lineNumberWidth = computeEdeditorLineNumberWidth(lines.length);
    minHeight = computeMinLineHeight(node);

    setProperty('editor-line-number-width', lineNumberWidth + 'px');
    setProperty('editor-line-min-height', minHeight + 'px');
    setProperty('editor-line-padding-left', lineNumberWidth + PADDING_LEFT_EXTRA_PX + 'px');
};

const computeMinLineHeight = node => {
    const elementStyle = window.getComputedStyle(node.querySelector('div'));
    return parseInt(elementStyle.getPropertyValue('line-height'));
};

const computeEdeditorLineNumberWidth = text => {
    const div = document.body.appendChild(document.createElement('div'));
    div.classList.add('editorLineNumber__test');
    div.textContent = text;
    const width = div.clientWidth;
    div.remove();
    return width;
};

const replaceBrByDiv = str => {
    return str.replace(/<br>/gi, '<div></div>');
};

export const pasteCode = clip => {
    const code = getHtml(clip);
    terminalCodeSnippetNode.innerHTML = code;
    setupTerminal(terminalCodeSnippetNode);
};

export const showLineNumbers = () => {
    const editorLineNumbers = document.querySelectorAll('.editorLineNumber');
    editorLineNumbers.forEach(element => (element.style.display = 'block'));
    setProperty('editor-line-padding-left', lineNumberWidth + PADDING_LEFT_EXTRA_PX + 'px');
};

export const hideLineNumbers = () => {
    const editorLineNumbers = document.querySelectorAll('.editorLineNumber');
    editorLineNumbers.forEach(element => (element.style.display = 'none'));
    setProperty('editor-line-padding-left', '0px');
};
