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
            descContains("返回").findOne(2000).click();
        }
    }

    var NameiCon=descMatches(/.*个环保证书/).find()
    //var Namei=NameiCon.contentDescription 
    //clickCenter(NameiCon.get(0))。
    console.log(NameiCon.get(0).parent().children().length);
    //log(Namei)
    
    //Waters();
