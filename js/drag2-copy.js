'use strict'

function MyDrag(targetBox, line, dragList, showState1, showState2, mask) {
    this.targetBoxobj = targetBox; //目标对象
    this.dragList = dragList; //拖拽对象
    this.showState1 = showState1; //当拖拽区域列表为空的时候显示的状态栏
    this.showState2 = showState2; //
    this.line = line; //获取生成格子线的目标元素
    this.column = 24; //X轴要分多少个格子
    this.row = 12; //Y轴要分多少个格子
    this.mask = mask; //拖拽到目标元素时的阴影盒子
    this.dropTargetLeft = 0;
    this.dropTargetTop = 0;
    this.eleDrag = null;
    this.dropTarget = null;
}
MyDrag.prototype = {
    init: function() {
        this.lines();
        this.drag();
        this.showState();
    },
    //    生成拖拽目标区域的线
    lines: function() {
        var column = this.column;
        var calcX = 100 / column;
        var row = this.row;
        var calcY = 100 / row;
        var i;
        // X轴方向上的线
        for (i = 0; i < column; i++) {
            var columnLine = document.createElement('div');
            columnLine.className = "column-line";
            columnLine.style.left = "calc(" + i * calcX + "%)";
            var innerLine = document.createElement('div');
            innerLine.className = "column-line-inner";
            columnLine.appendChild(innerLine);
            this.line.appendChild(columnLine);
        }
        // Y轴方向上的线
        for (i = 0; i < row; i++) {
            var rowLine = document.createElement('div');
            rowLine.className = "row-line";
            rowLine.style.top = "calc(" + i * calcY + "%)";
            var innerLine = document.createElement('div');
            innerLine.className = "row-line-inner";
            rowLine.appendChild(innerLine);
            this.line.appendChild(rowLine);
        }
    },
    showState: function() {
        var contentItem = document.querySelectorAll('.content-menu');
        if (contentItem.length == 0) {
            this.showState1.style.display = 'block';
            this.showState2.style.display = 'none';
        } else {
            this.showState1.style.display = 'none';
            this.showState2.style.display = 'block';
        }
    },
    drag: function() {
        var i, len = dragList.length;
        var that = this;
        for (i = 0; i < len; i++) {
            this.dragList[i].onselectstart = function() {
                return false;
            };

            this.dragList[i].addEventListener('dragstart', this.dragstart);

            this.dragList[i].ondragend = function(ev) {
                // console.log(that.dropTarget)
                ev.dataTransfer.clearData("sourceId");

                that.showState2.style.display = "none";
                // that.showState1.style.display = "block";
                that.mask.classList.remove('active');
                // that.dropShowState()
                that.eleDrag = null;
                // return false
            };
        }
        this.targetBoxobj.addEventListener('dragenter', function() {
            that.dropTarget = this;
            var contentItem = document.querySelectorAll('.content-menu');
            // console.log(contentItem)
            if (contentItem && contentItem.length != 0) {
                that.showState2.style.display = "none";
                that.showState1.style.display = "none";
                // return
            } else {
                that.showState2.style.display = "block";
                that.showState1.style.display = "none";
            }
            return true
        }, true);

        this.showState2.addEventListener('dragover', function(e) {
            e.preventDefault();
            that.dragover(that);
            return true
        });
        this.showState2.addEventListener('drop', function(e) {
            that.drop(that, e);
        })

    },
    dragstart: function(that) {
        var e = window.event || event;
        var sourceId = this.dataset['sourceId'];

        that.eleDrag = e.target;
        e.dataTransfer.setData('source', sourceId);
    },
    dragover: function(that) {
        var e = event || window.event;
        var maskLeft = 0;
        var maskTop = 0;
        var maskWidth = 0;
        var maskHeight = 0;
        var targetLeft = 0;
        var targetTop = 0;
        var targetHeight = 0;
        var targetWidth = 0;
        var width = 0;
        var height = 0;
        var x = 0;
        var y = 0;

        target = e.target;
        // this.dropTarget = target;

        x = e.offsetX;
        y = e.offsetY;

        targetLeft = parseInt(target.style.left);
        targetTop = parseInt(target.style.top);
        targetWidth = parseInt(target.offsetWidth);
        targetHeight = parseInt(target.offsetHeight);
        width = parseInt(target.offsetWidth / 3);
        height = parseInt(target.offsetHeight / 3);

        if (x > 0 && x < width && y > 0 && y < height) { //左上 在左邊生成div
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft + targetWidth / 2;
            that.dropTargetTop = targetTop;

        } else if (x > 0 && x < width && y < height * 2 && y > height) { //左中 在左邊生成div
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft + targetWidth / 2;
            that.dropTargetTop = targetTop;

        } else if (x > 0 && x < width && y < height * 3 && y > height * 2) { //左下 在左邊生成div
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft + targetWidth / 2;
            that.dropTargetTop = targetTop;

        } else if (x > width && x < width * 2 && y > 0 && y < height) { //上中 div在上邊
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth;
            maskHeight = targetHeight / 2;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop + targetHeight / 2;

        } else if (x > width && x < width * 2 && y > height * 2 && y < height * 3) { //下中 div在下邊
            maskLeft = targetLeft;
            maskTop = targetTop + targetHeight / 2;
            maskWidth = targetWidth;
            maskHeight = targetHeight / 2;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;

        } else if (x > width * 2 && x < width * 3 && y > 0 && y < height) { //右上 div在右邊
            maskLeft = targetLeft + targetWidth / 2;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;

        } else if (x > width * 2 && x < width * 3 && y > height && y < height * 2) { //右中 div在右邊
            maskLeft = targetLeft + targetWidth / 2;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;

        } else if (x > width * 2 && x < width * 3 && y > height * 2 && y < height * 3) { //右下 div在右邊
            maskLeft = targetLeft + targetWidth / 2;
            maskTop = targetTop;
            maskWidth = targetWidth / 2;
            maskHeight = targetHeight;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;
        } else if (x > width && x < width * 2 && y > height && y < height * 2) { //中間 div跟target一樣大小
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth;
            maskHeight = targetHeight;

            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;

        }

        that.mask.classList.add('active');
        that.mask.style.left = maskLeft + 'px';
        that.mask.style.top = maskTop + 'px';
        that.mask.style.width = maskWidth + 'px';
        that.mask.style.height = maskHeight + 'px';
    },
    drop: function(that, e) {

        var target = that.dropTarget;
        console.log(target)
        var html = '',
            header = '',
            listContent = '';

        html = document.createElement('div');
        header = document.createElement('div');
        listContent = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = "单击添加标题";
        listContent.classList.add('list-content');
        listContent.innerHTML = "内容区域";
        html.appendChild(header);
        html.appendChild(listContent);

        // html.style.left = parseInt(target.style.left)/2 +"%";
        // html.style.top = parseInt(target.style.top)/2 + "%";
        // html.style.width = parseInt(target.style.width)/2 +'%';
        // html.style.height = parseInt(target.style.height)/2+'%';

        html.style.left = that.mask.style.left;
        html.style.top = that.mask.style.top;
        html.style.width = that.mask.style.width;
        html.style.height = that.mask.style.height;

        html.classList.add('content-menu');
        html.addEventListener('dragenter', function(e) {
            that.dropTarget = this;
            this.classList.add('dotted');
        }, false);

        html.addEventListener('dragover', function(e) {
            e.preventDefault();
            that.dragover(that);
            return true
        }, false);

        html.addEventListener('dragleave', function(e) {
            this.classList.remove('dotted')
            return true
        }, false);

        html.addEventListener('drop', function(e) {
            that.drop(that, e);
            return true
        }, false);

        that.dropTarget.classList.remove('dotted');
        that.targetBoxobj.appendChild(html);
        // that.dropShowState();
        // that.mask.style.display = "none";
    }






}











var targetbox = document.querySelector('.right-content');
var dragList = document.querySelectorAll('.item a');
var lines = document.querySelector('.lines')
var showState1 = document.querySelector('.showState1');
var showState2 = document.querySelector('.showState2');
var mask = document.querySelector('.mask');
// console.log(showState2)
var mydrag = new MyDrag(targetbox, lines, dragList, showState1, showState2, mask);
mydrag.init();



// 获取样式
var getcss = function(ele, key) {
    return ele.currentStyle ? ele.currentStyle[key] : document.defaultView.getComputedStyle(ele, false)[key];
}
// 选择器
var $ = function(selector) {
    if (!selector) { return []; }
    var arrEle = [];
    if (document.querySelectorAll) {
        arrEle = document.querySelectorAll(selector);
    } else {
        var oAll = document.getElementsByTagName("div"),
            lAll = oAll.length;
        if (lAll) {
            var i = 0;
            for (i; i < lAll; i += 1) {
                if (/^\./.test(selector)) {
                    if (oAll[i].className === selector.replace(".", "")) {
                        arrEle.push(oAll[i]);
                    }
                } else if (/^#/.test(selector)) {
                    if (oAll[i].id === selector.replace("#", "")) {
                        arrEle.push(oAll[i]);
                    }
                }
            }
        }
    }
    return arrEle;
};
