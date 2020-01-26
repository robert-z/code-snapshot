(() => {
    const snapshotContainerNode             = document.querySelector('.snapshot-container');
    const snapshotContainerBackgroundNode   = document.querySelector('.snapshot-container__background');
    const terminalNode                      = document.querySelector('.terminal');
    const terminalCodeSnippetNode           = document.querySelector('.terminal__code-snippet');
    const sizeNode                          = document.querySelector('.header__size');
    const shootNode                         = document.querySelector('.shoot');
    const lottieCamera                      = document.querySelector('.lottie');
    const transparentBackground             = document.querySelector('.options_transparent-background');
    
    const getHtml = clip => clip.getData('text/html')
    
    const pasteCode = (clip, element) => {
        const code = getHtml(clip);
        element.innerHTML = code;
    }
    
    const shootAnimation = () => {
        lottieAnimationCamera.playSegments([30, 60], true);
    }

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
    
    shootNode.addEventListener('click', e => {
        shootAnimation();

        snapshotContainerNode.style.resize = 'none';
        terminalNode.style.resize = 'none';
        
        domtoimage.toBlob(snapshotContainerBackgroundNode, {
            width: snapshotContainerBackgroundNode.offsetWidth * 2,
            height: snapshotContainerBackgroundNode.offsetHeight * 2,
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

    window.addEventListener('colorPickerChange', function (data) {
        let i = data.detail.el;
        snapshotContainerBackgroundNode.style.backgroundColor = i.value;
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


    colorPicker.initAll()

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