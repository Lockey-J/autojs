//行走积分赛领保护套脚本
var ra = new RootAutomator();
var i =0;
auto();
function GetWalkNum(){

    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=20000869"    
    });
    toast("打开我的行走" );
    sleep(3000);
    while( !descContains("我的行走").exists()){
        sleep(300);
    }
    while( !descContains("今日步数").exists()){
        sleep(300);
        console.log("今日步数");
    }
    toast("已进入我的行走");
    
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
            sleep(1000);
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
           

        }else{
            
            toast("步数不足2万，等待刷新……"+"\n\r当前步数："+bushu);
            ra.swipe(device.width*0.5,device.height*0.2,device.width*0.5,device.height*0.8)
            toast("已刷新，等待10秒加载……"+pd);
            while(textContains("今日步数").exists()){
                sleep(500)
            }            
            sleep(10000);
        }
    } while (pd<0); 
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
        ra.swipe(device.width*0.5,device.height*0.8,device.width*0.5,device.height*0.2)
        sleep(1000)
        toast("解锁屏幕")
        sleep(2000);    
   
    
    }
    device.keepScreenDim();
    device.setBrightnessMode(0);
    device.setBrightness(0);

}
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

function clickZY(){
    closeFram();
    var swith=parseInt(device.width*0.233);
    var sheight=parseInt(device.height*0.374);
    ra.press(swith, sheight, 80)    
    toast("屏幕分辨率：("+device.width+","+device.height + ")\r\n      点击：" + "(" +swith +","+sheight+")");
    sleep(2000);
    if (descContains("蚂蚁庄园加速卡").exists() && descContains("立即领取").exists()){
        descContains("立即领取").findOne().click();
        sleep(2000);
    }
}

function clickBHZ(){
    closeFram();
    var swith=parseInt(device.width*0.415);
    var sheight=parseInt(device.height*0.545);
    ra.press(swith, sheight, 80)

    toast("屏幕分辨率：("+device.width+","+device.height + ")\r\n      点击：" + "(" +swith +","+sheight+")");
    sleep(2000);
    closeFram();
    i=0;
}

function OpenMY(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=60000002"    
    });
}
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
     sleep(1000)
 
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
        var sh = new Shell(true);
        sh.exec("am force-stop com.sec.android.app.shealth");
        sleep(1000);
        sh.exec("am force-stop com.samsung.android.app.health.dataviewer");
        sleep(1000);
        sh.exit;
      Home();    
     sleep(2000);
   }
unlock();
syncToSamsung(20000)
sleep(3000)
GetWalkNum();
OpenMY();
i=0;
device.setBrightnessMode(1);
ra.exit();