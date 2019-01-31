
// launch("com.samsung.android.app.health.dataviewer");
// textContains("三星健康步数管理").waitFor();
// var ss=idContains("total_step_count").findOne().text()
// if (ss==""){
   
// }
// log(idContains("total_step_count").findOne().text())

var sh=new Shell(true)
sh.exec("am start com.eg.android.AlipayGphone/com.alipay.mobile.nebulacore.ui.H5Activity")
sh.exitAndWaitFor();

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
