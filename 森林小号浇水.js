
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
      //支付宝返回到首页
    function BackZFB(){
        while(!textContains("首页").exists()){
            // closePHB();
            backfun();
            sleep(1500)
        }
    }
//返回按钮，兼容root跟安卓7
    function backfun(){
        var sdkint=device.sdkInt;
        if (sdkint<24){
            return  Back();
        }
        else{
            return back();
        }
    }
    //监听模块
    function beginToast(){
        events.observeToast();
        events.onToast(function(toast){
            to=toast.getText();
         
        });
    }
      //浇水模块，浇满3次返回
    function Waters(){        
        var finishWater=threads.disposable();
        
        waitWater=0;
       
        var OutWater=false;
       
        var thread1= threads.start(beginToast);
     
        // thread1.interrupted()
        sleep(1000);
        // var thread2=threads.start(function () {
            while(!OutWater){
            var selector=descContains("浇水").findOne(2000);
            if(descContains("浇水").exists()){
                // log(OutWater)
                log("捕捉提示:"+to );
                if (to.indexOf("上限")>-1) {
                    log("检测到上限");          
                    OutWater=true;         
                    finishWater.setAndNotify(1);
                    events.removeAllListeners();
                    // threads.shutDownAll();
                    break;

                }
                log("判断是否浇满3次水："+OutWater);
                if(selector && !OutWater){
                    log("点击浇水")
                    log("thread1:"+thread1.isAlive())                
                    clickCenter(selector);
                }                
                sleep(1000);
            }
         
        }
        // });
        var waitWater=finishWater.blockedGet();
        log("线程返回："+waitWater);
        if (waitWater=1) { 
            if (to.indexOf("上限")>-1) {        
                descContains("返回").findOne(2000).click();
                to="初始"
                
            };       
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
        log("进入浇水");
        Waters();
    }
}

function closePHB(){
    descContains("关闭").findOne(2000).click()
}

    //直接进入到排行榜
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
       sleep(1000);

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
            var obj=FriendList.get(i);
            log(obj);
            log("好友："+obj.parent().children().get(1).contentDescription);
            EnterFriendAnti(obj.parent());            
            sleep(2000);
        }
        log("当前账户浇水完毕");
        closePHB();
        
    }

}
auto();
var to="初始";
// Waters();
FinishWater();
// BackZFB()
//var ss=idContains("item_left_text").find().length
//log(ss)

// thread2.stop()

