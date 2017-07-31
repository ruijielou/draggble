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
            that.dragover(that, this, e);
            return true
        });
        this.showState2.addEventListener('drop', function(e) {
            that.drop(that, e);

        });

    },
    dragstart: function(that) {
        var e = window.event || event;
        var sourceText = this.dataset['sourceText'];

        that.eleDrag = this;
        e.dataTransfer.setData('source', sourceText);
    },
    dragover: function(that, obj, e) {
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
            // console.log('左中=================')
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
            // console.log('左下=================')
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
            // console.log('中间=================')
            maskLeft = targetLeft;
            maskTop = targetTop;
            maskWidth = targetWidth;
            maskHeight = targetHeight;
            that.dropTargetWidth = maskWidth;
            that.dropTargetHeight = maskHeight;
            that.dropTargetLeft = targetLeft;
            that.dropTargetTop = targetTop;
        }

        that.mask.classList.add('active');
        that.mask.style.left = maskLeft + '%';
        that.mask.style.top = maskTop + '%';
        that.mask.style.width = maskWidth + '%';
        that.mask.style.height = maskHeight + '%';
    },
    drop: function(that, e) {
        // 需要判断拖拽的对象的左侧列表还是内容区域的具体的某一个
        // 如果是具体的某一个生成的div，则不需要再creatElement
        var target = that.dropTarget;
        // console.log(target)
        var html = '',
            header = '',
            topLeft = '',
            topRight = '',
            bottomLeft = '',
            bottomRight = '',
            listContent = '';

        that.mask.classList.remove('active');
        // console.log(that.eleDrag)
        if (that.eleDrag && that.eleDrag.classList.contains('content-menu')) {
            // that.eleDrag.style.left =
            that.eleDrag.style.left = 'calc(' + that.mask.style.left + ' + 2px)';
            that.eleDrag.style.top = 'calc(' + that.mask.style.top + ' + 2px)';
            that.eleDrag.style.width = 'calc(' + that.mask.style.width + ' - 2px)';
            that.eleDrag.style.height = 'calc(' + that.mask.style.height + ' - 2px)';
            that.eleDrag.classList.remove('dragStart');
            that.eleDrag.addEventListener('dragenter', function(e) {
                that.dropTarget = this;
                this.classList.add('dotted');
            }, false);

            that.eleDrag.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dotted')
                that.dragover(that, this, e);
                return true
            }, false);

            that.eleDrag.addEventListener('dragleave', function(e) {
                this.classList.remove('dotted')
                return true
            }, false);

            that.eleDrag.addEventListener('drop', function(e) {
                that.drop(that, e);
                return true
            }, false);
            that.eleDrag.addEventListener('dragstart', function(e) {
                this.classList.add('dragStart');
                that.eleDrag = this;
                that.moveContentMenuOne(that, e);
                return true
            }, false);


        } else {
            html = document.createElement('div');
            topLeft = document.createElement('span');
            topLeft.classList.add('top-left');

            topRight = document.createElement('span');
            topRight.classList.add('top-right');
            bottomLeft = document.createElement('span');
            bottomLeft.classList.add('bottom-left');

            bottomRight = document.createElement('span');
            bottomRight.classList.add('bottom-right');

            html.appendChild(topLeft);
            html.appendChild(topRight);
            html.appendChild(bottomLeft);
            html.appendChild(bottomRight);

            header = document.createElement('div');
            listContent = document.createElement('div');
            header.classList.add('header');
            header.innerHTML = "单击添加标题";
            listContent.classList.add('list-content');
            listContent.innerHTML = "内容区域";
            html.appendChild(header);
            html.appendChild(listContent);
            html.classList.add('content-menu');
            html.style.left = 'calc(' + that.mask.style.left + ' + 2px)';
            html.style.top = 'calc(' + that.mask.style.top + ' + 2px)';
            html.style.width = 'calc(' + that.mask.style.width + ' - 2px)';
            html.style.height = 'calc(' + that.mask.style.height + ' - 2px)';
            html.setAttribute('draggable', "draggable");
            var str = e.dataTransfer.getData('source');
            if (str) {
                listContent.innerHTML = str;
            }
            that.onClickStyle(html);
            html.addEventListener('dragenter', function(e) {
                that.dropTarget = this;
                this.classList.add('dotted');
            }, false);

            // that.MoveContorl(header, html);

            html.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dotted')
                that.dragover(that, this, e);
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
            html.addEventListener('dragstart', function(e) {
                // html.addEventListener('dragstart', function(ev) {
                this.style.cursor = "move";
                this.classList.add('dragStart');
                that.eleDrag = this;
                that.moveContentMenuOne(that, e);
                return true
                // })

            }, true);

            that.targetBoxobj.appendChild(html);
            that.eleDrag = null;
        }

        if (target != that.targetBoxobj) {
            target.style.top = "calc(" + that.dropTargetTop + '% + 2px)';
            target.style.left = "calc(" + that.dropTargetLeft + '% + 2px)';
            target.style.width = 'calc(' + that.dropTargetWidth + '% - 2px)';
            target.style.height = 'calc(' + that.dropTargetHeight + '% - 2px)';
        }

        that.dropTarget.classList.remove('dotted');


        // html.addEventListener('mousemove', function(e){
        //     e.preventDefault();
        //     this.classList.add('dotted')
        //     that.dragover(that, this, e);
        // })
        that.mousemoveResize('content-menu', html);

        // var contentList = document.querySelectorAll('.content-menu')
        // that.creatEmptyEle(contentList);


    },
    moveContentMenuOne: function(that, e) {
        // console.log(e)
        // 显示拖拽的logo

    },
    // MoveContorl: function(moveDown, source) {
    //     var that = this;
    //     moveDown.addEventListener('mousedown', function(event) {
    //         var e = event || window.event;
    //         var x = parseInt(e.pageX);
    //         var y = parseInt(e.pageY);
    //         var left = parseInt(source.offsetLeft);
    //         var top = parseInt(source.offsetTop);
    //         that.targetBoxobj.onmousemove = function(ev) {
    //             var ev = ev || window.event;
    //             var nowX = parseInt(ev.pageX);
    //             var nowY = parseInt(ev.pageY);
    //             var initX = nowX - x + left;
    //             var initY = nowY - y + top;
    //             source.style.left = initX + 'px';
    //             source.style.top = initY + 'px';
    //         }
    //     }, true);
    //     that.targetBoxobj.addEventListener('mouseup', function() {
    //         that.targetBoxobj.onmousemove = null;
    //     });
    // },
    // 点击某个div显示拖拽状态的样式
    onClickStyle: function(clickObj) {
        var leftTop, rightTop, leftBottom, rightBottom;
        clickObj.addEventListener('click', function() {
            var contentList = document.querySelectorAll('.content-menu');
            for (var i = 0; i < contentList.length; i++) {
                contentList[i].classList.remove('dragStart');
                leftTop = contentList[i].querySelector('.top-left');
                rightTop = contentList[i].querySelector('.top-right');
                leftBottom = contentList[i].querySelector('.bottom-left');
                rightBottom = contentList[i].querySelector('.bottom-right');
                leftTop.style.display = 'none';
                rightTop.style.display = 'none';
                leftBottom.style.display = 'none';
                rightBottom.style.display = 'none';
            }
            leftTop = this.querySelector('.top-left');
            rightTop = this.querySelector('.top-right');
            leftBottom = this.querySelector('.bottom-left');
            rightBottom = this.querySelector('.bottom-right');
            leftTop.style.display = 'block';
            rightTop.style.display = 'block';
            leftBottom.style.display = 'block';
            rightBottom.style.display = 'block';
            this.classList.add('dragStart');
        })
    },
    // mousemoveResize: function(resizeObj, eleHtml) {
    //     var that = this;
    //     var temp = null;
    //     var theobject = null; //调整大小开始时保存值
    //     function resizeObject() {
    //         this.el = null; //
    //         this.dir = ""; // (n, s, e, w, ne, nw, se, sw) east south west north 判断四个方向四个角
    //         this.grabx = null;
    //         this.graby = null;
    //         this.width = null;
    //         this.height = null;
    //         this.left = null;
    //         this.top = null;
    //     }
    //     //判断拖拉的方向
    //     function getDirection(el) {
    //         var xPos, yPos, offset, dir;
    //         dir = "";
    //         xPos = window.event.offsetX;
    //         yPos = window.event.offsetY;
    //         offset = 8; //设置边缘距离
    //         if (yPos < offset) dir += "n";
    //         else if (yPos > el.offsetHeight - offset) dir += "s";
    //         if (xPos < offset) dir += "w";
    //         else if (xPos > el.offsetWidth - offset) dir += "e";
    //         return dir;
    //     }

    //     function doDown(event) {
    //         // console.log(e)
    //         // if (event.target.className == 'header') {
    //         //     var header = eleHtml.querySelector('.header')
    //         //     that.MoveContorl(header, eleHtml)
    //         // } else {
    //             if (event.srcElement.className != 'content-menu') {
    //                 return
    //             }
    //             var el = getReal(event.srcElement, "className", resizeObj);
    //             if (el == null) {
    //                 theobject = null;
    //                 return;
    //             }
    //             that.dir = getDirection(el);
    //             if (that.dir == "") return;
    //             theobject = new resizeObject();

    //             theobject.el = el;
    //             theobject.dir = that.dir;
    //             theobject.grabx = window.event.clientX;
    //             theobject.graby = window.event.clientY;
    //             theobject.width = el.offsetWidth;
    //             theobject.height = el.offsetHeight;
    //             theobject.left = el.offsetLeft;
    //             theobject.top = el.offsetTop;
    //             window.event.returnValue = false;
    //             window.event.cancelBubble = true;
    //         // }

    //     }

    //     function doUp(resizeObj) {
    //         if (theobject != null) {
    //             theobject = null;
    //         }
    //     }

    //     function doMove() {
    //         var el, xPos, yPos, str, xMin, yMin;
    //         xMin = 8; //设定一个最小宽度
    //         yMin = 8; //             height
    //         el = getReal(event.srcElement, "className", resizeObj);
    //         if (el.className == resizeObj) {
    //             str = getDirection(el);

    //             if (str == "") str = "default";
    //             else str += "-resize";
    //             el.style.cursor = str;
    //         }


    //         if (theobject != null) {
    //             if (that.dir.indexOf("e") != -1) //east
    //                 theobject.el.style.width = Math.max(xMin, theobject.width + window.event.clientX - theobject.grabx) + "px";

    //             if (that.dir.indexOf("s") != -1) //south
    //                 theobject.el.style.height = Math.max(yMin, theobject.height + window.event.clientY - theobject.graby) + "px";
    //             if (that.dir.indexOf("w") != -1) { //west
    //                 theobject.el.style.left = Math.min(theobject.left + window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin) + "px";
    //                 theobject.el.style.width = Math.max(xMin, theobject.width - window.event.clientX + theobject.grabx) + "px";
    //             }
    //             if (that.dir.indexOf("n") != -1) { //north
    //                 theobject.el.style.top = Math.min(theobject.top + window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin) + "px";
    //                 theobject.el.style.height = Math.max(yMin, theobject.height - window.event.clientY + theobject.graby) + "px";
    //             }

    //             window.event.returnValue = false;
    //             window.event.cancelBubble = true;
    //         }
    //     }

    //     function getReal(el, type, value) {
    //         temp = el;
    //         while ((temp != null) && (temp.tagName != "BODY")) {
    //             if (eval("temp." + type) == value) {
    //                 el = temp;
    //                 return el;
    //             }
    //             temp = temp.parentElement;
    //         }
    //         return el;
    //     }
    //     document.onmousedown = function(e) {
    //         doDown(e)
    //     };
    //     document.onmouseup = doUp;
    //     document.onmousemove = doMove;
    // },

    // 刷新空白位置生成空的占位div
    creatEmptyEle: function(contentList) {
        var i, j, len = contentList.length;
        var partten = /\((.*?)\%/;
        var currentLeft, currentTop, currentWidth, currentHeight; //确定当前盒子的上下左右的位置
        var matchingLeft, matchingTop, matchingWidth, matchingHeight; //某个匹配盒子的上下左右
        var newLeft, newTop, newWidth, newHeight; //生成虚拟盒子的坐标
        var newArray = [];
        var obj = {};
        for (i = 0; i < len; i++) {
            currentLeft = parseInt(partten.exec(contentList[i].style.left)[1]);
            currentTop = parseInt(partten.exec(contentList[i].style.top)[1]);
            currentWidth = parseInt(partten.exec(contentList[i].style.width)[1]);
            currentHeight = parseInt(partten.exec(contentList[i].style.height)[1]);

            for (j = 0; j < len; j++) {
                matchingLeft = parseInt(partten.exec(contentList[j].style.left)[1]);
                matchingTop = parseInt(partten.exec(contentList[j].style.top)[1]);
                matchingWidth = parseInt(partten.exec(contentList[j].style.width)[1]);
                matchingHeight = parseInt(partten.exec(contentList[j].style.height)[1]);
                if (currentLeft > matchingLeft) { //确定在左边
                    if (matchingTop + matchingTop > currentTop) { //确定在左上方
                        newLeft = matchingLeft + matchingWidth;
                        newTop = currentTop;
                        newWidth = currentLeft - newLeft;
                        newHeight = currentHeight - (matchingTop - currentTop);
                        obj.newLeft = newLeft;
                        obj.newTop = newTop;
                        obj.newWidth = newWidth;
                        obj.newHeight = newHeight;
                        newArray.push(obj);
                        obj = {};
                    } else if (matchingTop < currentTop + currentHeight) { //确定在左下方
                        newLeft = matchingLeft + matchingWidth;
                        newTop = matchingTop;
                        newWidth = currentLeft - newLeft;
                        newHeight = matchingTop - matchingHeight - currentTop;
                        obj.newLeft = newLeft;
                        obj.newTop = newTop;
                        obj.newWidth = newWidth;
                        obj.newHeight = newHeight;
                        newArray.push(obj);
                        obj = {};
                    } else if (matchingTop == currentTop) { //确定在正左方
                        newLeft = matchingLeft + matchingWidth;
                        newTop = matchingTop;
                        newWidth = currentLeft - newLeft;
                        if (matchingHeight > currentHeight) {
                            newHeight = currentHeight;
                        } else if (matchingHeight < currentHeight) {
                            newHeight = matchingHeight;
                        } else {
                            newHeight = currentHeight;
                        }

                        obj.newLeft = newLeft;
                        obj.newTop = newTop;
                        obj.newWidth = newWidth;
                        obj.newHeight = newHeight;
                        newArray.push(obj);
                        obj = {};
                    }
                }
            }
        }
        console.log(newArray)

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
