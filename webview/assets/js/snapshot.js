const snapshotContainerNode = document.querySelector('.snapshot-container');
const snapshotContainerBackgroundNode = document.querySelector('.snapshot-container__background');
const terminalNode = document.querySelector('.terminal');

export const takeSnapshot = () => {
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
            snapshotContainerNode.style.resize = '';
            terminalNode.style.resize = '';
            window.saveAs(blob, 'code-snapshot.png');
        });
};
