const terminalCodeSnippetNode = document.querySelector('.terminal__code-snippet');

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

    const lineNumberWidth = computeEdeditorLineNumberWidth(lines.length);
    const minHeight = computeMinLineHeight(node);

    document.body.style.setProperty('--editor-line-number-width', lineNumberWidth + 'px');
    document.body.style.setProperty('--editor-line-min-height', minHeight + 'px');
    document.body.style.setProperty('--editor-line-padding-left', lineNumberWidth + 15 + 'px');
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
    return str.replace(/(<br>)/gi, '<div></div>');
};

export const pasteCode = clip => {
    const code = getHtml(clip);
    terminalCodeSnippetNode.innerHTML = code;
    setupTerminal(terminalCodeSnippetNode);
};
