(() => {
    const snapshotContainerNode = document.querySelector('.snapshot-container');
    const snapshotContainerBackgroundNode = document.querySelector(
        '.snapshot-container__background'
    );
    const terminalNode = document.querySelector('.terminal');
    const terminalCodeSnippetNode = document.querySelector('.terminal__code-snippet');
    const sizeNode = document.querySelector('.header__size');
    const shootNode = document.querySelector('.shoot');

    const pasteCode = (clip, element) => {
        const code = getHtml(clip);
        element.innerHTML = code;
        setupTerminal(element);
    };

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

        const width = computeEdeditorLineNumberWidth(lines.length);

        document.body.style.setProperty('--line-number-width', width + 'px');
        document.body.style.setProperty('--editor-line-padding-left', width + 15 + 'px');
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
        return str.replace(/(<br>)/gi, '<div>&nbsp;</div>');
    };

    window.addEventListener('message', ({ data: { type } }) => {
        switch (type) {
            case 'updateCode':
                document.execCommand('paste');
                break;
        }
    });

    document.addEventListener('paste', event => {
        pasteCode(event.clipboardData, terminalCodeSnippetNode);
    });

    shootNode.addEventListener('click', e => {
        snapshotContainerNode.style.resize = 'none';
        terminalNode.style.resize = 'none';

        domtoimage
            .toBlob(snapshotContainerBackgroundNode, {
                width: snapshotContainerBackgroundNode.offsetWidth * 2,
                height: snapshotContainerBackgroundNode.offsetHeight * 2,
                style: {
                    transform: 'scale(2)',
                    'transform-origin': 'center',
                    background: '#e0eafc',
                    background: 'linear-gradient(to left, #e0eafc, #cfdef3);'
                }
            })
            .then(function(blob) {
                (snapshotContainerNode.style.resize = ''),
                    (terminalNode.style.resize = ''),
                    window.saveAs(blob, 'code-snapshot.png');
            });
    });

    window.addEventListener('colorPickerChange', function(data) {
        let i = data.detail.el;
        snapshotContainerBackgroundNode.style.backgroundColor = i.value;
    });

    colorPicker.initAll();

    if (ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            // let w = Math.round(entries[0].contentRect.width) * 2;
            // let h = Math.round(entries[0].contentRect.height) * 2;
            let w = Math.round(snapshotContainerNode.offsetWidth) * 2;
            let h = Math.round(snapshotContainerNode.offsetHeight) * 2;

            sizeNode.textContent = w + 'x' + h;
        });

        resizeObserver.observe(snapshotContainerNode);
        resizeObserver.observe(terminalNode);
    }
})();
