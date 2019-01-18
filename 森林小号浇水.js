//点击控件中间位置
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
      function Waters(){
        var finishWater=threads.disposable();

        var to="初始";
        var OutWater=false;
        var thread1=threads.start(function () { events.observeToast();
            events.onToast(function(toast){
                to=toast.getText();
                if (to.indexOf("上限")>-1) {
                    OutWater=true;
                    finishWater.setAndNotify(1)
                    thread1.interrupt();

                }
            });
        }) ;
        threads.start(function () {while(thread1.isAlive()){
            var selector=descContains("浇水").findOne(2000);
            
            // log(OutWater)
            // log(selector && !OutWater)
            if(selector && !OutWater){
                clickCenter(selector)
            }
        
            sleep(1500);
        }
    })
        var waitWater=finishWater.blockedGet();
        if (waitWater=1) {
            //Back();
            threads.shutDownAll();
            descContains("返回").findOne(2000).click();
        }
    }

function EnterFriendAnti(obj){
    log(obj)
    
    if(obj){
        clickCenter(obj)
        sleep(2000)
        while(descContains("稍等片刻").exists()){
            var czjz=descContains("重新加载").findOne(2000)
            if(czjz){
                czjz.click();
            }
            log("检测等待字体")
            sleep(2000)
        }

    }
    while(!descContains("浇水").exists()){
        sleep(1000)
    }
    if (descContains("浇水").exists()){
        log("浇水")
        Waters();
    }
}

    var FriendList=descMatches(/.*个环保证书/).find()
    var FriendLength =FriendList.length;
    FriendList.get(0)
   
    // log(FriendList.length)
    var sm=textContains("最新动态").findOne(2000)
    log(sm)
    Swipe(sm.bounds().centerX(),sm.bounds().centerY(),sm.bounds().centerX(),sm.bounds().centerY()*0.3,1000)
    // EnterFriendAnti(FriendList.get(0));
    //clickCenter(NameiCon)
    //console.log(NameiCon.get(2).parent().children().get(0).contentDescription);  
    //clickCenter(FriendList.get(0))
    //Waters();
