
//以视窗320px作为基准js动态计算根字号

;(function(psdWidth,dividendFontSize,maxRootFontSize){
    // 为了代码更短
    var d = document;
    var de = d.documentElement;
    var w = window;
    var on = 'addEventListener';
    var gbcr = 'getBoundingClientRect';  
    var ps = 'pageshow';
    var head = d.head || d.getElementsByTagName('HEAD')[0];
    var style = d.createElement('STYLE'); 
    var resizeEventThrottleTimer;
    // 移除任何text-size-adjust对字体大小的改变效果
    var textSizeAdjustCSS = 'text-size-adjust:100%;';
    var textSizeAdjustCSSAll =
        '-webkit-'+textSizeAdjustCSS
        +'-moz-'+textSizeAdjustCSS
        +'-ms-'+textSizeAdjustCSS
        +'-o-'+textSizeAdjustCSS
        +textSizeAdjustCSS;
     
    var hasGbcr = gbcr in de;
    var lastRootFontSize = null; // 上一次设置的html的font-size
    function setRem(){
        var rootFontSize = Math.min(
            (
                hasGbcr?
                    de[gbcr]().width 
                    :w.innerWidth
            )
                /(psdWidth/dividendFontSize)
            ,maxRootFontSize
        );

        if(rootFontSize != lastRootFontSize){
            style.innerHTML =
                'html{'
                +   'font-size:'+rootFontSize+'px!important;' 
                +   textSizeAdjustCSSAll
                +'}';
            lastRootFontSize = rootFontSize;
        }
    }

    function trySetRem(){
        clearTimeout(resizeEventThrottleTimer);
        resizeEventThrottleTimer = setTimeout(setRem,500);
    }
    psdWidth = psdWidth || 320;
    dividendFontSize = dividendFontSize || 16;
    maxRootFontSize = maxRootFontSize || 32;
    head.appendChild(style);
     
    d[on]('DOMContentLoaded',setRem,false);

    if('on'+ps in w){
        w[on](ps,function(e){
            if(e.persisted){
                trySetRem()
            }
        },false);
    }else{
        w[on]('load',trySetRem,false);
    }
    w[on]('resize',trySetRem,false);
    setRem();
})(
    320, // 设置设计稿基准宽度
    20, // 设置开发时的被除数
    46.875 // 设置最大根元素font-size
)