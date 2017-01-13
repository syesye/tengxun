//图片延迟加载：  图片距离body顶部距离+图片的高度<屏幕的高度+卷去的高度
var aImgs=document.getElementsByTagName('img');
var oSearch=document.getElementById('search');
var oBtn=document.getElementById('toTop');//totop安钮
var oneClient=utils.win('clientHeight');//一屏幕的高度

//图片延迟加载
function showImg() {
    for (var i=0;i<aImgs.length;i++){
        var imgPos=utils.offset(aImgs[i]).top;
        var scrollBottom=utils.win('scrollTop')+utils.win('clientHeight');
        if(imgPos<scrollBottom){
            lazyImg(aImgs[i]);
        }
    }
};
function lazyImg(img) {
    if(img.loaded) return;
    var tmpImg=new Image;
    tmpImg.src=img.getAttribute('realImg');
    tmpImg.onload=function () {
        img.src=this.src;
        tmpImg=null;
        img.loaded=true;
    }
};

//搜索栏超过一屏幕的时候显示
function chuXian() {
    //浏览器卷去的高度
    var scrollPos=utils.win('scrollTop');
    if(scrollPos>oneClient){
        oSearch.style.display='block';
        oSearch.style.position='fixed';
        oSearch.style.zIndex='3';
    }else {
        oSearch.style.display='none';
    }
}


//点击回到顶部
function toTop() {
    var curTop=utils.win('scrollTop'),
        duration=500,
        interval=30,
        step=curTop/duration*interval;
    var timer=setInterval(function () {
        curTop=utils.win('scrollTop');
        if(curTop<=step){
            utils.win('scrollTop',0);
            clearInterval(timer);
            return;
        }
        curTop-=step;
        utils.win('scrollTop',curTop);
    },interval)
}

//轮播图部分
(function () {
    var banner=document.getElementById('banner');
    var aImgs=banner.getElementsByTagName('img');
    var oUl=banner.getElementsByTagName('ul')[0];
    var aLis=oUl.getElementsByTagName('li');
    var timer=null;
    var n=-1;

    //轮播
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove() {
        n++;
        if(n>aImgs.length-1){
            n=0;
        }
        setBanner();

    };
    function setBanner() {
        for (var i=0;i<aImgs.length;i++){
            if(i==n){
                utils.css(aImgs[i],'zIndex',1);
                animate(aImgs[i],{opacity:1},{
                    duration:600,
                    callback:function () {
                        var siblings=utils.siblings(this);
                        for (var j=0;j<siblings.length;j++){
                            utils.css(siblings[j],{opacity:0});
                        }
                    }
                })
            }else {
                utils.css(aImgs[i],'zIndex',0);
            }
        }
        bannerTip();
    }
    //焦点自动轮播
    function bannerTip() {
        for (var i=0;i<aLis.length;i++){
            i==n?aLis[i].className='show':aLis[i].className='';
        }
    };
    //鼠标移入停止
    banner.onmouseover=function () {
        clearInterval(timer);
    };
    //鼠标移出继续
    banner.onmouseout=function () {
        timer=setInterval(autoMove,2000)
    }

    //鼠标经过li时候显示当前图片
    mouseMove();
    function mouseMove() {
        for(var i=0;i<aLis.length;i++){
            (function (index) {
                aLis[index].onmouseover=function () {
                    n=index;
                    setBanner();
                }
            })(i)
        }
    }
})()








//函数执行
showImg();
oBtn.onclick=toTop;
window.onscroll=function () {
    var scrollPos=utils.win('scrollTop');
    showImg();
    chuXian();
    if(scrollPos>oneClient){
        oBtn.style.display='block';
    }else {
        oBtn.style.display='none';
    }
}
