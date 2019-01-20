auto();
var lock = threads.lock();

//点击控件中间位置，兼容6以下root操作跟安卓7以上。
    function clickCenter(obj){
        var rect = obj.bounds();
        var sdkint=device.sdkInt;
        if (sdkint<24){
            return  Tap(rect.centerX(), rect.centerY());
        }
        else{
            return click(rect.centerX(), rect.centerY());
        }
        
      };
      //浇水模块，浇满3次返回
    function Waters(){
        
        var finishWater=threads.disposable();
        log("初始浇水");
        var to="初始";
        waitWater=0
       
        var OutWater=false;
       
        threads.start(function () { 
            events.observeToast();
            events.onToast(function(toast){
                to=toast.getText();
             
            });
        }) ;
        sleep(1000)
        // var thread2=threads.start(function () {
            while(!OutWater){
            var selector=descContains("浇水").findOne(2000);
            if(descContains("浇水").exists()){
                // log(OutWater)
                log(to )
                if (to.indexOf("上限")>-1) {
                    log("检测到上限");          
                    OutWater=true;         
                    finishWater.setAndNotify(1);
                    // thread1.interrupt();

                }
                log(OutWater)
                if(selector && !OutWater){
                    log("点击浇水")
                    clickCenter(selector);
                }
                
                
                sleep(1000);
            }
         
        }
        // });
        var waitWater=finishWater.blockedGet();
        log("线程返回："+waitWater);
        if (waitWater=1) {
           
            // OutWater=false;
            
            // Back();    
            if (to.indexOf("上限")>-1) {        
                descContains("返回").findOne(2000).click();
                to="初始"
            }
            
            // threads.shutDownAll()
        };
           
    };
       

//进入好友森林并浇水
function EnterFriendAnti(obj){
    log(obj)
    
    if(obj){
        sleep(2000);
        clickCenter(obj);         
         log("检测是否进入好友蚂蚁森林");
         descContains("浇水").findOne();        
   
    }
    
    if (descContains("浇水").findOne()){
        log("浇水");
        Waters();
    }
}
function closePHB(){
    descContains("关闭").findOne(2000).click()
}
    //蚂蚁森林首页滑动到排行榜
function ScrollPHB(){
    
        app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?saId=10000007&" + "clientVersion=3.7.0.0718&qrcode=" + "https://60000002.h5app.alipay.com/www/listRank.html"
       }));
       log("等待进入蚂蚁森林");
       idContains("h5_rl_title").findOne();
       idContains("J_rank_list_more").findOne();
       descMatches(/.*个环保证书/).findOne();
       log("进入蚂蚁森林");
       sleep(2000)

}
//打开蚂蚁森林首页
function OpenMY(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=60000002"    
    });
    sleep(2000);
    log("等待进入蚂蚁森林");
    descContains("合种").findOne();
    }


function FinishWater(){
   
    ScrollPHB();
    sleep(5000);
    var FriendList=descMatches(/.*个环保证书/).find();
    var FriendLength =FriendList.length;
    log("当前好友数量："+FriendLength);
    if(FriendLength<5){
        for(var i=0;i<FriendLength;i++){

            FriendList=descMatches(/.*个环保证书/).find();

            var obj=FriendList.get(i)
            log(obj)
            log("好友："+obj.parent().children().get(1).contentDescription);
            EnterFriendAnti(obj.parent());            
            sleep(5000)
        }
        
    }

}


FinishWater();
//  ScrollPHB();

//  log("好友："+descMatches(/.*个环保证书/).find().get(0).parent());
//  closePHB();
    // var FriendList=descMatches(/.*个环保证书/).find()
    // var FriendLength =FriendList.length;
    // FriendList.get(0)
   
    // log(FriendList.length)
    // var sm=textContains("最新动态").findOne(2000)
    // log(sm)

    //ScrollPHB();
    // EnterFriendAnti(FriendList.get(0));
    //clickCenter(NameiCon)
    //console.log(NameiCon.get(2).parent().children().get(0).contentDescription);  
    //clickCenter(FriendList.get(0))
    // Waters();


    //    app.startActivity({        
    //     action: "VIEW",
    //     data: "alipays://platformapi/startapp?appId=68687129"    
    // });
    // var ss=idContains("h5_tv_title").text("好友排行榜").findOne()
    // log(ss)
    // toastLog("进入好友排行榜成功")
    // toastLog("若卡在排行榜无法退出,请点击屏幕右上角");
    // descContains("关闭").findOne().click()
    // log(device.width)
 