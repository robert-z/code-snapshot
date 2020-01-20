(() => {
    const snippetNode = document.getElementById('snippet');
    const codeNode = snippetNode.querySelector('code');
    const sizeNode = document.getElementById('size');

    window.addEventListener('message', e => {
        switch(e.data.type) {
            case 'updateCode':
                document.execCommand('paste')
            break;
        }
    });

    document.addEventListener('paste', event => {
        const code = event.clipboardData.getData('text/html')
        codeNode.innerHTML = code
    });

    if (ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            let w = Math.round(entries[0].contentRect.width);
            let h = Math.round(entries[0].contentRect.height);

            sizeNode.textContent = w + "x" + h;
        });

        resizeObserver.observe(snippetNode);
    }
})();