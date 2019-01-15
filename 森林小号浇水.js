//function clickCenter(obj){
    function clickCenter(obj){
        var rect = obj.bounds();

        return click(rect.centerX(), rect.centerY());
      }
         
      threads.start(function () { events.observeToast();
        events.onToast(function(toast){
            to=toast.getText()
        });
    }) 