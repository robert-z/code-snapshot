const snapshotContainerNode = document.querySelector('.snapshot-container');
const snapshotContainerBackgroundNode = document.querySelector('.snapshot-container__background');
const terminalNode = document.querySelector('.terminal');
const exportSvgNode = document.getElementById('export-svg');

const resetStyles = () => {
    snapshotContainerNode.style.resize = '';
    terminalNode.style.resize = '';
}

export const takeSnapshot = () => {
    snapshotContainerNode.style.resize = 'none';
    terminalNode.style.resize = 'none';

    const options = {
        width: snapshotContainerBackgroundNode.offsetWidth * 2,
        height: snapshotContainerBackgroundNode.offsetHeight * 2,
        style: {
            transform: 'scale(2)',
            'transform-origin': 'center',
            background: '#e0eafc',
            background: 'linear-gradient(to left, #e0eafc, #cfdef3);'
        }
    };

    if(exportSvgNode.checked) {
        domtoimage
            .toSvg(snapshotContainerBackgroundNode, options)
            .then(function(dataUrl) {
                resetStyles();
                const link = document.createElement('a');
                link.download = 'code-snapshot.svg';
                link.href = dataUrl;
                link.click();
            });
    } else {
        domtoimage
            .toBlob(snapshotContainerBackgroundNode, options)
            .then(function(blob) {
                resetStyles();
                window.saveAs(blob, 'code-snapshot.png');
            });
    }
};
