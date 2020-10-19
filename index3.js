/*
* 水印相关SVG基本实现+水印保护
* 2020.10.17
* */
(function () {
        function svgWM({
             container = document.body,
             content = '请勿外传',
             width = '200px',
             height = '150px',
             opacity = '0.2',
             fontSize = '20px',
             zIndex = 1000
            } = {}) {
            const args = arguments[0];
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">
                <text x="50%" y="50%" dy="12px"
                    text-anchor="middle"
                    stroke="#000000"
                    stroke-width="1"
                    stroke-opacity="${opacity}"
                    fill="none"
                    transform="rotate(-45, 120 120)"
                    style="font-size: ${fontSize};">
                    ${content}
                </text>
            </svg>`;
            const base64Url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
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

svgWM({
    content: 'WaterMark test'
});