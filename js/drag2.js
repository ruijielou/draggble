'use strict'

function MyDrag(targetBox, line, dragList, showState1, showState2, mask) {
    this.targetBoxobj = targetBox; //目标对象
    this.dragList = dragList; //拖拽对象
    this.showState1 = showState1; //当拖拽区域列表为空的时候显示的状态栏
    this.showState2 = showState2; //
    this.line = line; //获取生成格子线的目标元素
    this.column = 24; //X轴要分多少个格子
    this.row = 12; //Y轴要分多少个格子
    this.calcXWidth = 0;
    this.calcYHeight = 0;
    this.mask = mask; //拖拽到目标元素时的阴影盒子
    this.dropTargetLeft = 0;
    this.dropTargetTop = 0;
    this.dropTargetWidth = 0;
    this.dropTargetHeight = 0;
    this.eleDrag = null;
    this.dropTarget = null;
    this.dragDir = '';
    this.parentTop = 0;
    this.parentLeft = 0;
    this.parentHeight = 0;
    this.parentWidth = 0;
    this.creatMask = '';
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
        this.calcXWidth = calcX;
        this.calcYHeight = calcY;
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
                that.creatMask.classList.remove('active');
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
            that.dragover(that, this, e);
            return true
        });
        this.showState2.addEventListener('drop', function(e) {

            that.drop(that, e);

        });
        this.showState2.addEventListener('dragenter', function(e) {
            // alert('dddddd')
            that.dragenter(this);

        });
        this.showState2.addEventListener('dragleave', function(e) {
            var mask = document.querySelectorAll('.mask');
            console.log(mask);

            for (var i = 0; i < mask.length; i++) {
                mask[i].parentNode.removeChild(mask[i]);
            }

        });

    },

    dragstart: function(that) {
        var e = window.event || event;
        var sourceText = this.dataset['sourceText'];

        that.eleDrag = this;
        e.dataTransfer.setData('source', sourceText);
    },

    dragover: function(that, obj, e) {
        var mask = document.querySelectorAll('.mask');
        if (mask.length == 0) {
            this.dragenter(obj);
        }
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

        target = obj;

        x = e.offsetX;
        y = e.offsetY;

        var partten = /\((.*?)\%/;

        targetLeft = parseInt(partten.exec(target.style.left)[1]);
        targetTop = parseInt(partten.exec(target.style.top)[1]);
        targetWidth = parseInt(partten.exec(target.style.width)[1]);
        targetHeight = parseInt(partten.exec(target.style.height)[1]);

        width = parseInt(target.offsetWidth / 3);
        height = parseInt(target.offsetHeight / 3);
        //TODO???判断等于三个情况时需要分成左右两个不同宽度的大小的div，或者上下不同高度的两个，分为1+2
        if (x > 0 && x < width && y > 0 && y < height) { //左上 在左邊生成div
            // console.log('左上=================')
            that.dragDir = 'left';
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {

                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = that.calcXWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth * 2;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft + that.calcXWidth;
                that.dropTargetTop = targetTop;

            } else if (targetWidth <= that.calcXWidth) {

                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;

            } else {

                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft + targetWidth / 2;
                that.dropTargetTop = targetTop;

            }
        } else if (x > 0 && x < width && y < height * 2 && y > height) { //左中 在左邊生成div
            that.dragDir = 'left';
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = that.calcXWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth * 2;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft + that.calcXWidth;
                that.dropTargetTop = targetTop;
            } else if (targetWidth <= that.calcXWidth) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft + targetWidth / 2;
                that.dropTargetTop = targetTop;
            }
        } else if (x > 0 && x < width && y < height * 3 && y > height * 2) { //左下 在左邊生成div
            that.dragDir = 'left';
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = that.calcXWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth * 2;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft + that.calcXWidth;
                that.dropTargetTop = targetTop;
            } else if (targetWidth <= that.calcXWidth) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft + targetWidth / 2;
                that.dropTargetTop = targetTop;
            }
        } else if (x > width && x < width * 2 && y > 0 && y < height) { //上中 div在上邊
            that.dragDir = 'top';
            // console.log('上中=================')
            if (targetHeight <= that.calcYHeight * 3 && targetHeight > that.calcYHeight * 2) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = that.calcYHeight;
                that.dropTargetWidth = targetWidth;
                that.dropTargetHeight = that.calcYHeight * 2;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop + that.calcYHeight;
            } else if (targetHeight <= that.calcYHeight) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight / 2;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop + targetHeight / 2;
            }
        } else if (x > width && x < width * 2 && y > height * 2 && y < height * 3) { //下中 div在下邊
            that.dragDir = 'bottom';
            // console.log('下中=================')
            if (targetHeight <= that.calcYHeight * 3 && targetHeight > that.calcYHeight * 2) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = that.calcYHeight * 2;
                that.dropTargetWidth = targetWidth;
                that.dropTargetHeight = that.calcYHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop + that.calcYHeight;
            } else if (targetHeight <= that.calcYHeight) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft;
                maskTop = targetTop + targetHeight / 2;
                maskWidth = targetWidth;
                maskHeight = targetHeight / 2;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            }
        } else if (x > width * 2 && x < width * 3 && y > 0 && y < height) { //右上 div在右邊
            that.dragDir = 'right';
            // console.log('右上=================');
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {
                maskLeft = targetLeft + that.calcXWidth;
                maskTop = targetTop;
                maskWidth = that.calcXWidth * 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else if (targetWidth <= that.calcXWidth) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft + targetWidth / 2;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            }
        } else if (x > width * 2 && x < width * 3 && y > height && y < height * 2) { //右中 div在右邊
            that.dragDir = 'right';
            // console.log('右中=================')
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {
                maskLeft = targetLeft + that.calcXWidth;
                maskTop = targetTop;
                maskWidth = that.calcXWidth * 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else if (targetWidth <= that.calcXWidth) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft + targetWidth / 2;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            }
        } else if (x > width * 2 && x < width * 3 && y > height * 2 && y < height * 3) { //右下 div在右邊
            that.dragDir = 'right';
            // console.log('右下=================')
            if (targetWidth <= that.calcXWidth * 3 && targetWidth > that.calcXWidth * 2) {
                maskLeft = targetLeft + that.calcXWidth;
                maskTop = targetTop;
                maskWidth = that.calcXWidth * 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = that.calcXWidth;
                that.dropTargetHeight = targetHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else if (targetWidth <= that.calcXWidth) {
                maskLeft = targetLeft;
                maskTop = targetTop;
                maskWidth = targetWidth;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            } else {
                maskLeft = targetLeft + targetWidth / 2;
                maskTop = targetTop;
                maskWidth = targetWidth / 2;
                maskHeight = targetHeight;
                that.dropTargetWidth = maskWidth;
                that.dropTargetHeight = maskHeight;
                that.dropTargetLeft = targetLeft;
                that.dropTargetTop = targetTop;
            }
        } else if (x > width && x < width * 2 && y > height && y < height * 2) { //中間 div跟target一樣大小

            that.dragDir = 'middle';
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth;
            maskHeight = targetHeight;
            that.dropTargetWidth = maskWidth;
            that.dropTargetHeight = maskHeight;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;
        }

        that.creatMask.classList.add('active');
        that.creatMask.style.left = maskLeft + '%';
        that.creatMask.style.top = maskTop + '%';
        that.creatMask.style.width = maskWidth + '%';
        that.creatMask.style.height = maskHeight + '%';
    },
    // 拖拽经过目标元素时的事件
    dragenter: function(obj) {
        // 1、添加mask遮罩层，并且添加到当前目标元素的父元素中
        // var creatMask = this.creatMask
        this.creatMask = document.createElement('div');
        this.creatMask.classList.add('mask');
        this.creatMask.classList.add('active');
        // 2、获取目标元素的父元素
        var targetParent = obj.parentNode;
        targetParent.appendChild(this.creatMask);
    },

    drop: function(that, e) {

        var content = document.querySelectorAll('.content-menu');

        var parentNodes = '',
            html = '',
            placeHtml = '',
            str = e.dataTransfer.getData('source');
        if (str != "") {
            html = this.creatHtml(str);
        } else {
            html = this.creatHtml();
        }
        // 如果当前是空白的第一次拖过来的内容
        // 需要生成一个最父级，和右边空白区域的容器
        if (content.length == 0 && that.dragDir !== 'middle') {
            // 创建一个父级容器
            parentNodes = document.createElement('div');
            parentNodes.classList.add('parentList');
            parentNodes.style.width = 'calc(100%)';
            parentNodes.style.height = 'calc(100%)';
            // 创建图形

            html.style.left = 'calc(' + that.creatMask.style.left + ' + 2px)';
            html.style.top = 'calc(' + that.creatMask.style.top + ' + 2px)';
            html.style.width = 'calc(' + that.creatMask.style.width + ' - 2px)';
            html.style.height = 'calc(' + that.creatMask.style.height + ' - 2px)';
            this.addEvent(html);

            // 创建空白区域的占位控件
            placeHtml = this.creatHtml('空白区域');

            placeHtml.style.top = "calc(" + that.dropTargetTop + '% + 2px)';
            placeHtml.style.left = "calc(" + that.dropTargetLeft + '% + 2px)';
            placeHtml.style.width = 'calc(' + that.dropTargetWidth + '% - 2px)';
            placeHtml.style.height = 'calc(' + that.dropTargetHeight + '% - 2px)';

            parentNodes.appendChild(html);
            parentNodes.appendChild(placeHtml);
            this.targetBoxobj.appendChild(parentNodes);
            this.addEvent(placeHtml);

        } else if (content.length == 0 && that.dragDir == 'middle') {

            html.style.left = 'calc(' + that.creatMask.style.left + ' + 2px)';
            html.style.top = 'calc(' + that.creatMask.style.top + ' + 2px)';
            html.style.width = 'calc(' + that.creatMask.style.width + ' - 2px)';
            html.style.height = 'calc(' + that.creatMask.style.height + ' - 2px)';
            this.addEvent(html);
            this.targetBoxobj.appendChild(html);

        } else {

            parentNodes = document.createElement('div');
            parentNodes.classList.add('parentList');

            var target = that.dropTarget;
            that.parentTop = target.style.top;
            that.parentLeft = target.style.left;
            that.parentHeight = target.style.height;
            that.parentWidth = target.style.width;

            // console.log(target);
            if (that.dragDir == 'left') {

                html.style.left = 'calc(0% + 2px)';
                html.style.top = 'calc(0% + 2px)';
                html.style.width = 'calc(50% - 2px)';
                html.style.height = 'calc(100% - 2px)';

                target.style.top = 'calc(0% + 2px)';
                target.style.left = 'calc(50% + 2px)';
                target.style.width = 'calc(50% - 2px)';
                target.style.height = 'calc(100% - 2px)';

            } else if (that.dragDir == 'right') {

                html.style.left = 'calc(50% + 2px)';
                html.style.top = 'calc(0% + 2px)';
                html.style.width = 'calc(50% - 2px)';
                html.style.height = 'calc(100% - 2px)';

                target.style.top = 'calc(0% + 2px)';
                target.style.left = 'calc(0% + 2px)';
                target.style.width = 'calc(50% - 2px)';
                target.style.height = 'calc(100% - 2px)';

            } else if (that.dragDir == 'top') {

                html.style.left = 'calc(0% + 2px)';
                html.style.top = 'calc(0% + 2px)';
                html.style.width = 'calc(100% - 2px)';
                html.style.height = 'calc(50% - 2px)';

                target.style.top = 'calc(50% + 2px)';
                target.style.left = 'calc(0% + 2px)';
                target.style.width = 'calc(100% - 2px)';
                target.style.height = 'calc(50% - 2px)';

            } else if (that.dragDir == 'bottom') {

                html.style.left = 'calc(0% + 2px)';
                html.style.top = 'calc(50% + 2px)';
                html.style.width = 'calc(100% - 2px)';
                html.style.height = 'calc(50% - 2px)';

                target.style.top = 'calc(0% + 2px)';
                target.style.left = 'calc(0% + 2px)';
                target.style.width = 'calc(100% - 2px)';
                target.style.height = 'calc(50% - 2px)';
            } else if (that.dragDir == 'middle') {
                html.style.left = target.style.left;
                html.style.top = target.style.top;
                html.style.width = target.style.width;
                html.style.height = target.style.height;

            }

            this.addEvent(html);

            if (that.dragDir !== 'middle') {
                parentNodes.appendChild(html);
                parentNodes.style.top = that.parentTop;
                parentNodes.style.left = that.parentLeft;
                parentNodes.style.height = that.parentHeight;
                parentNodes.style.width = that.parentWidth;
                var otherTarget = target;
                var targetParent = target.parentNode;
                targetParent.removeChild(target);
                parentNodes.appendChild(otherTarget);
                targetParent.appendChild(parentNodes);

            } else {
                var otherTarget = target;
                var targetParent = target.parentNode;
                targetParent.removeChild(target);
                // parentNodes.appendChild(otherTarget);
                targetParent.appendChild(html);
            }
        }
        var mask = document.querySelectorAll('.mask');
        console.log(mask);

        for (var i = 0; i < mask.length; i++) {
            mask[i].parentNode.removeChild(mask[i]);
        }
    },
    // 添加事件模式
    addEvent: function(html) {
        var that = this;
        this.onClickStyle(html);

        html.addEventListener('dragenter', function(e) {
            that.dropTarget = this;
            that.dragenter(this);
            // this.classList.add('dotted');
        }, false);

        html.addEventListener('dragover', function(e) {
            e.preventDefault();
            // this.classList.add('dotted')
            that.dragover(that, this, e);
            return true
        }, false);

        html.addEventListener('dragleave', function(e) {
            var mask = document.querySelectorAll('.mask');
            // console.log(mask);

            for (var i = 0; i < mask.length; i++) {
                mask[i].parentNode.removeChild(mask[i]);
            }
            // this.classList.remove('dotted')
            return true
        }, false);

        html.addEventListener('drop', function(e) {
            that.drop(that, e);
            return true
        }, false);

        html.addEventListener('dragstart', function(e) {

            this.classList.add('dragStart');
            that.eleDrag = this;
            that.moveContentMenuOne(that, e);
            return true

        }, true);
    },

    // 添加生成每个图形的代码结构
    creatHtml: function(str) {

        var that = this,
            html = '',
            header = '',
            topLeft = '',
            topRight = '',
            bottomLeft = '',
            bottomRight = '',
            leftLine = '',
            rightLine = '',
            topLine = '',
            bottomLine = '',
            deletes = '',
            listContent = '';

        html = document.createElement('div');
        topLeft = document.createElement('span');
        topLeft.classList.add('top-left');

        topRight = document.createElement('span');
        topRight.classList.add('top-right');
        bottomLeft = document.createElement('span');
        bottomLeft.classList.add('bottom-left');

        bottomRight = document.createElement('span');
        bottomRight.classList.add('bottom-right');

        deletes = document.createElement('div');
        deletes.classList.add('delete');
        deletes.addEventListener('click', function() {
            that.deleteContent(this);
        })

        html.appendChild(deletes);

        html.appendChild(topLeft);
        html.appendChild(topRight);
        html.appendChild(bottomLeft);
        html.appendChild(bottomRight);

        topLine = document.createElement('div');
        topLine.classList.add('topLine');
        bottomLine = document.createElement('div');
        bottomLine.classList.add('bottomLine');

        leftLine = document.createElement('div');
        leftLine.classList.add('leftLine');
        rightLine = document.createElement('div');
        rightLine.classList.add('rightLine');

        html.appendChild(leftLine);
        html.appendChild(rightLine);
        html.appendChild(topLine);
        html.appendChild(bottomLine);

        that.moveLeft(leftLine);

        header = document.createElement('div');
        listContent = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = "单击添加标题";
        listContent.classList.add('list-content');
        listContent.innerHTML = "内容区域";
        html.appendChild(header);
        html.appendChild(listContent);
        html.classList.add('content-menu');
        html.style.left = 'calc(' + that.creatMask.style.left + ' + 2px)';
        html.style.top = 'calc(' + that.creatMask.style.top + ' + 2px)';
        html.style.width = 'calc(' + that.creatMask.style.width + ' - 2px)';
        html.style.height = 'calc(' + that.creatMask.style.height + ' - 2px)';
        html.setAttribute('draggable', "draggable");

        //var str = e.dataTransfer.getData('source');
        if (str) {
            listContent.innerHTML = str;
        }
        return html;
    },

    deleteContent: function(obj) {
        // 删除的时候先获取一下当前删除的父级的内容
        // 保存一下那个没删除的图形
        // 删除掉当前的那个
        // 把保存的那个添加到删除的父级的父级里
        // 把父级给删除掉
        //
        //1. 获取父级里的所有内容
        var copyEle = obj.parentNode.parentNode.childNodes;
        // 获取父级
        var prevParent = obj.parentNode.parentNode;
        var prevParentTop = prevParent.style.top;
        var prevParentLeft = prevParent.style.left;
        var prevParentWidth = prevParent.style.width;
        var prevParentHeight = prevParent.style.height;
        // 2. 获取最后追加的上一层的父级
        var lastParent = obj.parentNode.parentNode.parentNode;
        // 3.判断一下最外层如果只有一个的话就不删除父级

        console.log(copyEle);
        console.log(lastParent);
        console.log(prevParent);
        var right = document.querySelector('.right');
        if (lastParent == right || prevParent == this.targetBoxobj) {
            obj.parentNode.parentNode.removeChild(obj.parentNode);
            this.showState();
            return;
        }
        var saveEle = null;
        var deleteEle = null;
        var i, len = copyEle.length;
        for (i = 0; i < len; i++) {
            if (copyEle[i] == obj.parentNode) {
                deleteEle = copyEle[i];
            } else if (copyEle[i] !== obj.parentNode) {
                saveEle = copyEle[i];
            }
        }

        lastParent.appendChild(saveEle);
        prevParent.removeChild(deleteEle);

        saveEle.style.top = prevParentTop;
        saveEle.style.left = prevParentLeft;
        saveEle.style.width = prevParentWidth;
        saveEle.style.height = prevParentHeight;
        lastParent.removeChild(prevParent);
    },
    moveContentMenuOne: function(that, e) {
        // console.log(e)
        // 显示拖拽的logo

    },
    // 点击某个div显示拖拽状态的样式
    onClickStyle: function(clickObj) {
        var leftTop, rightTop, leftBottom, rightBottom, leftLine, rightLine, topLine, bottomLine, deletes;
        var that = this;
        clickObj.addEventListener('click', function() {

            var contentList = document.querySelectorAll('.content-menu');

            for (var i = 0; i < contentList.length; i++) {

                contentList[i].classList.remove('dragStart');
                // leftTop = contentList[i].querySelector('.top-left');
                // rightTop = contentList[i].querySelector('.top-right');
                // leftBottom = contentList[i].querySelector('.bottom-left');
                // rightBottom = contentList[i].querySelector('.bottom-right');
                // leftTop.style.display = 'none';
                // rightTop.style.display = 'none';
                // leftBottom.style.display = 'none';
                // rightBottom.style.display = 'none';
                leftLine = contentList[i].querySelector('.leftLine');
                rightLine = contentList[i].querySelector('.rightLine');
                topLine = contentList[i].querySelector('.topLine');
                bottomLine = contentList[i].querySelector('.bottomLine');
                leftLine.style.display = 'none';
                rightLine.style.display = 'none';
                topLine.style.display = 'none';
                bottomLine.style.display = 'none';
                deletes = contentList[i].querySelector('.delete');
                deletes.style.display = 'none';

            }

            // leftTop = this.querySelector('.top-left');
            // rightTop = this.querySelector('.top-right');
            // leftBottom = this.querySelector('.bottom-left');
            // rightBottom = this.querySelector('.bottom-right');
            // leftTop.style.display = 'block';
            // rightTop.style.display = 'block';
            // leftBottom.style.display = 'block';
            // rightBottom.style.display = 'block';
            this.classList.add('dragStart');
            leftLine = this.querySelector('.leftLine');
            rightLine = this.querySelector('.rightLine');
            topLine = this.querySelector('.topLine');
            bottomLine = this.querySelector('.bottomLine');
            leftLine.style.display = 'block';
            rightLine.style.display = 'block';
            topLine.style.display = 'block';
            bottomLine.style.display = 'block';
            deletes = this.querySelector('.delete');
            deletes.style.display = 'block';

            //  var partten = /\((.*?)\%/;
            //  var ss = parseInt(partten.exec(this.style.left)[1])+parseInt(that.calcXWidth)
            // this.style.left = 'calc('+ ss +'% + 2px)';
        })
    },
    // 绑定向左拖拽事件
    moveLeft: function(ele) {
        var that = this;
        var partten = /\((.*?)\%/;
        // parseInt(partten.exec(target.style.left)[1]);
        ele.addEventListener('mousedown', function(event) {
            var e = event || window.event;
            var x = parseInt(e.pageX);
            var y = parseInt(e.pageY);
            var left = 0;
            var top = 0;
            var width = 0;
            var height = 0;
            var source = ele.parentNode;
            var parentBoxWidth = document.body.clientWidth - 200;
            var lastX = 0;
            if (source) {
                left = parseInt(partten.exec(source.style.left)[1]);
                top = parseInt(partten.exec(source.style.top)[1]);
                width = parseInt(partten.exec(source.style.width)[1]);
                height = parseInt(partten.exec(source.style.height)[1]);
            }

            document.onmousemove = function(ev) {
                var ev = ev || window.event;
                left = Number(Number(partten.exec(source.style.left)[1]).toFixed(4));
                top = Number(Number(partten.exec(source.style.top)[1]).toFixed(4));
                width = Number(Number(partten.exec(source.style.width)[1]).toFixed(4));
                height = Number(Number(partten.exec(source.style.height)[1]).toFixed(4));

                var nowX = parseInt(ev.pageX);
                var nowY = parseInt(ev.pageY);

                var calcXs = Number((((nowX - x) / parentBoxWidth) - lastX).toFixed(4));
                //console.log(calcXs+'calcXs');
                //console.log(width);

                if (nowX - x < 0) { //向左
                    // alert('ddddd')
                    source.style.width = 'calc(' + (width - calcXs) + '%)';
                    source.style.left = 'calc(' + (left + calcXs) + '%)';

                } else if (nowX - x == 0) {
                    return
                } else if (nowX - x > 0) { //向右
                    // alert('yyyyy')
                    source.style.left = 'calc(' + (left + calcXs) + '%)';
                    source.style.width = 'calc(' + (width - calcXs) + '%)';
                    // console.log(left+'left');
                    // console.log(calcXs+'calcXs');
                    // console.log((left + calcXs) +'left+calcXs');
                }
                lastX = calcXs;
                // var initX = nowX - x + left;
                // var initY = nowY - y + top;


                // source.style.width = calc(parseInt(partten.exec(source.style.widht)[1])+that.calcX +'%'-2px);
                // source.style.top = initY + 'px';
            }
        }, true);

         document.addEventListener('mouseup', function() {
            // source.style.left = 'calc(' + (left + that.calcXWidth) + '% + 2px)';
            // source.style.width = 'calc(' + (width - that.calcXWidth) + '% + 2px)';
            // that.targetBoxobj.onmousemove = null;
            document.onmousemove=null;
                document.onmouseup=null;
        });
    },
    // 判断拖拉的方向
    getDirection: function(el) {
        var xPos, yPos, offset, dir;
        dir = "";
        xPos = window.event.offsetX;
        yPos = window.event.offsetY;
        offset = 8; //设置边缘距离
        if (yPos < offset) dir += "n";
        else if (yPos > el.offsetHeight - offset) dir += "s";
        if (xPos < offset) dir += "w";
        else if (xPos > el.offsetWidth - offset) dir += "e";
        return dir;
    },
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
