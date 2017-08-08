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
    this.stopDragMask = ''; //生成的元素进行拖拽时的遮罩层
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

                ev.dataTransfer.clearData("sourceId");

                that.showState2.style.display = "none";

                that.creatMask.classList.remove('active');

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
            that.drop(that, this, e);
        });
        this.showState2.addEventListener('dragenter', function(e) {
            that.dragenter(this);
        });
        this.showState2.addEventListener('dragleave', function(e) {
            var mask = document.querySelectorAll('.mask');

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
        // console.log(that.eleDrag)
        if (obj.classList.contains('active')) return;
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
        if (!target) return;
        // console.log(target.style.left);
        targetLeft = parseInt(partten.exec(target.style.left)[1]);
        targetTop = parseInt(partten.exec(target.style.top)[1]);
        targetWidth = parseInt(partten.exec(target.style.width)[1]);
        targetHeight = parseInt(partten.exec(target.style.height)[1]);
        width = parseInt(target.offsetWidth / 3);
        height = parseInt(target.offsetHeight / 3);

        if (x > 0 && x < width && y > 0 && y < height) { //左上 在左邊生成div
            // console.log('左上=================')
            that.dragDir = 'left';
            if (targetWidth <= that.calcXWidth) {

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
            if (targetWidth <= that.calcXWidth) {
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
            if (targetWidth <= that.calcXWidth) {
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
            if (targetHeight <= that.calcYHeight) {
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
            if (targetHeight <= that.calcYHeight) {
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
            if (targetWidth <= that.calcXWidth) {
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
            if (targetWidth <= that.calcXWidth) {
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
            if (targetWidth <= that.calcXWidth) {
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

    // drop的时候需要考虑的问题
    // 1.左侧控件拖过来时的拖放
    //
    // 2.图形拖拽的时候的拖放
    //
    drop: function(that, obj, e) {
        var eleDragParent = null;
        var ifCreatParetn = true;
        var isIconOrImg = false;
        // console.log(that.eleDrag)
        // 判断释放目标对象是否为拖拽对象,防止自己对自己拖放
        if (obj.classList.contains('active')) return;

        // 判断拖拽对象是左侧菜单栏拖过来的还是当前图形控件拖过来的

        var content = document.querySelectorAll('.content-menu') || [];

        var parentNodes = '',
            html = '',
            placeHtml = '',
            str = e.dataTransfer.getData('source');

        if (that.eleDrag && that.eleDrag.classList.contains('content-menu')) {
            isIconOrImg = true;//用一个变量保存当前是左侧元素还是图形元素的释放
            // 如果拖拽对象是图形控件就不创建新的元素，保存拖拽图形
            html = that.eleDrag;
            eleDragParent = that.eleDrag.parentNode;
            // 判断拖拽对象和释放对象是同一个父级,如果是同一个父级就不创建新的父级
            if (eleDragParent == obj.parentNode) {
                ifCreatParetn = false;
            } else {
                // 要在原位置把当前图形给删除了
                var eleDragParentobj = that.eleDrag.querySelector('.delete');
                that.deleteContent(eleDragParentobj);
                // eleDragParent.parentNode.removeChild(eleDragParent);
            }
        } else {
            // 如果是左侧tab栏拖拽过来的就创建新元素
            html = str == "" ? this.creatHtml() : this.creatHtml(str);
        }
        // 如果当前是空白的第一次拖过来的内容
        // 需要生成一个父级，和右边空白区域的容器
        if (content.length == 0 && that.dragDir !== 'middle') {
            // 创建一个父级容器 第一次拖拽
            parentNodes = document.createElement('div');
            parentNodes.classList.add('parentList');
            parentNodes.style.width = 'calc(100%)';
            parentNodes.style.height = 'calc(100%)';
            parentNodes.style.left = 'calc(0%)';
            parentNodes.style.top = 'calc(0%)';
            // 创建图形

            html.style.left = 'calc(' + that.creatMask.style.left + ' + 2px)';
            html.style.top = 'calc(' + that.creatMask.style.top + ' + 2px)';
            html.style.width = 'calc(' + that.creatMask.style.width + ' - 2px)';
            html.style.height = 'calc(' + that.creatMask.style.height + ' - 2px)';
            // this.addEvent(html);

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
            // 如果第一低拖拽生成图形并且是全屏覆盖的图形元素的话
            html.style.left = 'calc(' + that.creatMask.style.left + ' + 2px)';
            html.style.top = 'calc(' + that.creatMask.style.top + ' + 2px)';
            html.style.width = 'calc(' + that.creatMask.style.width + ' - 2px)';
            html.style.height = 'calc(' + that.creatMask.style.height + ' - 2px)';

            this.targetBoxobj.appendChild(html);

        } else {
            // 获取释放对象
            var target = that.dropTarget;
            // 如果拖放的是同一个父级就不创建新的父级
            if (ifCreatParetn) {
                // 创建父级
                parentNodes = document.createElement('div');
                parentNodes.classList.add('parentList');
            }

            // 保存释放对象的属性
            that.parentTop = target.style.top;
            that.parentLeft = target.style.left;
            that.parentHeight = target.style.height;
            that.parentWidth = target.style.width;

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
                // var parentList = document.querySelectorAll('.parentList');
                // if (content.length == 2) {
                //     html.style.left = 'calc(0% + 2px)';
                //     html.style.top = 'calc(0% + 2px)';
                //     html.style.width = 'calc(100% - 2px)';
                //     html.style.height = 'calc(100% - 2px)';
                // } else {
                    html.style.left = target.style.left;
                    html.style.top = target.style.top;
                    html.style.width = target.style.width;
                    html.style.height = target.style.height;
                // }

            }

            // this.addEvent(html);
            if (!isIconOrImg) { //如果是左侧拖拽的释放

                if (that.dragDir !== 'middle') { //如果不是全屏覆盖的释放
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

                } else { //如果是全屏覆盖的释放，需要删除当前释放的目标对象并且代替它
                    var conf = window.confirm('确定要替换吗dddd？');
                    if(conf){
                    // var otherTarget = target;
                    var targetParent = target.parentNode;
                    targetParent.removeChild(target);
                    // parentNodes.appendChild(otherTarget);

                    targetParent.appendChild(html);
                    }

                }
            } else  { //如果是右侧图形拖拽的释放
                // 1.释放的时候如果是同一个父级，1》如果是全屏释放
                // 2.释放的时候不是同一个父级的问题，
                var len = document.querySelectorAll('.content-menu').length;
                var targetParent = target.parentNode;
               if(that.dragDir == 'middle'){
                    var conf = window.confirm('确定要替换吗？');
                    if(conf){
                        if(ifCreatParetn) {//如果不是同一个父级的时候
                             html.style.left = target.style.left;
                             html.style.top = target.style.top;
                             html.style.width = target.style.width;
                             html.style.height = target.style.height;
                             targetParent.removeChild(target);

                             targetParent.appendChild(html);

                        }else {//如果是同一个父级的话，需要删除他们共有的父级和target

                            var sameparent = targetParent.parentNode;
                            html.style.left = targetParent.style.left;
                            html.style.top = targetParent.style.top;
                            html.style.width = targetParent.style.width;
                            html.style.height = targetParent.style.height;
                            sameparent.removeChild(targetParent);

                            sameparent.appendChild(html);
                        }



                    }
               }
            }

        }
        this.addEvent(html);
        var mask = document.querySelectorAll('.mask');

        for (var i = 0; i < mask.length; i++) {
            mask[i].parentNode.removeChild(mask[i]);
        }
        // debugger
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

        }, false);

        html.addEventListener('dragleave', function(e) {
            var mask = document.querySelectorAll('.mask');

            for (var i = 0; i < mask.length; i++) {
                mask[i].parentNode.removeChild(mask[i]);
            }
            // this.classList.remove('dotted')

        }, false);

        // html.addEventListener('drop', function(e) {
        //     that.drop(that, this, e);

        // }, false);
        html.ondrop = function(e){
            that.drop(that, this, e);
        }
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
            draglogo = '',
            listContent = '';

        html = document.createElement('div');
        // topLeft = document.createElement('span');
        // topLeft.classList.add('top-left');

        // topRight = document.createElement('span');
        // topRight.classList.add('top-right');
        // bottomLeft = document.createElement('span');
        // bottomLeft.classList.add('bottom-left');

        // bottomRight = document.createElement('span');
        // bottomRight.classList.add('bottom-right');

        deletes = document.createElement('div');
        deletes.classList.add('delete');
        deletes.addEventListener('click', function() {
            that.deleteContent(this);
        })

        html.appendChild(deletes);

        draglogo = document.createElement('div');
        draglogo.classList.add('draglogo');
        draglogo.setAttribute('draggable', true);
        html.appendChild(draglogo);

        draglogo.addEventListener('dragstart', function(e) {
            that.dragLogoStart(e, this);
        });

        draglogo.addEventListener('dragend', function(e) {
            that.dragLogoEnd(e, this);
        });


        // html.appendChild(topLeft);
        // html.appendChild(topRight);
        // html.appendChild(bottomLeft);
        // html.appendChild(bottomRight);

        topLine = document.createElement('div');
        topLine.classList.add('topLine');
        topLine.style.top = "0";

        bottomLine = document.createElement('div');
        bottomLine.classList.add('bottomLine');
        bottomLine.style.bottom = "0";

        leftLine = document.createElement('div');
        leftLine.classList.add('leftLine');
        leftLine.style.left = "0";
        rightLine = document.createElement('div');
        rightLine.classList.add('rightLine');
        rightLine.style.right = "0";

        html.appendChild(leftLine);
        html.appendChild(rightLine);
        html.appendChild(topLine);
        html.appendChild(bottomLine);

        that.moveLeft(leftLine);
        that.moveLeft(rightLine);
        that.moveLeft(topLine);
        that.moveLeft(bottomLine);

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
        if(saveEle){
            lastParent.appendChild(saveEle);
            saveEle.style.top = prevParentTop;
            saveEle.style.left = prevParentLeft;
            saveEle.style.width = prevParentWidth;
            saveEle.style.height = prevParentHeight;
        }

        prevParent.removeChild(deleteEle);


        lastParent.removeChild(prevParent);
    },
    // 已经生成的控件在进行拖拽
    // 1.定位一个拖拽按钮，拖拽按钮开始拖拽事件

    dragLogoStart: function(e, obj) {
        var e = e || window.event;

        this.eleDrag = obj.parentNode;
        console.log(this.eleDrag)
        obj.parentNode.style.zIndex = '-1';
        obj.parentNode.classList.add('active');
    },
    dragLogoEnd: function(e, obj) {
        var e = e || window.event;

        this.eleDrag = null;
        obj.parentNode.style.zIndex = '998';
        obj.parentNode.classList.remove('active');
    },

    // 点击某个div显示拖拽状态的样式
    onClickStyle: function(clickObj) {
        var leftTop, rightTop, leftBottom, rightBottom, leftLine, rightLine, topLine, bottomLine, deletes, draglogo;
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
                draglogo = contentList[i].querySelector('.draglogo');
                draglogo.style.display = 'none';

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
            draglogo = this.querySelector('.draglogo');
            draglogo.style.display = 'block';

            //  var partten = /\((.*?)\%/;
            //  var ss = parseInt(partten.exec(this.style.left)[1])+parseInt(that.calcXWidth)
            // this.style.left = 'calc('+ ss +'% + 2px)';
        })
    },
    onHoverBorder: function(hoverobj) {
        var parentsList = document.querySelectorAll('.parentList');
        var i, len = parentsList.length;

        for (i = 0; i < len; i++) {
            parentsList[i].classList.remove('hover');
        }
        hoverobj.classList.add('hover');
    },
    // 绑定向左拖拽事件
    // 在拖拽开始的时候判断拖拽的方向，根据方向来确定是要在哪个方向进行缩放当前div
    // 把当前拖拽的移动距离按照当前盒子在父级所占的百分比来给当前盒子增加或者减少
    // 最后把拖拽的方向都归为0
    moveLeft: function(ele) {
        var that = this;
        var partten = /\((.*?)\%/;
        var initX = 0,
            initY = 0,
            sourceParent = null,
            sourceParentWidth = 0,
            sourceParentHeight = 0,
            sourceParentTop = 0,
            sourceParentLeft = 0,
            left = 0,
            top = 0,
            width = 0,
            height = 0;
        // parseInt(partten.exec(target.style.left)[1]);
        ele.addEventListener('mousedown', function(event) {
            var e = event || window.event;
            var x = parseInt(e.pageX);
            var y = parseInt(e.pageY);

            var moveCalc = 0;
            // var top = parseInt(ele.style.top);
            // var right = parseInt(ele.style.right);
            // var bottom = parseInt(ele.style.bottom);


            var width = 0;
            var height = 0;
            // 获取当前div的属性值
            var source = ele.parentNode;
            var sourceLeft = parseInt(partten.exec(source.style.left)[1]);
            var sourceTop = parseInt(partten.exec(source.style.top)[1]);
            var sourceWidth = parseInt(partten.exec(source.style.width)[1]);
            var sourceHeight = parseInt(partten.exec(source.style.height)[1]);

            // 获取当前div的父级的属性值
            sourceParent = source.parentNode;
            sourceParentWidth = parseInt(sourceParent.offsetWidth);
            sourceParentHeight = parseInt(sourceParent.offsetHeight);
            sourceParentTop = parseInt(partten.exec(sourceParent.style.top)[1]);
            sourceParentLeft = parseInt(partten.exec(sourceParent.style.left)[1]);

            var eleClass = ele.className;
            switch (eleClass) {
                case "leftLine":
                    if (sourceLeft == 0) {
                        return
                    }
                    moveCalc = parseInt(ele.style.left);
                    break;
                case "rightLine":
                    if (sourceLeft + sourceWidth >= 100) return
                    moveCalc = parseInt(ele.style.right);
                    break;
                case "topLine":
                    if (sourceTop == 0) {
                        return
                    }
                    moveCalc = parseInt(ele.style.top);
                    break;
                case "bottomLine":
                    if (sourceTop + sourceHeight >= 100) return
                    moveCalc = parseInt(ele.style.bottom);
                    break;
            }

            var childnodesList = sourceParent.childNodes;
            var sourceBrother = null;
            for (var i = 0; i < childnodesList.length; i++) {
                if (childnodesList[i] != source) {
                    sourceBrother = childnodesList[i];
                }
            }
            // 改变当前div的属性值也改变另外一个div的属性值
            if (sourceBrother != null) {
                var sourceBrotherLeft = parseInt(partten.exec(sourceBrother.style.left)[1]);
                var sourceBrotherTop = parseInt(partten.exec(sourceBrother.style.top)[1]);
                var sourceBrotherWidth = parseInt(partten.exec(sourceBrother.style.width)[1]);
                var sourceBrotherHeight = parseInt(partten.exec(sourceBrother.style.height)[1]);
            }


            var parentBoxWidth = document.body.clientWidth - 200;
            var lastX = 0;
            if (source) {
                left = parseInt(partten.exec(source.style.left)[1]);
                top = parseInt(partten.exec(source.style.top)[1]);
                width = parseInt(partten.exec(source.style.width)[1]);
                height = parseInt(partten.exec(source.style.height)[1]);
            }

            document.onmousemove = function(ev) {
                // console.log('ddddd')
                var ev = ev || window.event;
                var nowX = parseInt(ev.pageX);
                var nowY = parseInt(ev.pageY);
                initX = nowX - x + moveCalc;
                initY = nowY - y + moveCalc;
                if (ele.classList.contains('leftLine')) {
                    // if(sourceLeft == 0) console.log('left'); return
                    ele.style.left = initX + 'px';

                } else if (ele.classList.contains('rightLine')) {
                    // initX = (nowX - x) + moveCalc;
                    ele.style.right = -initX + 'px';
                } else if (ele.classList.contains('topLine')) {
                    // if(sourceTop == 0) return
                    ele.style.top = initY + 'px';
                } else if (ele.classList.contains('bottomLine')) {
                    // initY = nowY - y + moveCalc;
                    ele.style.bottom = -initY + 'px';
                }
            }
            document.onmouseup = function() {

                var calcX = Number((initX / sourceParentWidth).toFixed(3)) * 100;
                var calcY = Number((initY / sourceParentHeight).toFixed(3)) * 100;
                console.log(calcY);
                console.log(calcX);

                if (ele.classList.contains('leftLine')) {
                    source.style.left = 'calc(' + (left + parseInt(calcX)) + '% + 2px)';
                    source.style.width = 'calc(' + (width - parseInt(calcX)) + '% - 2px)';
                    // sourceBrother.style.left = 'calc(' + (sourceBrotherLeft + parseInt(calcX)) + '% + 2px)';
                    sourceBrother.style.width = 'calc(' + (sourceBrotherWidth + parseInt(calcX)) + '% - 2px)';
                    ele.style.left = 0;

                } else if (ele.classList.contains('rightLine')) {
                    // source.style.left = 'calc(' + (left - parseInt(calcX)) + '% + 2px)';
                    source.style.width = 'calc(' + (width + parseInt(calcX)) + '% - 2px)';
                    sourceBrother.style.width = 'calc(' + (sourceBrotherWidth - parseInt(calcX)) + '% - 2px)';
                    sourceBrother.style.left = 'calc(' + (sourceBrotherLeft + parseInt(calcX)) + '% + 2px)';
                    ele.style.right = 0;
                } else if (ele.classList.contains('topLine')) {
                    source.style.top = 'calc(' + (top + parseInt(calcY)) + '% + 2px)';
                    source.style.height = 'calc(' + (height - parseInt(calcY)) + '% - 2px)';
                    sourceBrother.style.height = 'calc(' + (sourceBrotherHeight + parseInt(calcY)) + '% - 2px)';
                    ele.style.top = 0;
                } else if (ele.classList.contains('bottomLine')) {
                    // source.style.top = 'calc(' + (top + parseInt(calcY)) + '% + 2px)';
                    source.style.height = 'calc(' + (height + parseInt(calcY)) + '% - 2px)';
                    sourceBrother.style.top = 'calc(' + (sourceBrotherTop + parseInt(calcY)) + '% + 2px)';
                    sourceBrother.style.height = 'calc(' + (sourceBrotherHeight - parseInt(calcY)) + '% - 2px)';
                    ele.style.bottom = 0;
                }
                document.onmousemove = null;
                document.onmouseup = null;
                // 计算移动距离在父级所占的百分比

            };
        }, true);


    },

    // moveLeft: function(moveDown, source) {
    //     moveDown.on('mousedown', function(event) {
    //         var e = event || window.event;
    //         $(this).css('cursor', 'move');
    //         var x = parseInt(e.pageX);
    //         var y = parseInt(e.pageY);
    //         var left = parseInt(source.css('left'));
    //         var top = parseInt(source.css('top'));
    //         $(document).bind('mousemove', function(ev) {
    //             var ev = ev || window.event;
    //             var nowX = parseInt(ev.pageX);
    //             var nowY = parseInt(ev.pageY);
    //             var initX = nowX - x + left;
    //             var initY = nowY - y + top;
    //             source.css({
    //                 'left': initX,
    //                 'top': initY
    //             });
    //         })
    //     });
    //     $(document).bind('mouseup', function() {
    //         moveDown.css('cursor', 'default');

    //         $(document).unbind('mousemove');
    //     });
    // }
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
