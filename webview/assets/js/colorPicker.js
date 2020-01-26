document.body.insertAdjacentHTML('afterbegin', '<div id="clpi-m"><div id="clpi-p"><div id="clpi-w"><div id="clpi-a"><div id="clpi-o"></div></div><div class="clpi-r"><div class="clpi-e clpi-e-hsl"> <input type="range" id="clpi-i-hsl" min="0" max="1" value="1" step="0.01"><div class="clpi-c" id="clpi-c-hsl"></div></div><div class="clpi-e" id="clpi-e-alpha"> <input type="range" id="clpi-i-alpha" min="0" max="1" value="1" step="0.01"><div class="clpi-c" id="clpi-c-alpha"></div></div></div></div><div class="clpi-b"><div class="clpi-b-hex"><input type="text" id="clpi-c"></div><div class="clpi-u"></div></div><div class="clpi-x"><div class="clpi-z"><div class="clpi-v"><div class="clpi-o" style="background: rgb(0, 0, 0);"></div><div class="clpi-o" style="background: rgb(255, 255, 255);"></div></div><div id="clpi-l"></div></div><div class="clpi-l-angle"> <input type="number" id="clpi-l-angle" placeholder="0"></div></div></div></div>');

var colorPicker = {
    input: null,
    thumb: null,
    value: '',
    h: 0,
    s: 0,
    l: 0,
    alpha: 1,

    gradientActive: false,
    gradientControl: null,
    gradientAngle: 0,
    gradientColor: document.getElementById('clpi-l'),
    gradientAngleInut: document.getElementById('clpi-l-angle'),

    mask: document.getElementById('clpi-m'),
    picker: document.getElementById('clpi-p'),

    currentColor: document.getElementById('clpi-c'),

    area: document.getElementById('clpi-a'),
    areaPosition: 0,

    pointer: document.getElementById('clpi-o'),
    pointerMove: false,

    hslInput: document.getElementById('clpi-i-hsl'),
    hslRangeControl: document.getElementById('clpi-c-hsl'),
    alphaRange: document.getElementById('clpi-e-alpha'),
    alphaInput: document.getElementById('clpi-i-alpha'),
    alphaRangeControl: document.getElementById('clpi-c-alpha'),

    cssClassControlActive: 'clpi-o-active',

    init: function (node) {
        let parent = node.closest('.clpi-wrapper'),
            input = parent.querySelector('input'),
            thumb = parent.querySelector('div');

        this.input = input;
        this.thumb = thumb;

        if (input.matches('.clpi-gradient')) {
            this.picker.classList.add('clpi-l-support');
        }

        this.mask.classList.add('clpi-m-show');

        let pos = input.getBoundingClientRect(),
            height = this.picker.getBoundingClientRect().height;

        let setToBottom = pos.top + pos.height + height > window.innerHeight;

        if (setToBottom) {
            setToBottom = pos.top - height - 5;
        } else {
            setToBottom = pos.top + pos.height + 5;
        }

        this.picker.style.top = setToBottom + 'px';
        this.picker.style.left = pos.left + 'px';

        let val = input.value;

        if (val.length < 3) return;

        if (val.includes('gradient')) {
            this.initGradient(val);
        } else if (val.includes('rgb')) {
            this.initRgb(val);
        } else {
            this.initHex(val);
        }
    },

    initGradient: function (val) {
        this.gradientActive = true;
        this.picker.classList.add('clpi-l-active');

        val = val.replace('linear-gradient(', '').slice(0, -1);

        let angle = val.split(',');
        angle = angle[0].replace(/[^\d,]/g, '');

        if (angle) {
            this.gradientAngleInut.value = parseInt(angle);
            this.gradientAngle = parseInt(angle);
        }

        let controls = val.match(/\((.*?)\)/g);

        // in case custom gradient input
        if (!controls) return;

        controls.forEach(function (v, k) {

            let rgb = v.replace(/[^\d,]/g, '').split(',').map(function (v) {
                return parseFloat(v)
            });

            if (rgb.length > 3) {
                rgb[3] = rgb[3] / 100;
            }

            document.querySelectorAll('.clpi-o')[k].style.background = rgb.length > 3 ? 'rgba(' + rgb.join(',') + ')' : 'rgb(' + rgb.join(',') + ')';

            controls[k] = rgb;
        });

        this.setGradientControl(document.querySelector('.clpi-o'));
    },

    initRgb: function (val) {
        let rgb = val.replace(/[^\d,]/g, '').split(',').map(function (v) {
            return parseFloat(v)
        });

        if (rgb.length > 3) {
            rgb[3] = rgb[3] / 100;
        }

        this.update(rgb);
    },

    initHex: function (val) {
        this.setCurrent(val);
    },

    change: function () {
        let n = this.hslRgb(this.h, this.s, this.l),
            hex = this.rgbHex(n);

        this.currentColor.value = hex;
        this.area.style.background = 'hsl(' + parseInt(this.h * 360) + ', 100%, 50%)';
        this.alphaRange.style.background = 'linear-gradient(to right, rgba(' + n.join(',') + ', 0) 0%, rgb(' + n.join(',') + ') 100%)';

        if (this.alpha == 1) {
            this.value = hex;
        } else {
            this.value = 'rgba(' + n.join(',') + ',' + this.alpha + ' )';
        }

        if (this.gradientActive) {
            this.gradientControl.style.background = this.value;

            let grColors = [];

            for (var item of document.querySelectorAll('.clpi-o')) {
                let bg = item.style.background;
                bg = bg ? bg : '#000';

                // firefox fix
                bg = bg.replace(' none repeat scroll 0% 0%', '');

                grColors.push(bg);
            }

            this.gradientColor.style.background = 'linear-gradient(to right, ' + grColors[0] + ' 0%, ' + grColors[1] + ' 100%)';

            let angle = this.gradientAngle ? this.gradientAngle + 'deg' : 'to bottom';

            this.value = 'linear-gradient(' + angle + ', ' + grColors[0] + ' 0%, ' + grColors[1] + ' 100%)';

        }

        this.thumb.style.background = this.value;

        this.input.value = this.value;
      
        let that = this;
      
        window.dispatchEvent(new CustomEvent('colorPickerTick', {
            detail: {
                el: that.input,
            }
        }));
    },

    triggerChange: function() {
        let that = this;

        window.dispatchEvent(new CustomEvent('colorPickerChange', {
            detail: {
                el: that.input,
            }
        }));
    },

    update: function (rgb) {
        let hsl = this.rgbHsl(rgb[0], rgb[1], rgb[2]);

        this.hslInput.value = hsl[0];

        this.setHslRange(hsl[0]);

        if (rgb.length > 3) {
            this.alphaInput.value = rgb[3];
            this.alpha = rgb[3];
            this.setAlphaRange(rgb[3]);
        } else {
            this.alphaInput.value = 1;
            this.alpha = 1;
            this.setAlphaRange(1);
        }

        this.h = hsl[0];
        this.s = hsl[1];
        this.l = hsl[2];

        hsl[2] = hsl[2] * 200 - 200;
        hsl[2] = hsl[2] < 0 ? hsl[2] * -1 : hsl[2];

        this.pointer.style.top = hsl[2] + 'px';
        this.pointer.style.left = hsl[1] * 200 + 'px';

        this.change();
    },

    close: function () {
        for (var item of document.querySelectorAll('.clpi-o')) {
            item.classList.remove(this.cssClassControlActive);
        }

        this.mask.classList.remove('clpi-m-show');
        this.picker.classList.remove('clpi-l-active');
        this.picker.classList.remove('clpi-l-support');

        this.reset();
    },

    reset: function () {
        this.h = 0;
        this.s = 0;
        this.l = 0;
        this.alpha = 1;
        this.value = '';

        this.gradientActive = false;
        this.gradientAngle = 0;

        this.pointer.removeAttribute('style');
        this.alphaRangeControl.removeAttribute('style');
        this.hslRangeControl.removeAttribute('style');
        this.currentColor.value = '';
        this.gradientAngleInut.value = '';
        this.hslInput.value = 1;
        this.alphaInput.value = 1;
    },

    setHsl: function (v) {
        this.h = v;
        this.setHslRange(v);
        this.change();
    },

    setHslRange: function (v) {
        this.hslRangeControl.style.left = v * 100 + '%';
    },

    setAlpha: function (v) {
        this.alpha = v;
        this.setAlphaRange(v);
        this.change();
    },

    setAlphaRange: function (v) {
        this.alphaRangeControl.style.left = v * 100 + '%';
    },

    setCurrent: function (hex) {
        if (hex.length < 6) return;

        let rgb = this.hexRgb(hex);

        if (!rgb) return;

        this.update(rgb);

        this.triggerChange();
    },

    setGradientControl: function (e) {
        this.gradientControl = e;

        for (var item of document.querySelectorAll('.clpi-o')) {
            item.classList.remove(this.cssClassControlActive);
        }

        this.gradientControl.classList.add(this.cssClassControlActive);


        let bg = this.gradientControl.style.background;

        if (bg) {
            // firefox fix
            bg = bg.replace(' none repeat scroll 0% 0%', '');
            let rgb = bg.replace(/[^\d,]/g, '').split(',').map(function (v) {
                return parseFloat(v)
            });

            if (typeof rgb[3] !== 'undefined') {
                rgb[3] = rgb[3] / 100;
            }

            this.update(rgb);
        }
    },

    setGradientAngle: function (v) {
        this.gradientAngle = v;
        this.change();
        this.triggerChange();
    },

    gradientShowToggle: function () {
        for (var item of document.querySelectorAll('.clpi-o')) {
            item.classList.remove(this.cssClassControlActive);
        }

        this.picker.classList.toggle('clpi-l-active');
        this.gradientActive = !this.gradientActive;

        if (this.gradientActive) {
            this.gradientControl = document.querySelector('.clpi-o');
            this.gradientControl.classList.add(this.cssClassControlActive);
        }

        this.change();
        this.triggerChange();
    },

    startDrag: function (e) {
        this.pointerMove = true;
        this.areaPosition = this.area.getBoundingClientRect();
        this.drag(e);
    },

    drag: function (e) {
        if (this.pointerMove) {
            let y = e.clientY - this.areaPosition.top,
                x = e.clientX - this.areaPosition.left;

            y = y < 0 ? 0 : y;
            y = y > 200 ? 200 : y;

            x = x < 0 ? 0 : x;
            x = x > 200 ? 200 : x;

            this.pointer.style.top = y + 'px';
            this.pointer.style.left = x + 'px';

            x = x / 200;
            y = y / 200 - 1;

            x = -x > 0 ? -x : x;
            y = -y > 0 ? -y : y;

            this.s = parseFloat(x.toFixed(2));
            this.l = parseFloat(y.toFixed(2));

            this.change();
        }
    },

    stopDrag: function (e) {
        if (this.pointerMove === true) {
            this.triggerChange();
        }
        this.pointerMove = false;
    },

    hslRgb: function (h, s, v) {
        var r, g, b, i, f, p, q, t;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }

        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    },

    rgbHsl: function (red, green, blue) {
        var rr, gg, bb,
            r = arguments[0] / 255,
            g = arguments[1] / 255,
            b = arguments[2] / 255,
            h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function (c) {
                return (v - c) / 6 / diff + 1 / 2;
            };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            } else if (g === v) {
                h = (1 / 3) + rr - bb;
            } else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }

        return [parseFloat(h.toFixed(3)), parseFloat(s.toFixed(3)), parseFloat(v.toFixed(3))]
    },

    rgbHex: function (rgb) {
        var hex = [rgb[0].toString(16), rgb[1].toString(16), rgb[2].toString(16)];

        hex.forEach(function (v, k) {
            if (v.length === 1) {
                hex[k] = '0' + v;
            }
        });

        return '#' + hex.join('');
    },

    hexRgb: function (hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    },


    wrap: function (item) {
        let wrapper = document.createElement('div'),
            thumb = document.createElement('div'),
            value = item.value;
        wrapper.className = 'clpi-wrapper';
        thumb.className = 'clpi-thumb';

        if (value.length) {
            thumb.style.background = value;
        }

        item.parentNode.appendChild(wrapper);

        wrapper.appendChild(item);

        return wrapper.appendChild(thumb);
    },

    initAll: function () {
        for (var item of document.querySelectorAll('.clpi:not(.clpi-initialized)')) {
            item.classList.add('clpi-initialized');

            this.wrap(item);
        }
    },

    setup: function () {
        let that = this;

        this.hslInput.addEventListener('input', function (e) {
            that.setHsl(e.target.value);
        });

        this.hslInput.addEventListener('change', function (e) {
            that.triggerChange();
        });

        this.alphaRange.addEventListener('input', function (e) {
            that.setAlpha(e.target.value);
        });

        this.alphaRange.addEventListener('change', function (e) {
            that.triggerChange();
        });

        this.currentColor.addEventListener('input', function (e) {
            that.setCurrent(e.target.value);
        });

        this.gradientAngleInut.addEventListener('input', function (e) {
            that.setGradientAngle(e.target.value);
        });

        this.area.addEventListener('mousedown', function (e) {
            that.startDrag(e);
        });

        this.mask.addEventListener('mousedown', function (e) {
            if (e.target.matches('#clpi-m')) {
                that.close();
            }
        });

        document.addEventListener('mousemove', function (e) {
            that.drag(e);
        });

        document.addEventListener('mouseup', function (e) {
            that.stopDrag(e);
        });

        document.addEventListener('click', function (e) {
            if (e.target.matches('.clpi') || e.target.matches('.clpi-thumb')) {
                colorPicker.init(e.target);
            }

            if (e.target.matches('.clpi-o')) {
                colorPicker.setGradientControl(e.target);
            }

            if (e.target.matches('.clpi-u')) {
                colorPicker.gradientShowToggle();
            }
        });

        this.initAll();
    },

};

colorPicker.setup();