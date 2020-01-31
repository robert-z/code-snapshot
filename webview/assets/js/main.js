(() => {
    const snapshotContainerNode             = document.querySelector('.snapshot-container');
    const snapshotContainerBackgroundNode   = document.querySelector('.snapshot-container__background');
    const terminalNode                      = document.querySelector('.terminal');
    const terminalCodeSnippetNode           = document.querySelector('.terminal__code-snippet');
    const sizeNode                          = document.querySelector('.header__size');
    const shootNode                         = document.querySelector('.shoot');

    const pasteCode = (clip, element) => {
        const code = getHtml(clip);
        element.innerHTML = code;
        setupLines(element);
    }

    const getHtml = clip => clip.getData('text/html')

    const setupLines = node => {
        node.innerHTML = replaceBrByDiv(node.innerHTML);
        computedPseudoBeforeWidth(node);
    }

    const replaceBrByDiv = (str) => {
        return str.replace( /(<br>)/ig, '<div>&nbsp;</div>');
    }

    const computedPseudoBeforeWidth = node => {
        document.body.style.setProperty('--line-number-width', 'auto');
        document.body.style.setProperty('--line-number-paddingLeft', 'auto');

        let pseudoBeforeWidth = window.getComputedStyle(
            node.querySelector('div > div:last-child'), 
            ':before'
        ).width;

        const lineNumberMaxWidth = parseInt(pseudoBeforeWidth);

        document.body.style.setProperty('--line-number-width', lineNumberMaxWidth + 'px');
        document.body.style.setProperty('--line-number-paddingLeft', lineNumberMaxWidth + 15 + 'px');
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