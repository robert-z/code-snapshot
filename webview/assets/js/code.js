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


export const getCurrentTimeString = () => {
            
        // get current time in string format for use in filename
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        const milliseconds = date.getMilliseconds() < 10 ? '00' + date.getMilliseconds() : date.getMilliseconds() < 100 ? '0' + date.getMilliseconds() : date.getMilliseconds();
        const filename = `code-snapshot-${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

        return filename;
};
