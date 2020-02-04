import { pasteCode } from './code.js';
import { takeSnapShoot } from './snapshoot.js';

(() => {
    const snapshotContainerNode = document.querySelector('.snapshot-container');
    const snapshotContainerBackgroundNode = document.querySelector(
        '.snapshot-container__background'
    );
    const terminalNode = document.querySelector('.terminal');
    const sizeNode = document.querySelector('.header__size');
    const shootNode = document.querySelector('.shoot');

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

    shootNode.addEventListener('click', e => {
        takeSnapShoot();
    });

    window.addEventListener('colorPickerChange', function(data) {
        let i = data.detail.el;
        snapshotContainerBackgroundNode.style.backgroundColor = i.value;
    });

    colorPicker.initAll();

    if (ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            let width = Math.round(snapshotContainerNode.offsetWidth) * 2;
            let height = Math.round(snapshotContainerNode.offsetHeight) * 2;

            sizeNode.textContent = width + 'x' + height;
        });

        resizeObserver.observe(snapshotContainerNode);
        resizeObserver.observe(terminalNode);
    }
})();
