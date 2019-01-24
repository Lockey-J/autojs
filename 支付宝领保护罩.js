//行走积分赛领保护套脚本
var ra = new RootAutomator();
var i =0;
auto();
function GetWalkNum(){

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
            sleep(2000);
            clickZY();
            clickBHZ(); 
            closeXY();
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
           

        }else{
            
            toast("步数不足2万，等待刷新……"+"\n\r当前步数："+bushu);
            ra.swipe(device.width*0.5,device.height*0.2,device.width*0.5,device.height*0.8)
            descContains("我的行走").findOne(5000);
            descContains("今日步数").findOne(5000);
            descContains("运动换卡币").findOne(5000);
            toast("刷新完毕")
            sleep(8000);
            Back();
            sleep(2000)
            EnterSP();            
            toast("已刷新，等待10秒加载……"+pd);
            while(!descContains("今日步数").exists()){
                sleep(500)
            }            
            
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

function EnterSP(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=20000869"    
    });
    toast("准备进入我的行走" );
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

function backtoIndex(){
    var prepackage=currentPackage();
    while(true){
        backfun();
        sleep(500)
        if(prepackage!=currentPackage()){       
            break;               
        }

    }
    sleep(3000);
    ActionZFB();
 
}
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
try {
    log(descContains("立即捐步").findOne(3000).clickable())
} catch (error) {
    log("出错")
}

// unlock();
// sleep(3000)
// GetWalkNum();
// OpenMY();
// i=0;
// device.setBrightnessMode(1);
// ra.exit();
// backtoIndex();

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
