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
   syncToSamsung(20000);