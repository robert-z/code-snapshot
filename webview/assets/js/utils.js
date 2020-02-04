export const setProperty = (property, value) => {
    document.body.style.setProperty('--' + property, value);
};
