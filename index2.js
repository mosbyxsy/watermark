/*
* 水印相关canvas基本实现+水印保护
* 2020.10.17
* */
(function () {
    function canvasWM({
            container = document.body,
            width = '200px',
            height = '150px',
            textAlign = 'center',
            textBaseline = 'middle',
            font = "20px Microsoft Yahei",
            fillStyle = 'rgba(184, 184, 184, 0.6)',
            content = '请勿外传',
            rotate = '30',
            zIndex = 1000
        } = {}) {
        const args = arguments[0];
        const canvas = document.createElement('canvas');

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        const ctx = canvas.getContext("2d");

        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.translate(parseFloat(width)/2, parseFloat(height)/2);
        ctx.rotate(Math.PI / 180 * rotate);
        ctx.translate(-parseFloat(width)/2, -parseFloat(height)/2);
        ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

        const base64Url = canvas.toDataURL();
        const wm = document.querySelector('.wm');

        const watermarkDiv = wm || document.createElement("div");
        const styleStr = `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`;

        watermarkDiv.setAttribute('style', styleStr);
        watermarkDiv.classList.add('wm');

        if (!wm) {
            container.style.position = 'relative';
            container.insertBefore(watermarkDiv, container.firstChild);
        }
        // 防止被修改
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            let mo = new MutationObserver(function () {
                const wm = document.querySelector('.wm');
                if ((wm && wm.getAttribute('style') !== styleStr) || !wm) {
                    // 避免一直触发
                    mo.disconnect();
                    mo = null;
                    canvasWM(JSON.parse(JSON.stringify(args)));
                }
            });

            mo.observe(container, {
                attributes: true,
                childList: true,
            });
            mo.observe(watermarkDiv, {
                attributes: true,
                childList: true,
                characterData: true
            })
        }
    }

    if (typeof module != 'undefined' && module.exports) {  //CMD
        module.exports = canvasWM;
    } else if (typeof define == 'function' && define.amd) { // AMD
        define(function () {
            return canvasWM;
        });
    } else {
        window.canvasWM = canvasWM;
    }
})();

// 调用
canvasWM({
    content: 'WaterMark test'
});