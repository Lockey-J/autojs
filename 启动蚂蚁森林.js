function OpenMY(){
    app.startActivity({        
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=60000002"    
    });
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
    device.keepScreenDim();
    device.setBrightnessMode(0);
    device.setBrightness(50);

}
function CloseZFB(){
    var sh = new Shell(true);
    sh.exec("am force-stop com.eg.android.AlipayGphone");
    sleep(2000);
    sh.exit;
}
auto();
unlock();
CloseZFB();
OpenMY();