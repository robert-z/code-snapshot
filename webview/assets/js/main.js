import { pasteCode, showLineNumbers, hideLineNumbers } from './code.js';
import { takeSnapshot } from './snapshot.js';

(() => {
    const snapshotContainerNode = document.querySelector('.snapshot-container');
    const snapshotContainerBackgroundNode = document.querySelector(
        '.snapshot-container__background'
    );
    const terminalNode = document.querySelector('.terminal');
    const sizeNode = document.querySelector('.header__size');
    const shootNode = document.querySelector('.shoot');
    const showLineNumbersNode = document.querySelector('#show-line-numbers');

    window.addEventListener('message', ({ data: { type } }) => {
        switch (type) {
            case 'updateCode':
                document.execCommand('paste');
                break;
        }
    });

    document.addEventListener('paste', event => {
        pasteCode(event.clipboardData);
    });

    shootNode.addEventListener('click', event => {
        takeSnapshot();
    });

    showLineNumbersNode.addEventListener('change', event => {
        const checkbox = event.target;

        if (checkbox.checked) {
            showLineNumbers();
        } else {
            hideLineNumbers();
        }
    });

    window.addEventListener('colorPickerChange', function(data) {
        const color = data.detail.el.value;
        snapshotContainerBackgroundNode.style.backgroundColor = color;
    });

    colorPicker.initAll();

    if (ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            let width = Math.round(snapshotContainerNode.offsetWidth) * 2;
            let height = Math.round(snapshotContainerNode.offsetHeight) * 2;

            sizeNode.textContent = width + 'x' + height;
        });

        resizeObserver.observe(snapshotContainerNode);
        resizeObserver.observe(terminalNode);
    }
})();
