(() => {
    if (ResizeObserver) {
        const snippet = document.getElementById('snippet');
        const size = document.getElementById('size');

        const resizeObserver = new ResizeObserver(entries => {
        let w = Math.round(entries[0].contentRect.width);
        let h = Math.round(entries[0].contentRect.height);

        size.textContent = w + "x" + h;
        });

        resizeObserver.observe(snippet);
    }
})();