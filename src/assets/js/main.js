(() => {
    const snapshotContainerNode     = document.querySelector('.snapshot-container');
    const terminalNode              = document.querySelector('.terminal');
    const terminalCodeSnippetNode   = terminalNode.querySelector('.terminal__code-snippet');
    const sizeNode                  = document.querySelector('.size');
    const shootNode                 = document.querySelector('.shoot');
    const lottieCamera              = document.querySelector('.lottie');
    
    window.addEventListener('message', ({ data: { type } }) => {
        switch(type) {
            case 'updateCode':
                document.execCommand('paste')
            break;
        }
    });
    
    document.addEventListener('paste', event => {
        pasteCode(event.clipboardData, terminalCodeSnippetNode);
    });
    
    const getHtml = clip => clip.getData('text/html')

    const pasteCode = (clip, element) => {
        const code = getHtml(clip);
        element.innerHTML = code;
    }

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

    const lottieAnimationCamera = bodymovin.loadAnimation({
        container: lottieCamera,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://assets6.lottiefiles.com/packages/lf20_O67fb5.json'
    })

    lottieAnimationCamera.addEventListener('data_ready', event => {
        lottieAnimationCamera.playSegments([0, 30], true);
    });

    lottieCamera.addEventListener('click', event => {
        lottieAnimationCamera.playSegments([30, 60], true);
    })

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