"ui";
//storages.remove("syn_steps")

var storage = storages.create("syn_steps")
var config_syn_steps = storage.get("config_syn_steps", {})

var config = {}
var Accounts2=[]
var dir = "/sdcard/antForest蚂蚁森林/config_syn_steps.js"
var timeout=180000
var stepsMin = 18000
var date = new Date();
var now = date.getTime();
var sdkversion=device.sdkInt;
console.setGlobalLogConfig({
    file: "/sdcard/antForest蚂蚁森林/自动同步日志.txt"
});

log("================================================================================");
var date = new Date();
log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "自动同步运行日志")

    config_syn_steps.numOfAccounts = 100

if (!config_syn_steps.accounts_list) {
    init_from_file()
}
//config_syn_steps.numOfAccounts = 200
//console.log("账号个数"+config_syn_steps.numOfAccounts );

accounts_list_adjust(config_syn_steps)
show_syn_steps(config_syn_steps)

function accounts_list_generation(config, config_syn_steps) {
    var accounts_list = []
    let numOfAccounts = config_syn_steps.numOfAccounts
    //生成accounts_list
    if (config.options) {
        let options = config.options
        for (let i = 0; i < numOfAccounts; i++) {
            if (options["account" + (i + 1)]) {
                let account = { account: options["account" + (i + 1)], password: options["password" + (i + 1)] }
                let remark = options["remark" + (i + 1)]
                // log(remark)
                account.remark = remark ? remark : ""
                account.order = i + 1
                accounts_list.push(account)
            }
            else {
                let account = { account: "", password: "", remark: "", order: i + 1 }
                accounts_list.push(account)
            }
        }

    } else {
        for (let i = 0; i < numOfAccounts; i++) {
            let account = { account: "", password: "", remark: "", order: i + 1 }
            accounts_list.push(account)
        }
    }
    config_syn_steps.accounts_list = accounts_list
}

//log(files.isFile("/sdcard/alipay/蚂蚁森林/config_syn_steps.js"))
function init_from_file() {
    if (files.isFile(dir)) {
        try {
            var str = uncompile(open(dir).read(), 11)
            let config_syn_steps_file = eval('(' + str + ')')
            let imei_file = config_syn_steps_file.imei ? config_syn_steps_file.imei : "imei"
            if (imei_file == device.getIMEI()) {
                config_syn_steps = config_syn_steps_file
            }
            else {
                config_syn_steps.accounts_list = config_syn_steps_file.accounts_list
                accounts_list_adjust(config_syn_steps)
            }
            let accounts_list = config_syn_steps.accounts_list
            ui.list.setDataSource(accounts_list);
            saveConfig(dir);
            toastLog("导入数据成功")
        }
        catch (err) {
            log("读取配置文件出错" + err)
        }  
    
    } else {
        if (files.isFile("/sdcard/alipay/multimedia/config3.js")) {
            try {
                let str = uncompile(open("/sdcard/alipay/multimedia/config3.js").read(), 0)
                eval(str)
                // console.log(config);
            }
            catch (err) {
                log("读取配置文件出错" + err)
            }
        } else if (files.isFile("/sdcard/alipay/multimedia/config.js")) {
            try {
                let str = uncompile(open("/sdcard/alipay/multimedia/config.js").read(), 0)
                eval(str)
            } catch (error) {
                log("读取配置文件出错" + err)
            }
        }
        var accounts_list = []
        //log(config0.options)
       // config_syn_steps.numOfAccounts = config.numOfAccounts ? config.numOfAccounts : 50
        let numOfAccounts =config_syn_steps.numOfAccounts
        //生成accounts_list
        if (config.options) {
            let options = config.options
            for (let i = 0; i < numOfAccounts; i++) {
                if (options["account" + (i + 1)]) {
                    let account = { account: options["account" + (i + 1)], password: options["password" + (i + 1)] }
                    let remark = options["remark" + (i + 1)]
                    // log(remark)
                    account.remark = remark ? remark : ""
                    account.order = i + 1
                    accounts_list.push(account)
                }
                else {
                    let account = { account: "", password: "", remark: "", order: i + 1 }
                    accounts_list.push(account)
                }
            }

        } else {
            for (let i = 0; i < numOfAccounts; i++) {
                let account = { account: "", password: "", remark: "", order: i + 1 }
                accounts_list.push(account)
            }
        }
       // log(accounts_list.length)
        config_syn_steps.accounts_list = accounts_list
    }
}

function accounts_list_adjust(config_syn_steps) {
    let len = config_syn_steps.accounts_list.length
    let numOfAccounts = config_syn_steps.numOfAccounts
    if (len < numOfAccounts) {
        for (let i = len; i < numOfAccounts; i++) {
            let account = { account: "", password: "", remark: "", order: i + 1 }
            config_syn_steps.accounts_list.push(account)
        }
    }
    if (len > numOfAccounts) {
        config_syn_steps.accounts_list = config_syn_steps.accounts_list.slice(0, numOfAccounts)
    }

}

//log(config_syn_steps.accounts_list)



//生成remark_list
function remark_list_update(config_syn_steps) {
    let accounts_list = config_syn_steps.accounts_list
    var len = accounts_list.length
    var row = len % 5 == 0 ? len / 5 : (Math.floor(len / 5) + 1)
    var remark_list = []
    var remark_dict = { "remark1": "1", "remark2": "1", "remark3": "1", "remark4": "1", "remark5": "1" }
    for (let i = 0; i < row; i++) {
        //let remark_list = { "remark1": "1", "remark2": "1", "remark3": "1", "remark4": "1", "remark5": "1" }
        var b = Object.assign({}, remark_dict)
        for (let j = 0; j < 5; j++) {
            if (i * 5 + j + 1 < len) {
                let remark = accounts_list[i * 5 + j].remark
                if (remark && remark != " ") {
                    b["remark" + (j + 1)] = remark
                }
                else {
                    b["remark" + (j + 1)] = (i * 5 + j + 1)
                }
            }
            else {
                b["remark" + (j + 1)] = (i * 5 + j + 1)
            }
        }
        remark_list.push(b)
    }
    return (remark_list)
}

function show_syn_steps(config_syn_steps) {
    ui.layout(
        <drawer id="drawer">
            <vertical>
                <appbar >
                    <toolbar id="toolbar" title="自动同步" h="32" />
                    <tabs id="tabs" />
                </appbar>
                <viewpager id="viewpager" layout_weight="0.75" h="18">
                    <frame>
                        <vertical>  
                        <vertical layout_weight="0.8">           
                            <horizontal>
                                <text h="*" gravity="right|center" size="14" margin="8">  1.从第</text>
                                <input id="startAccount" inputType="number"  />
                                <text h="*" gravity="right|center" size="14">个账号开始，到第</text>
                                <input id="endAccount" inputType="number"  />
                                <text h="*" gravity="right|center" size="14">个账号结束</text>
                            </horizontal>

                            <horizontal>
                                <text textSize="14sp" margin="8">2. 请选择同步刷新方式</text>
                                <spinner id="sp2" entries="      返回重进|      下拉刷新" />
                            </horizontal>

                            <text textSize="14sp" margin="8">3. 同步方式</text>
                            <spinner id="sp3" entries="     自动打开vxp里面的支付宝|     自动打开原始支付宝|     小米摇步专用" />

                            <horizontal>
                                <text textSize="14sp" margin="8">4. 请选择打开运动的方式</text>
                                <spinner id="sp4" entries="      方式A|      方式B" />
                            </horizontal>
                            <horizontal>
                                <text textSize="14sp" margin="8">5. 每次同步时在运动等待时间</text>
                                <spinner id="sp5" entries="        3秒|        5秒|        8秒|        13秒|        21秒|        34秒" />
                            </horizontal>
                            <horizontal>
                                <text textSize="14sp" margin="8">6. 重试次数</text>
                                <spinner id="sp6" entries="        4秒|        6秒|        9秒" />
                            </horizontal>
                            <horizontal>
                                <text textSize="14sp" margin="8">7. 是否自动捐步</text>
                                <spinner id="sp7" entries="        否        |        是       " />
                            </horizontal>

                            
                            </vertical>
                        
                        <linear gravity="center" >
                            <button id="start" text="开始同步" h="60" w="300" />
                        </linear>
                            </vertical>
                    </frame>

                    <frame>
                        <vertical>
                            <list id="list" marginLeft="12" marginRight="10" layout_weight="0.8" >

                                <vertical >
                                    <horizontal>
                                        <text textSize="16sp" textColor="#000000" text="{{this.order}}. " /><text id="name" textSize="16sp" textColor="#000000" text="请输入账号{{this.order}}的信息" />
                                    </horizontal>
                                    <horizontal>
                                        <text textSize="16sp" marginLeft="16" textColor="#000000" gravity="right|center" text="账号" />
                                        <input id="account" hint="请输入账号(必填)" w="220" text="{{this.account}}" />
                                    </horizontal>
                                    <horizontal>
                                        <text textSize="16sp" marginLeft="16" textColor="#000000" gravity="right|center" text="密码" />
                                        <input id="password" hint="请输入密码(必填)" password="true" w="220" text="{{this.password}}" />
                                    </horizontal>
                                    <horizontal>
                                        <text textSize="16sp" marginLeft="16" textColor="#000000" gravity="right|center" text="备注" />
                                        <input id="remark" hint="请输入备注(选填)" w="220" text="{{this.remark}}" />
                                    </horizontal>
                                    <button id="confirm" text="无需确认" style="Widget.AppCompat.Button" />
                                </vertical>
                            </list>
                            <horizontal gravity="center" >
                                <button id="save" text="保存配置到文件" w="250" />
                            </horizontal>
                        </vertical>
                    </frame>
                    <frame>
                        <vertical >
                            <text id="page3" text="第三页内容" textColor="#000000" textSize="16sp" />

                
                            <horizontal gravity="center">
                                <button id="viewlog" text="查看日志" />
                                <button id="clear_log" text="清除日志" />
                                <button id="clear" text="清除支付宝缓存" w="150" />
                            </horizontal>
                        </vertical>
                    </frame>
                </viewpager>
            </vertical>
        </drawer>
    );
    activity.setSupportActionBar(ui.toolbar);
    ui.page3.text("每填写或者修改一个账号时，请点击其下方对应的确认按钮，填写或修改完毕再点击最下方的“保存配置到文件”按钮")

    //设置滑动页面的标题
    ui.viewpager.setTitles(["同步设置", "录入信息", "使用帮助"]);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);
    //初始化界面
   let accounts_list = config_syn_steps.accounts_list


    ui.list.setDataSource(accounts_list);
    //ui.button_list.setDataSource(remark_list);

    //页面2
    ui.list.on("item_click", function (item, i, itemView, listView) {
        toast("被点击的账号密码为: " + item.password);
    });

    ui.list.on("item_bind", function (itemView, itemHolder) {
        //绑定勾选框事件
        itemView.confirm.on("click", function () {
            let item = itemHolder.item;
            item.account = itemView.account.text()
            item.password = itemView.password.text()
            item.remark = itemView.remark.text()
            itemView.confirm.text("已确认修改")
            //  itemView.confirm.attr("style","Widget.AppCompat.Button.Colored")
            toast("密码为:" + itemView.password.text())
            config_syn_steps.accounts_list = accounts_list
            remark_list = remark_list_update(config_syn_steps)
            storage.put("config_syn_steps", config_syn_steps)
        });
        itemView.password.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.account.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.remark.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        //  config_syn_steps.accounts_list=accounts_list
    });

    var initForm2 = function () {
        let startAccount = config_syn_steps.startAccount ? config_syn_steps.startAccount:1

        let endAccount = config_syn_steps.endAccount ? config_syn_steps.endAccount : config_syn_steps.numOfAccounts
        ui.startAccount.text(startAccount + "");
        ui.endAccount.text(endAccount + "");
        if (!config_syn_steps.buttons){
            config_syn_steps.buttons={}
        }
        for (let i = 2; i < 8; i++) {
            let sel = config_syn_steps.buttons["sel" + i] ? config_syn_steps.buttons["sel" + i]:0
            ui["sp"+i].setSelection(sel)
        }
    };
    initForm2()

    ui.start.click(() => {
        toastLog("开始同步")
        config_syn_steps.startAccount = Math.max(1, ui.startAccount.text());
        config_syn_steps.endAccount = Math.min(ui.endAccount.text(),accounts_list.length);
      //  config_syn_steps.buttons={}
        for (let i = 2; i < 8; i++) {
            config_syn_steps.buttons["sel" + i] = ui["sp"+i].getSelectedItemPosition()          
        }
       // log(config_syn_steps.buttons)
        storage.put("config_syn_steps", config_syn_steps)
        threads.shutDownAll()
        threads.start(function () {
            work(config_syn_steps)
        })
    })

     ui.save.click(function () {
       // ui.button_list.setDataSource(remark_list);
        saveConfig(dir)
    })



    ui.viewlog.click(()=>{
        if (files.isFile("/sdcard/antForest蚂蚁森林/自动同步日志.txt")){
            app.viewFile("/sdcard/antForest蚂蚁森林/自动同步日志.txt");
        }
        else{
            toastLog("没有日志文件")
        }  
    })
    ui.clear_log.click(() => {
        confirm("确定清除历史日志?").then(value => {
            if (value) {
                files.remove("/sdcard/antForest蚂蚁森林/自动同步日志.txt")
                toastLog("清除日志成功")
            }
        })
    })
    ui.clear.click(() => {
        app.openAppSetting("com.eg.android.AlipayGphone")
        toastLog("请手动清除支付宝全部数据,然后手动登录一个账号")
    })

}

function saveConfig(dir) {
    //config_syn_steps.sp1 = ui.sp1.getSelectedItemPosition()
    storage.put("config_syn_steps", config_syn_steps)
    let str = JSON.stringify(config_syn_steps)
    //log(config_syn_steps.remark_list)
    try {
        files.ensureDir(dir)
        var file = open(dir, "w");
        file.write(compile(str, 11));
        file.close();
        toastLog("保存设置成功")
    }
    catch (err) {
        console.log("错误" + err);
        toastLog("保存设置到文件失败")
    }
}
function compile(code, num) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1) + num);
    }
    return (escape(c))
}

function uncompile(code, num) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1) - num);
    }
    return c;
}


///函数部分
function work(config_syn_steps) {

    let buttons = config_syn_steps.buttons
  //  log(buttons)
    console.show()
   // console.log(config_syn_steps);
    let startAccount = config_syn_steps.startAccount 
    let endAccount = config_syn_steps.endAccount
    let Accounts = config_syn_steps.accounts_list.slice(startAccount-1,endAccount)
   // log(Accounts)
    auto.waitFor()
    work_pre(); //登陆vxp
    console.setPosition(0,device.height/2);
    let sel3 = config_syn_steps.buttons.sel3  
    if(sel3==2){
        syn_steps_xiaomi(Accounts)
    }
    else{
        syn_steps_accounts(Accounts);
        if (Accounts2.length > 0) {
            log("=============================")
            log("正在重试失败的账号...")
            syn_steps_accounts(Accounts2);
        }
    }
    app.startActivity("console");
}
function work_pre() {
    let sel3 = config_syn_steps.buttons.sel3
   // console.log(sel3);  
    if (sel3 == 0) {
        appName = "io.va.exposed";
        launch(appName);
        sleep(500)
        textContains("支付宝").waitFor();
        sleep(200)
        click("支付宝");
    }
}

function syn_steps_xiaomi(Accounts) {
    let sel3 = config_syn_steps.buttons.sel3
    for (let kk = 0; kk < Accounts.length; kk++) {
        account = Accounts[kk]
        switchAccount(account.account, account.password, 1);
        log("已成功登录到第" + account.order + "个账号")
        let obj=textMatches(/.*(步数排行榜更新了|快去捐步).*/).findOne(8000)
        if(obj){
            let obj_time =obj.parent().child(2) 
           // log(obj_time)
            let time_text = obj_time ? obj_time.text():"未找到时间"
            if (time_text.indexOf("刚刚") > -1 || time_text.indexOf("分钟") > -1){
                toastLog("步数刷新成功")
            }
            else if (time_text.indexOf("小时") > -1){
                time_hours = parseInt(time_text)
                let data=new Date()
                let h=data.getHours()
                if (time_hours<h){
                    toastLog("步数刷新成功")
                }
            }
            else{
                console.error("步数刷新可能失败，请检查")
            }      
        }
        else {
            console.error("步数刷新可能失败，请检查")
        }     
    }
}

function syn_steps_accounts(Accounts) {
    //let sel3 = config_syn_steps.buttons.sel3
    for (let kk = 0; kk <Accounts.length; kk++) {
        account = Accounts[kk]       
        switchAccount(account.account, account.password, 1);
        log("已成功登录到第" + account.order+ "个账号")
        let steps_real=syncToAlipay();
        //log("steps_real"+steps_real)
        if (steps_real< stepsMin) {
            try {
                if (Accounts2.indexOf(account) < 0) {
                    Accounts2.push(account)
                    log("支付宝步数为" + steps_real + ",同步失败,已添加到重试名单")
                }
                else {
                    console.error("支付宝步数为" + steps_real + ",同步失败,请稍后重试")
                }               
            
            } catch (error) {
                console.log(error);               
            }
        }
    }
}


function syncToAlipay() {
    let sel3=config_syn_steps.buttons.sel3
    let sel2 = config_syn_steps.buttons.sel2
    let sel4 = config_syn_steps.buttons.sel4
   // log("sel2="+sel2)
    let sel5 = config_syn_steps.buttons.sel5
    let trytimes=[4,6,9]
    let sel6 = config_syn_steps.buttons.sel6
    let sel7 = config_syn_steps.buttons.sel7
    let steps=0
    //let timeout = config_syn_steps.timeout
    go_sports(sel3,sel4) 
    for (var i = 0; i < trytimes[sel6]; i++) {
        desc("今日步数").findOne()
        timestop=[3,5,8,13,21,34]
        sleep(500)
        sleep(timestop[sel5] * 1000 / 2)
        w = descMatches(/^\d+(,\d{3})*$/).findOne();
        var steps_alipay = w.contentDescription
        while (1) {
            sleep(200)
            w = descMatches(/^\d+(,\d{3})*$/).findOne();
            if (steps_alipay == w.contentDescription) {
                break;
            }
            else {
                steps_alipay = w.contentDescription
            }
        }
        let steps_real = steps_alipay.replace(/,/g, '');
        // log(steps_alipay)
       // log(steps_real)
        steps=steps_real
        if (steps_real >= stepsMin) {
            toastLog("支付宝步数为" + steps_real + ",同步成功")
            if (sel7 == 1) {
                var 捐步 = desc("立即捐步").findOnce()
                if (捐步) {
                    捐步.click()
                    var 确定 = desc("确定").findOne(2000)
                    if (确定) {
                        确定.click()
                        sleep(1000)
                        log("捐步成功")
                        mback()
                        sleep(1000)
                    }
                }
            }
            break;
        }
        if (sel2==0) {
            mback();
            text("首页").findOne()
            sleep(1000)
            let sel3=config_syn_steps.buttons.sel3
            let sel4 = config_syn_steps.buttons.sel4
            go_sports(sel3,sel4)
        }else{
            swipe(device.width / 9 * 8, device.height / 3, device.width / 9 * 8, device.height / 3 * 2, 500)
            sleep(2000);
        }      
        sleep(timestop[sel5] * 1000/2)
    }
    sleep(500)
    mback()
    return(steps)
}

function go_sports(sel3,sel4){

    if (sel3 == 1 && sel4==0) {
       // log("直接跳转")
        app.startActivity({
            data: "alipayqr://platformapi/startapp?saId=20000869"
        })
    }
    else {
        while (1) {
            var obj = idContains("app_text").text("运动").findOne();
            var sportButton = obj.parent()
            if (sportButton) {
                break;
            }
        }
        sleep(500)
        clickCenter(obj)
        sportButton.click()
       // sleep(200)
        
    }
    desc("今日步数").findOne()
}

function clickCenter(obj) {
    let b = obj.bounds()
    if (sdkversion>23){
        return (click(b.centerX(), b.centerY()))
    }else{
        return (Tap(b.centerX(), b.centerY()))
    }
}

function switchAccount(account,key,sel) {
    this.logIn = function (account, key) {
        idContains("loginButton").waitFor()
        setText(0, account);
        sleep(100);
        setText(1, key);
        //   log("设置密码")
        sleep(100);
        setText(0, account);
        idContains("loginButton").findOne().click()
        text("首页").findOne()
    }
    this.logInRoot = function (account, key) {
        idContains("nextButton").waitFor()
        setText(0, account);
        idContains("nextButton").findOne().click()
        idContains("loginButton").waitFor()
        setText(0, account);
        sleep(100);
        setText(1, key);
        //   log("设置密码")
        sleep(100);
        setText(0, account);
        idContains("loginButton").findOne().click()
        textMatches(/首页|关闭/).findOne()
    }
 
    if(sel==0) {
        var my = idContains("tab_description").text("我的").findOne();
        my.parent().click()
        clickCenter(my);
        text("设置").waitFor();
        var a = account;
        var b = idContains("user_account").findOne().text()
        // log(a+";"+b)
        if (a == b || (a.indexOf("@") < 0 && a.slice(0, 3) == b.slice(0, 3) && a.slice(a.length - 2, a.length) == b.slice(b.length - 2, b.length))) {
            while (!click("首页"));
            text("蚂蚁森林").waitFor();
            // sleep(1000);
        }
        else {
            //  log("查找设置")
            //   while(!click("设置"));
            //  while(!(my.parent().click()&&clickCenter(my)));
            desc("设置").findOne().click()
            var accountManage = textMatches(/账号管理|账户详情|换账号登录/).findOne().text()
            // sleep(500)
            if (accountManage == "账号管理" || accountManage == "账户详情") {
                click("账户详情") 
                click("账号管理")
                threads.start(function () {
                    sleep(3000)
                    var obj
                    if (obj = descMatches(/账号管理|账户详情|换账号登录/).findOne(1000)) {
                        clickCenter(obj)
                    }
                })
                text("账号切换").waitFor()
                //   sleep(500);
                click("账号切换") 
            } else {
                text("换账号登录").waitFor()
                //   sleep(500);
                click("换账号登录") 
            }
            var obj = textContains("换个新账号登录").findOne()
            click("换个新账号登录") 
            clickCenter(obj) ;
            var obj = textMatches(/点击下方头像登录|登录|下一步/).findOne().text()
            if (obj == "点击下方头像登录") {
                text("换个账号").findOne().click()
                //    sleep(500)
                var obj = textMatches(/登录|下一步/).findOne().text()
                //     sleep(300)
            }
            if (obj == "下一步") {
                //   textContains("下一步").waitFor()
                sleep(100)
                setText(0, account);
                sleep(100)
                click("下一步")
                // sleep(1000)
                var obj = textMatches(/登录|刷脸登录/).findOne().text()
                if (obj == "登录") {
                    //  log("登录")
                    sleep(100);
                    setText(1, key);

                } else {
                    //  log("刷脸登录")
                    sleep(200)
                    textMatches(/换个验证方式|换个方式登录/).findOne()
                    click("换个验证方式")
                    click("换个方式登录")
                    text("密码登录").findOne()
                    //  text("密码登录").findOne().parent().click()
                    sleep(200)
                    while (!click("密码登录")) { }
                    sleep(400)
                    setText(0, account);
                    sleep(200);
                    setText(1, key);
                    sleep(200)
                }
                idContains("loginButton").findOne().click()
                text("首页").waitFor();
            } else {
                this.logIn(account, key)
            }
        }   
    }
    else{
        if(sdkversion>23){
            app.startActivity(app.intent({
                action: "VIEW",
                data: "alipayqr://platformapi/startapp?appId=20000008",
            }));
        }else{
            app.startActivity({
                packageName: "com.eg.android.AlipayGphone",
                className: "com.alipay.mobile.security.login.ui.RecommandAlipayUserLoginActivity",
                root:true
                });
        }
      
        // threads.start(function () {
        //     obj = textMatches("换个验证方式|密码登录|换个方式登录").findOne(4000)
        //     click("密码登录")
        //     click("换个验证方式")
        //     click("换个方式登录")
        // })
        if(sdkversion>23){
            this.logIn(account, key)
        }else{
            this.logInRoot(account, key)
        }
        
    }
}
function mback(){
    
    if (sdkversion>23){
        return back();
    }else{
        return Back();
    }
}
