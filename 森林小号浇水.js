
auto();
var sh=new Shell(true);
unlock();
var to="初始";
ActionZFB();
SwapAccmount();
sh.exit();
exit();
toast("浇水结束");
log("浇水结束");
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
            var frompackage=toast.getPackageName();
            if (frompackage=="com.eg.android.AlipayGphone"){
                to=toast.getText();
            }
            log("来之监听："+toast.getText());
        });
    }
      //浇水模块，浇满3次返回
    function Waters(){  
        log("浇水模块")      
        var finishWater=threads.disposable();
        
        waitWater=0;
       
        var OutWater=false;
       
        var thread1= threads.start(beginToast);
        // events.removeAllListeners()
        // var thread1= threads.start(beginToast);
        // thread1.interrupted()
        
        // var thread2=threads.start(function () {
            // toast("点 击 浇 水")
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
                if(selector && !OutWater && descContains("浇水").exists()){
                    
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
    log("进入好友森林并浇水")    
    if(obj){
        while(!descContains("浇水").exists()){
            sleep(2000);
            clickCenter(obj);         
            log("检测是否进入好友蚂蚁森林");
             descContains("浇水").findOne(5000); 
             if(descContains("浇水").exists()){
                 if(descContains("重新加载").exists()){
                    descContains("重新加载").findOne(5000).click();
                 }
                 break;
             }  

        }          
   
    }
    
    if (descContains("浇水").findOne()){
        toast("进 行 浇 水");
        sleep(2000)
        Waters();
    }
}

function closePHB(){
    descContains("关闭").findOne(2000).click()
}

    //直接进入到排行榜
function ScrollPHB(){
    log("直接进入到排行榜")
        app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?saId=10000007&" + "clientVersion=3.7.0.0718&qrcode=" + "https://60000002.h5app.alipay.com/www/listRank.html"
       }));
       log("等待进入排行榜");
       idContains("h5_rl_title").findOne();
       idContains("J_rank_list_more").findOne();
       descMatches(/.*个环保证书/).findOne();
       log("进入蚂蚁森林");
       sleep(1000);

}

//完成账号浇水动作
function FinishWater(){ 
    log("完成账号浇水动作") 
    ScrollPHB();
    sleep(5000);
    var friendName;
    var FriendList=descMatches(/.*个环保证书/).find();
    var FriendLength =FriendList.length;
    log("当前好友数量："+FriendLength);
    if(FriendLength<9){
        for(var i=0;i<FriendLength;i++){
            FriendList=descMatches(/.*个环保证书/).find();
            var obj=FriendList.get(i);
            log(obj);
            friendName=obj.parent().children().get(1).contentDescription
            if(friendName.indexOf("大企鹅")>-1){
                toast("好友黑名单，不浇水");
                continue;
            }else{
                toast("为好友浇水："+obj.parent().children().get(1).contentDescription);
                EnterFriendAnti(obj.parent());            
                sleep(2000);
            }
          
        }
        toast("当前账户浇水完毕");
        closePHB();
        
    }
    else{
        toast("当前账户好友超9个，视为主号")
        closePHB();
    }
    

}
//进入切换账号界面
function MutiAccmount(){
    log("进入切换账号界面")
    
    sh.exec("am start com.eg.android.AlipayGphone/com.alipay.mobile.security.accountmanager.ui.AccountManagerActivity_")
    
    while(true){
        var mpage=currentPackage();
        if(mpage=="com.eg.android.AlipayGphone"){
            log("进入支付宝");
            break;
        }
        else{
            log("没有进入支付宝")
            sleep(1000);
        }
    } 
    log("等待进入")
    textContains("账号切换").findOne();
    textContains("支付宝账号").findOne();
    textContains("换个新账号登录").findOne();
    idContains("item_left_text").findOne();

    var Accmounts=idContains("item_left_text").find();
    log(Accmounts.length)
    return Accmounts.length;

}
//切换账号并浇水
function SwapAccmount(){     
    log("切换账号并浇水")
        var Alength=MutiAccmount();
    for (var i=0;i<Alength-1;i++){        
        var Accmounts=idContains("item_left_text").find();     
        FinishWater();
        while(true){
            var chooseAC=Accmounts.get(Alength-2);
            toast("切换账号："+chooseAC.text());
            log("切换账号："+chooseAC.text())
            clickCenter(chooseAC);
            textContains("首页").findOne(3000);
            if(textContains("首页").exists()){
                break;
            }
            sleep(2000);
        }
        
        if(i<Alength-2){
            MutiAccmount();
            sleep(1000);
        }
        log(i)
        log(Alength)
    }
    threads.shutDownAll();
}
//打开支付宝
function ActionZFB(){
    log("打开支付宝")
    launch("com.eg.android.AlipayGphone");
    
    while(true){
        var mpage=currentPackage();
        if(mpage=="com.eg.android.AlipayGphone"){
            log(currentPackage());
            sleep(2000)
            break;
        }
        else{
            log("啥也没")
            sleep(1000);
        }
    } 
    textContains("首页").findOne(6000);
}
function unlock(){
    do {
        device.wakeUp();
        sleep(1000);
    } while (!device.isScreenOn());
        //滑动屏幕解锁

    let km =context.getSystemService("keyguard");
    if (!km.inKeyguardRestrictedInputMode()) {
    log("屏幕已解锁")

    }else{
        log("解锁屏幕")
        ra.swipe(500,700,200,100,100);
        sleep(1000)
        toast("解锁屏幕")
        sleep(2000); 
    }   
    device.setBrightnessMode(0);
    device.setBrightness(50);

}


