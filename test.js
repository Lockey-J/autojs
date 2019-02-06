
var ra = new RootAutomator();
//启用触摸监听
auto();
// threads.start(function(){
//     events.observeTouch();
//     //注册触摸监听器
//     events.onTouch(function(p){
//         //触摸事件发生时, 打印出触摸的点的坐标
//         log(p.x + ", " + p.y);
//     });
// })
// clickZY();
clickBHZ();
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




// launch("com.samsung.android.app.health.dataviewer");
// textContains("三星健康步数管理").waitFor();
// var ss=idContains("total_step_count").findOne().text()
// if (ss==""){
   
// }
// log(idContains("total_step_count").findOne().text())

// var sh=new Shell(true)
// sh.exec("am start com.eg.android.AlipayGphone/com.alipay.mobile.nebulacore.ui.H5Activity")
// sh.exitAndWaitFor();

// var sh = new Shell(true);
// sh.exec("svc wifi disenable")
// sh.exit();


// auto();
// importClass('java.net.Inet4Address');
// importClass('java.net.InetAddress');
// importClass('java.net.NetworkInterface');
// importClass('java.util.Enumeration');
// importClass('java.net.Inet6Address');
// //获取内网IP地址
// var hostIp = null;
// try{
//     var nis = NetworkInterface.getNetworkInterfaces();
//     var ia = null;
//     while (nis.hasMoreElements()) {
//         var ni = nis.nextElement();
//         var ias = ni.getInetAddresses();
//         while (ias.hasMoreElements()) {  
//             ia = ias.nextElement();  
//             if (ia instanceof Inet6Address) {
//                 continue;
//             }
//             var ip = ia.getHostAddress();
//             if (!"127.0.0.1".equals(ip)) {
//                 hostIp = ia.getHostAddress();
//                 break;
//             }
//         }
//     }
// } catch (e) {
//     log(e);
// }
// log(hostIp);
