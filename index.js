/*
* 水印相关canvas基本实现
* 2020.10.17
* */

(function () {
    function canvasWM({
            container = document.body,
            width = '200px',
            height = '150px',
            textAlign = 'center',
            textBaseline = 'middle',
            font = '20px microsoft yahei',
            fillStyle = 'rgba(184, 184, 184, 0.8)',
            content = '请勿外传',
            rotate = '30',
            zIndex = 1000
        } = {}) {
        const canvas = document.createElement('canvas');

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        const ctx = canvas.getContext('2d');

        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.translate(parseFloat(width)/2, parseFloat(height)/2);
        ctx.rotate(Math.PI / 180 * rotate);
        ctx.translate(-parseFloat(width)/2, -parseFloat(height)/2);
        ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

        const base64Url = canvas.toDataURL();
        const watermarkDiv = document.createElement("div");
        watermarkDiv.setAttribute('style', `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: ${zIndex};
            pointer-events: none;
            background-repeat: repeat;
            background-image: url('${base64Url}')`);

        container.style.position = 'relative';
        container.insertBefore(watermarkDiv, container.firstChild);
    }
    window.canvasWM = canvasWM;
})();

// 调用
canvasWM({
    content: 'WaterMater Test'
});
