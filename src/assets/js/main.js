(() => {
    const snapshotContainerNode = document.querySelector('.snapshot-container');
    const terminalNode          = document.querySelector('.terminal');
    const terminalCodeNode      = terminalNode.querySelector('.terminal__code');
    const sizeNode              = document.querySelector('.size');
    const shootNode             = document.querySelector('.shoot');

    window.addEventListener('message', e => {
        switch(e.data.type) {
            case 'updateCode':
                document.execCommand('paste')
            break;
        }
    });

    document.addEventListener('paste', event => {
        const code = event.clipboardData.getData('text/html')
        terminalCodeNode.innerHTML = code
    });

    shootNode.addEventListener('click', e => {
        snapshotContainerNode.style.resize = 'none',
        terminalNode.style.resize = 'none',

        domtoimage.toBlob(snapshotContainerNode, {
            width: snapshotContainerNode.offsetWidth * 2,
            height: snapshotContainerNode.offsetHeight * 2,
            style: {
                'transform': 'scale(2)',
                'transform-origin': 'center',
                'background': '#e0eafc',
                'background': 'linear-gradient(to left, #e0eafc, #cfdef3);'
            }
        })
        .then(function (blob) {
            snapshotContainerNode.style.resize = '',
            terminalNode.style.resize = '',
            window.saveAs(blob, 'code-snapshot.png');
        });
    });

    if (ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            // let w = Math.round(entries[0].contentRect.width) * 2;
            // let h = Math.round(entries[0].contentRect.height) * 2;
            let w = Math.round(snapshotContainerNode.offsetWidth) * 2;
            let h = Math.round(snapshotContainerNode.offsetHeight) * 2;

            sizeNode.textContent = w + "x" + h;
        });

        resizeObserver.observe(snapshotContainerNode);
        resizeObserver.observe(terminalNode);
    }
})();