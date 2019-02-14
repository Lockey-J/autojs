//行走积分赛领保护套脚本
var ra = new RootAutomator();
var sh = new Shell(true);
var i =0;
auto();
auto.waitFor();
unlock();
sleep(3000);
syncToSamsung(20000);
GetWalkNum();
// OpenMY();
i=0;
device.setBrightnessMode(1);
backtoIndex();
sh.exit();
ra.exit();
//三星健康刷步数
function syncToSamsung(counts){
    var sjs=Math.round(Math.random()*2000)
    counts=counts+sjs
     log("三星主页")
    launch("com.sec.android.app.shealth");
    sleep(2000)
      descContains("主页").findOne(8000);
    
      sleep(2000)
      launch("com.samsung.android.app.health.dataviewer");
     textContains("三星健康步数管理").waitFor();
     sleep(1000);
     while(true){
        var totalCount=idContains("total_step_count").findOne().text()
        if (totalCount==""){
            toast("等待链接数据库");
            sleep(2000);           
        }else{
            break;
        }
     }
 
      var re=counts
      while(1){
         if(re<11900){
           idContains("floatingActionButton").findOne().click()

        textContains("自定义增加步数"). findOne(). parent(). parent().click()
           sleep(200);
           setText(0,re);
           sleep(1000);
           idContains("button1").findOne().click();
          sleep(300);
           break;}
         else{
           idContains("floatingActionButton").findOne().click()
           textContains("自定义增加步数"). findOne(). parent(). parent().click()
           sleep(200);
           setText(0,11900);
           sleep(1000);
           idContains("button1").findOne().click();
           re=re-11900;
           sleep(300);
         }
      }
     
      sleep(500);
      
   //   click("三星健康",0)
   launch("com.sec.android.app.shealth");//三星健康
      log("等待三星主页")
      descContains("主页").findOne(8000);
      sleep(2000);
      log("id/circle_graph")
      idContains("id/circle_graph").findOne().parent().parent().parent().click();
      sleep(1000);
      log("wearable_information_button")
      idContains("wearable_information_button"). findOne().click()
      sleep(1000)
      descContains("三星健康步数管理").findOne().click()
      sleep(1000);
      idContains("wearable_information_button"). findOne().click()
      sleep(1000)
      descContains("今日步数").findOne().click()
      sleep(1000);
      Back();
      var count=idContains("id/value").findOne(8000).text();
   
      console.log("当前步数："+count)
   
      launch("com.samsung.android.app.health.dataviewer");
      textContains("三星健康步数管理").waitFor();
      console.log("进入三星管理")
      sleep(3000);
      //
      //sleep(1000);
      //descContains("总步数").findOne().click();
     // sleep(3000);
      var current_steps=idContains("total_step_count").findOne().text();
      console.log("当前三星管理步数："+count)
      if(current_steps>=counts) toastLog("三星健康步数为"+current_steps+",同步成功")
      else{console.error("三星健康步数为"+current_steps+",同步失败,请重试")}
    //  console.show();
      sleep(1000)  
        
        sh.exec("am force-stop com.sec.android.app.shealth");
        sleep(1000);
        sh.exec("am force-stop com.samsung.android.app.health.dataviewer");
        sleep(1000);
        
        Home();    
        sleep(2000);
   };
//刷新步数方法
function GetWalkNum(){
    var layouttime=40*60*1000;
    var intCount=0;
    EnterSP();
    
    sleep(3000);

    do {  
        console.log("计算数步");
    
        if(idContains("J-Num").exists()){
            console.log("J-Num存在");
            var bushu=idContains("J-Num").findOne().desc();
            var ss=bushu.replace(/,/,"");
            var pd=ss-20000;
        }
                   
        if (pd>=0 ){
       
            i++;
            console.log("步数超过2万，打开行走积分赛");
            toast("步数超过2万，打开行走积分赛");
            app.startActivity({        
                action: "VIEW",
                data: "alipays://platformapi/startapp?appId=68687129"    
            });
            toast("进入行走积分赛")
            while( !descContains("行走积分赛").exists()){
                sleep(300);
            }   
            while(descContains("加载中").exists()){
                sleep(300);
            } 
            sleep(1500);
            closeFram();
            clickZY();
            clickBHZ(); 
            closeFram()
            sleep(2000);
            clickZY();
            clickBHZ(); 
            sleep(2000);
            var stats= true;
            while(stats){      
                console.log("检测是否进入行走积分赛参赛须知");
                stats=closeXY();  
                if(stats){
                    clickBHZ(); 
                    clickZY();                    
                    sleep(2000);
                }                
            }
            ZFBJP();
            JFSBM();
            sleep(3000);           

        }else{
            intCount++;
            if(intCount>10){
                toast("同步不成功，40分钟后重试")
                sleep(layouttime);
                syncToSamsung(1);

            }
            toast("步数不足2万，等待刷新……"+"\n\r当前步数："+bushu);
            ra.swipe(device.width*0.5,device.height*0.2,device.width*0.5,device.height*0.8)
            descContains("我的行走").findOne(5000);
            descContains("今日步数").findOne(5000);
            descContains("运动换卡币").findOne(5000);
            toast("已刷新，等待8秒加载……"+pd);
            sleep(8000);
            Back();
            sleep(2000)
            EnterSP();            
            
            while(!descContains("今日步数").exists()){
                sleep(500)
            }            
            
        }
    } while (pd<0); 
}
//屏幕解锁
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
        ra.swipe(device.width*0.5,device.height*0.8,device.width*0.5,device.height*0.2)
        sleep(1000)
        toast("解锁屏幕")
        sleep(2000);    
   
    
    }    
    device.setBrightnessMode(0);
    device.setBrightness(0);
}
//检测有无比赛须知
function closeXY(){
    if(desc("返回").exists() && descContains("行走积分赛参赛须知").exists()){
        descContains("返回").findOne().click();
        console.log("进入比赛须知")
        sleep(1000);
        return true;
    };
    return false;
}


function closeFram(){
    if(descContains("关闭").exists()){
        descContains("关闭").findOne().click();
    };
    sleep(1000);
}
//点击蚂蚁庄园
function clickZY(){
    closeFram();
    var swith=parseInt(device.width*0.287);
    var sheight=parseInt(device.height*0.387);
    ra.press(swith, sheight, 80)    
    toast("屏幕分辨率：("+device.width+","+device.height + ")\r\n      点击：" + "(" +swith +","+sheight+")");
    sleep(2000);
    if (descContains("蚂蚁庄园加速卡").exists() && descContains("立即领取").exists()){
        descContains("立即领取").findOne().click();
        sleep(2000);
    }
}
//点击保护罩
function clickBHZ(){
    closeFram();
    var swith=parseInt(device.width*0.275);
    var sheight=parseInt(device.height*0.545);
    ra.press(swith, sheight, 80)

    toast("屏幕分辨率：("+device.width+","+device.height + ")\r\n      点击：" + "(" +swith +","+sheight+")");
    sleep(2000);
    closeFram();
    i=0;
}
//打开蚂蚁森林
function OpenMY(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=60000002"    
    });
}
//进入支付宝运动
function EnterSP(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=20000869"    
    });
    toast("准备进入我的行走" );
    sleep(2000);
    // log(descContains("加载中").findOne())
 
    log("等待加载")
    descContains("我的行走").findOne(5000);
    descContains("今日步数").findOne(5000);
    descContains("运动换卡币").findOne(5000);
    toast("已进入我的行走");
    sleep(3000);
    
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
//退出支付宝到首页
function backtoIndex(){
    var prepackage=currentPackage();
    while(true){
        backfun();
        sleep(800)
        if(prepackage!=currentPackage()){       
            break;               
        }

    }
    sleep(6000);
    ActionZFB();
 
}
//启动支付宝
function ActionZFB(){
    launch("com.eg.android.AlipayGphone");
    while(true){
        var mpage=currentPackage();
        if(mpage=="com.eg.android.AlipayGphone"){
        
            break;
        }
        else{
            sleep(1000);
        }
    } 
}
function ZFBJP(){
    EnterSP();
    try {
        var jpBtn=descContains("立即捐步").findOne(3000)
        jpBtn.click();
        descContains("即将捐出").findOne(5000);
        descContains("确定").idContains("J-confirmExchangeBtn").click();
        descContains("本次捐步").findOne(5000);
        
    } catch (error) {
        return;
    }
}

//报名行走积分赛
function JFSBM(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=68687129"    
    });
    toast("进入行走积分赛")
    while( !descContains("行走积分赛").exists()){
        sleep(300);
    }   
    while(descContains("加载中").exists()){
        sleep(300);
    } 
    descContains("达标人数").findOne(8000)
    if(descContains("已报名").exists()){
        log("已报名")
        return;
    }
    descContains("报名明日比赛").clickable().findOne(3000).click()
    descContains("立即使用积分报名").findOne(3000)
    descContains("行走积分赛报名").findOne(3000)
    descContains("报名参赛").findOne(3000)
    descContains("立即使用积分报名").clickable().findOne(3000).click()
    textContains("确认报名").idContains("ensure").findOne(3000)
    textContains("确认报名").idContains("ensure").findOne(3000).click()
}
