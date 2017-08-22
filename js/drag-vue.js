var app = new Vue({
    el: '#app',
    data: {
        column: 24,
        row: 12,
        leftMenuStatus: false, //四级菜单的显示与隐藏
        leftSliderIsActive: false,//左侧切换状态
        qlikLeftStatus: false,//qlik菜单的状态
        tableauLeftStatus: false,//tableau菜单的状态
        customLeftStatus: false,//自定义菜单的状态
        qlikFirstData: null,
        qlikSecondData: null,
        qlikThirdData: {},
        showSecondFloor: false,
        loading: true,
        loadingText: ''
    },
    methods: {
        sliderClick: function (event) {

            var clickStatus = event.target.classList.contains('active');
            var clickSliderType = '';
            var sliderItem = event.target.parentNode.children;

            for (var i = 0; i < sliderItem.length; i++) {
                sliderItem[i].classList.remove('active');
            }

            if (clickStatus) {

                this.leftMenuStatus = false;
                this.leftSliderIsActive = true;
                event.target.classList.remove('active');

            } else {

                this.leftSliderIsActive = false;
                this.leftMenuStatus = true;
                event.target.classList.add('active');

                if (event.target.classList.contains('qlik')) {

                    this.qlikLeftStatus = true;
                    this.tableauLeftStatus = false;
                    this.customLeftStatus = false;
                    // this.getQlik('./json/firstFloor.json');
                    if (this.qlikFirstData == null) {
                        this.loadingText = '';
                        var _Uri = encodeURIComponent("http://portal.ebistrategy.com:8030/BigScreen/GetProductList?PorductType=1");
                        this.$http.get('DataServer.ashx?uri=' + _Uri).then((res) => {
                            if (res.body.length == 0) {
                                this.loadingText = '抱歉，没有找到数据！';
                                return;
                            }
                            this.loadingText = '';
                            res.body.forEach(function (element) {
                                element.showFlag = false;
                            });

                            this.qlikFirstData = res.body;
                            console.log(this.qlikFirstData)
                        }, response => {
                            console.log('error')
                        })
                    }
                } else if (event.target.classList.contains('tableau')) {

                    this.qlikLeftStatus = false;
                    this.tableauLeftStatus = true;
                    this.customLeftStatus = false;

                } else if (event.target.classList.contains('custom')) {

                    this.qlikLeftStatus = false;
                    this.tableauLeftStatus = false;
                    this.customLeftStatus = true;
                }
            }


        },
        getSecondData: function ($index, event) {
            var event = event || window.event;

            var PorductID = event.target.dataset.id;

            if (this.qlikSecondData == null) {
                var _Uri = encodeURIComponent("http://portal.ebistrategy.com:8030/BigScreen/GetQlikSenseAppList?PorductID=" + PorductID);

                this.$http.get('DataServer.ashx?uri=' + _Uri).then((res) => {
                    if (res.body.length == 0) {
                        this.loadingText = '抱歉，没有找到数据！'
                        return;
                    }
                    this.loadingText = '';

                    res.body.forEach(function (element, index) {
                        // console.log(element)
                        // this.qlikThirdData[index + 1] = [];
                        element.showFlag = false;
                    });
                    this.qlikSecondData = res.body;
                    console.log(this.qlikSecondData)
                }, response => {
                    console.log('error')
                })
            }
            this.qlikFirstData[$index].showFlag = !this.qlikFirstData[$index].showFlag;
        },
        // 点击的时候传一个index过来
        //根据index去找相对应的data，或者请求到的data存到对象上，以index为key，data为val
        getThirdData: function ($index, event) {
            
            var event = event || window.event;
            this.loadingText = '';
            if(this.qlikThirdData[$index] == undefined){
                this.qlikThirdData[$index] = null;                
            }
           
            if(this.qlikThirdData[$index] == null) {
          
                var PorductID = event.target.dataset.productId;
                var appId = event.target.dataset.id;
                var  _Uri = encodeURIComponent("http://portal.ebistrategy.com:8030/BigScreen/GetQlikSenseSheetList?PorductID=" + PorductID + "&AppId=" + appId);
                
                this.$http.get('DataServer.ashx?uri=' + _Uri).then((res) => {
                    if (res.body.length == 0) {
                        this.loadingText = '抱歉，没有找到数据！'
                        return
                    }
                    this.loadingText = '';

                    res.body.forEach(function (element) {
                        element.showFlag = false;
                    });
                    this.qlikThirdData[$index] = res.body;
                    console.log(this.qlikThirdData[$index])
                }, response => {
                    console.log('error')
                }).then(function(){
                    this.getThirdData($index, event);                    
                })
            }else {
                this.qlikSecondData[$index].showFlag = !this.qlikSecondData[$index].showFlag;
            }
            return this.qlikThirdData[$index]
            // this.qlikSecondData.forEach(function (element) {
            //     element.showFlag = false;
            // }); 
        },
        getFouthData: function( $index, event){
            if(event.target.classList.contains('iconfont')){
                event.target.classList.add('icons-down');
                event.target.classList.remove('icons-right');
            }

            var PorductID = event.target.dataset.productId;
            var appId = event.target.dataset.appId;
            var sheetId = event.target.dataset.id;
            var _Uri = encodeURIComponent("http://portal.ebistrategy.com:8030/BigScreen/GetQlikSenseObjectList?PorductID=" + PorductID + "&AppId=" + appId + "&SheetId=" + sheetId);
            
            this.$http.get('DataServer.ashx?uri=' + _Uri).then((res) => {
                if (res.body.length == 0) {
                    this.loadingText = '抱歉，没有找到数据！'
                    return
                }
                this.loadingText = '';
                console.log(res);


            }, response => {
                console.log('error')
            })

        }
    }
})