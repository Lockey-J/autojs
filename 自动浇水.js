"ui";
//storages.remove("water")
var storage = storages.create("water")
var config_water = storage.get("config_water", {})
const IMEI=device.getIMEI()+''
const ratio=device.width/1080
var date = new Date();
var now = date.getTime();
const waterButton={x:993*ratio,y:1506*ratio}
var day = storage.get("day") ? storage.get("day") : null
if (date.getDate() != day) {
    day = date.getDate()
    storage.remove("AccountsWatered")
}
storage.put("day", day)
var AccountsWatered = storage.get("AccountsWatered") ? storage.get("AccountsWatered") : []
if (!config_water.imei){
    config_water.imei=IMEI
}
var config = {}
var dir = "/sdcard/antForest蚂蚁森林/config_water.js"
var timeout = 180000
var time_search=15000
var stepsMin = 18000
var duration=200
var speed=1


console.setGlobalLogConfig({
    file: "/sdcard/antForest蚂蚁森林/自动浇水日志.txt"
});

if (!config_water.accounts_list) {
    init_from_file()
    // storage.put("config_water", config_water)
}
log("========================");
var date = new Date();
log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "自动浇水运行日志")
if ((!config_water.pay) || (!config_water.deadline) || now > config_water.deadline) {
    config_water.numOfAccounts = 3
}
//toastLog("您的有效期还有" + parseInt((config_water.deadline - now) / 3600000) + "小时，请及时联系Mike，以免影响使用")
if (config_water.deadline && (config_water.deadline - now) / 24 / 3600000 < 5) {
    toastLog("您的有效期还有" + parseInt((config_water.deadline - now) / 3600000) + "小时，请及时联系Mike，以免影响使用")
}

if (!config_water.accounts_list) {
    /*threads.start(function () {
        toastLog("加载数据中，请耐心等待...")
        sleep(2000)
    })*/
    init_from_file()
   // storage.put("config_water", config_water)
}

accounts_list_adjust(config_water)
//log(config_water)
show_water(config_water)



function init_from_old_fast_login() {
    if (files.isFile("/sdcard/alipay/multimedia/config3.js")) {
        try {
            let str = uncompile(open("/sdcard/alipay/multimedia/config3.js").read(), 0)
            eval(str)
            // console.log(config);
        }
        catch (err) {
            toastLog("读取配置文件出错" + err)
        }
    } else {
        toastLog("读取失败，原快捷登录没有配置文件")
    }
    return (config)
}
function init_from_easy_login() {
    if (files.isFile("/sdcard/antForest蚂蚁森林/config_easy_login.js")) {
        try {
            var str = uncompile(open("/sdcard/antForest蚂蚁森林/config_easy_login.js").read(), 11)
            config_easy_login = eval('(' + str + ')')
            accounts_list = config_easy_login.accounts_list
            for (let i = 0; i < accounts_list.length;i++){
                let account=accounts_list[i]
                if (!account.start_position) {
                    account.start_position = 1
                }
                if (!account.end_position) {
                    account.end_position = 10
                }
                if (!account.gnore) {
                    account.ignore = ""
                }
                if (!account.order) {
                    account.order = i+1
                }          
            }         
            config_water.accounts_list = accounts_list 
            //log(config_water.accounts_list)
        }
        catch (err) {
            log("读取配置文件出错" + err)
        }
    }
    else {
        toastLog("读取失败，没有快捷登录VIP版配置文件")
    }
}
function init_from_syn_steps() {
    if (files.isFile("/sdcard/antForest蚂蚁森林/config_syn_steps.js")) {
        try {
            var str = uncompile(open("/sdcard/antForest蚂蚁森林/config_syn_steps.js").read(), 11)
            config_easy_login = eval('(' + str + ')')
            accounts_list = config_easy_login.accounts_list
            for (let i = 0; i < accounts_list.length; i++) {
                let account = accounts_list[i]
                if (!account.start_position) {
                    account.start_position = 1
                }
                if (!account.end_position) {
                    account.end_position = 10
                }
                if (!account.gnore) {
                    account.ignore = ""
                }
                if (!account.order) {
                    account.order = i + 1
                }
            }
            config_water.accounts_list = accounts_list
            //log(config_water.accounts_list)
        }
        catch (err) {
            log("读取配置文件出错" + err)
        }
    }
    else {
        toastLog("读取失败，没有新版同步配置文件")
    }
}
function init_from_old_water() {
    if (files.isFile("/sdcard/alipay/multimedia/config.js")) {
        try {
            let str = uncompile(open("/sdcard/alipay/multimedia/config.js").read(), 0)
            eval(str)
        }
        catch (err) {
            toastLog("读取配置文件出错" + err)
        }
    } else {
        toastLog("读取失败，浇水没有配置文件")
    }
    return (config)
}
function accounts_list_generation(config, config_water) {
    var accounts_list = []
    let numOfAccounts = config_water.numOfAccounts
    //生成accounts_list
    if (config.options) {
        let options = config.options
        for (let i = 0; i < numOfAccounts; i++) {
            if (options["account" + (i + 1)]) {
                let account = { account: options["account" + (i + 1)], password: options["password" + (i + 1)] }              
                account.start_position = options["startOrder" + (i + 1)] ? options["startOrder" + (i + 1)]:1
                account.end_position = options["max_water_order" + (i + 1)] ? options["max_water_order" + (i + 1)] : 10
                account.ignore = options["name_ignore_list" + (i + 1)] ? options["name_ignore_list" + (i + 1)] : ""
                account.remark = options["remark" + (i + 1)] ? options["remark" + (i + 1)] : ""
                account.order = i + 1
                accounts_list.push(account)
            }
            else {
                let account = { account: "", password: "", start_position: 1, end_position: 10, ignore: "", start_position: 1, end_position: 10, ignore: "", remark: "", order: i + 1 }
                accounts_list.push(account)
            }
        }

    } else {
        for (let i = 0; i < numOfAccounts; i++) {
            let account = { account: "", password: "", remark: "", order: i + 1 }
            accounts_list.push(account)
        }
    }
    config_water.accounts_list = accounts_list
}

//log(files.isFile("/sdcard/alipay/蚂蚁森林/config_water.js"))
function init_from_file() {
    if (files.isFile(dir)) {
        try {
            
            var str = uncompile(open(dir).read(), 11)
            config_water_file = eval('(' + str + ')')
            if (IMEI == config_water_file.imei){
                config_water = config_water_file
            }else{
                config_water.accounts_list = config_water_file.accounts_list
            }
            storage.put("config_water", config_water)
            toastLog("保存成功")
        }
        catch (err) {
            log("读取配置文件出错" + err)
        }
        
    }
 
    /*
    else {
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
        // config_water.numOfAccounts = config.numOfAccounts ? config.numOfAccounts : 50
        let numOfAccounts = config_water.numOfAccounts
        //生成accounts_list
        if (config.options) {
            let options = config.options
            for (let i = 0; i < numOfAccounts; i++) {
                if (options["account" + (i + 1)]) {
                    let account = { account: options["account" + (i + 1)], password: options["password" + (i + 1)] }
                    account.start_position = options["startOrder" + (i + 1)] ? options["startOrder" + (i + 1)] : 1
                    account.end_position = options["max_water_order" + (i + 1)] ? options["max_water_order" + (i + 1)] : 10
                    account.ignore = options["name_ignore_list" + (i + 1)] ? options["name_ignore_list" + (i + 1)] : ""
                    account.remark = options["remark" + (i + 1)] ? options["remark" + (i + 1)] : ""
                    account.order = i + 1
                    accounts_list.push(account)
                }
                else {
                    let account = { account: "", password: "",  start_position: 1, end_position: 10, ignore: "",remark: "", order: i + 1 }
                    accounts_list.push(account)
                }
            }

        } else {
            for (let i = 0; i < numOfAccounts; i++) {
                let account = { account: "", password: "",  start_position: 1, end_position: 10, ignore: "",remark: "", order: i + 1 }
                accounts_list.push(account)
            }
        }
        // log(accounts_list.length)
        config_water.accounts_list = accounts_list
    }
    */
}

function accounts_list_adjust(config_water) {
    if (!config_water.accounts_list){
        config_water.accounts_list=[]
    }
    let len = config_water.accounts_list.length
    let numOfAccounts = config_water.numOfAccounts
    if (len < numOfAccounts) {
        for (let i = len; i < numOfAccounts; i++) {
            let account = { account: "", password: "", start_position: 1, end_position:10,ignore:"",order: i + 1 }
            config_water.accounts_list.push(account)
        }
    }
    if (len > numOfAccounts) {
        config_water.accounts_list = config_water.accounts_list.slice(0, numOfAccounts)
    }

}


function show_water(config_water) {
    ui.layout(
        <drawer id="drawer">
            <vertical>
                <appbar >
                    <toolbar id="toolbar" title="自动浇水" h="32" />
                    <tabs id="tabs" />
                </appbar>
                <viewpager id="viewpager" layout_weight="0.75" h="18">
                    <frame>
                        <vertical> 
                            <vertical layout_weight="1">
                            <horizontal>
                                <text h="*" gravity="right|center" size="16" margin="8">  1.从第</text>
                                <input id="startAccount" inputType="number" />
                                <text h="*" gravity="right|center" size="16">个账号开始，到第</text>
                                <input id="endAccount" inputType="number" />
                                <text h="*" gravity="right|center" size="16">个账号结束</text>
                            </horizontal>
                            <text textSize="16sp" margin="8">2. 收取能量球个数</text>
                                <spinner id="sp2" entries="            不收|             1个|             2个|             3个|             4个|             5个|             6个|           " />
                            <horizontal>
                            <text textSize="16sp" margin="8">3. 请选择浇水版本</text>
                            <spinner id="sp3" entries="             极速版|             快速版" />
                            </horizontal>
                            <horizontal>
                            <text textSize="16sp" margin="8">4. 请选择检测弹窗的时间</text>
                            <spinner id="sp4" entries="             0秒|             3秒|             6秒|             15秒|             30秒" />
                            </horizontal>
                            <!---horizontal>
                            <text textSize="16sp" margin="8">5. 请选择支付宝</text>
                            <spinner id="sp5" entries="        原始支付宝|        vxp里面的支付宝" />
                            </horizontal-->
                            <horizontal>
                            <text textSize="16sp" margin="8">5. 进入森林方式</text>
                            <spinner id="sp5" entries="        直接跳转|通过首页蚂蚁森林" />
                            </horizontal>
                        </vertical> 
                            <vertical>
                            <linear gravity="center">
                                <button id="start" text="开始浇水" h="60" w="*" />
                            </linear>
                          </vertical> 
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
                                        <text textSize="16sp" marginLeft="16" textColor="#000000" gravity="right|center" text="从好友排行榜第" />
                                        <input id="start_position" inputType="number" text="{{this.start_position}}" />
                                        <text textSize="16sp" textColor="#000000" text="开始，到第" />
                                        <input id="end_position" inputType="number" text="{{this.end_position}}" />
                                        <text textSize="16sp" textColor="#000000" text="结束" />
                                    </horizontal>
                                    <horizontal>
                                        <text textSize="16sp" marginLeft="16" textColor="#000000" gravity="right|center" text="停水名单" />
                                        <input id="ignore" textSize="13sp" hint="开始和结束之间停水名单.(可不填)填昵称或备注名的关键词，多个用逗号隔开" text="{{this.ignore}}" />
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
                            <text textSize="16sp" textColor="#000000" text="请点击下方的复制IMEI按钮，粘贴发送给Mike(微信1289713124)获取激活码" />
                            <button id="copy_imei" text="复制IMEI" />
                            <input id="initialPassword" hint="请输入激活码" w="500" text="" />
                            <button id="ok" text="确定" />
                            <button id="init_from_old_fast_login" text="从原快捷登陆导入数据" />
                            <button id="init_from_old_water" text="从旧版自动浇水导入数据" />
                          
                            <button id="init_from_easy_login" text="从快捷登录VIP版导入数据" />
                            <button id="init_from_syn_steps" text="从新版自动同步导入数据" />
                        
                           <horizontal gravity="center">
                                <button id="viewlog" text="查看日志" />
                                <button id="clear_log" text="清除日志"  />
                                <button id="clear" text="清除支付宝缓存" w="150"/>
                            </horizontal>
                        </vertical>
                    </frame>
                <frame>
                    <vertical >
                        <linear>
                        <text h="*" gravity="right|center" textColor="#000000" size="16" >  1.批量设置浇水位置:</text>
                        </linear>
                        <horizontal>
                            <text h="*" gravity="right|center" textColor="#000000" size="16" margin="8"> (1)要设置的账号为：账号</text>
                            <input id="page4_startAccount" inputType="number" />
                            <text h="*" gravity="right|center" textColor="#000000" size="16">至账号</text>
                            <input id="page4_endAccount" inputType="number" />
                        </horizontal>
                        <horizontal>
                        <text h="*" gravity="right|center" textColor="#000000" size="16" margin="8"> (2)从好友排行榜第</text>
                            <input id="page4_start_position" inputType="number" />
                            <text h="*" gravity="right|center" textColor="#000000" size="16">开始，到第</text>
                            <input id="page4_end_position" inputType="number" />
                            <text h="*" gravity="right|center" textColor="#000000" size="16">结束</text>
                        </horizontal>
                        <horizontal>
                        <text h="*" gravity="right|center" textColor="#000000" size="16" margin="8"> (3)停水名单关键词</text>
                        <input id="page4_ignore"  />
                        </horizontal>
                        <button id="page4_ok" text="确定" />
                    </vertical>
                </frame>
                </viewpager>
            </vertical>
        </drawer>
    );
    activity.setSupportActionBar(ui.toolbar);
    ui.page3.text("每填写或者修改一个账号时，请点击其下方对应的确认按钮，填写或修改完毕再点击最下方的“保存配置到文件”按钮")

    //设置滑动页面的标题
    ui.viewpager.setTitles(["浇水设置", "录入信息", "使用帮助","高级设置"]);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);
    //初始化界面
    let accounts_list = config_water.accounts_list


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
            item.start_position = itemView.start_position.text()
            item.end_position = itemView.end_position.text()
            item.ignore = itemView.ignore.text()
            itemView.confirm.text("已确认修改")
            //  itemView.confirm.attr("style","Widget.AppCompat.Button.Colored")
            toast("密码为:" + itemView.password.text())
            config_water.accounts_list = accounts_list
            //remark_list = remark_list_update(config_water)
            storage.put("config_water", config_water)
        });
        itemView.password.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.account.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.start_position.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.end_position.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        itemView.ignore.on("touch_down", function () {
            itemView.confirm.text("未确认修改,请点击确认")
        });
        //  config_water.accounts_list=accounts_list
    });

    var initForm2 = function () {
        let startAccount = config_water.startAccount ? config_water.startAccount : 1

        let endAccount = config_water.endAccount ? config_water.endAccount : config_water.numOfAccounts
        ui.startAccount.text(startAccount + "");
        ui.endAccount.text(endAccount + "");
        if (!config_water.buttons) {
            config_water.buttons = {}
        }
        for (let i = 2; i < 6; i++) {
            let sel = config_water.buttons["sel" + i] ? config_water.buttons["sel" + i] : 0
            ui["sp" + i].setSelection(sel)
        }
    };
    initForm2()

    ui.start.click(() => {
        toastLog("开始浇水")
        let startAccount = ui.startAccount.text() ? ui.startAccount.text():1
        let endAccount = ui.endAccount.text() ? ui.endAccount.text():1
        config_water.startAccount = Math.max(1, startAccount);
        config_water.endAccount = Math.min(endAccount , accounts_list.length);
        //  config_water.buttons={}
        for (let i = 2; i < 6; i++) {
            config_water.buttons["sel" + i] = ui["sp" + i].getSelectedItemPosition()
        }
        storage.put("config_water", config_water)
        threads.shutDownAll()
        threads.start(function () {
            work(config_water)
        })
    })

    ui.save.click(function () {
          // ui.button_list.setDataSource(remark_list);
           saveConfig(dir)
    })
    
    ui.copy_imei.click(function () {
        let imei = device.getIMEI()
        setClip(imei)
        toastLog("本机IMEI为" + imei + "，复制成功")
    })

    ui.ok.click(() => {
        // log(ui.initialPassword.text())
        //  var key=uncompile(uncompile(ui.initialPassword.text()+""))
        var key = parseInt(uncompile(uncompile(ui.initialPassword.text() + "", 0), 0))
        key = key + "";
        var t1 = 9, t2 = 13, t3 = 17
        if (key.length == 17) {
            t1 = t1 - 1
            t2 = t2 - 1
            t3 = t3 - 1
        }
        else if (key.length == 16) {
            t1 = t1 - 2
            t2 = t2 - 2
            t3 = t3 - 2
        }
        else if (key.length == 15) {
            t1 = t1 - 3
            t2 = t2 - 3
            t3 = t3 - 3
        }
        else if (key.length == 14) {
            t1 = t1 - 4
            t2 = t2 - 4
            t3 = t3 - 4
        }
        else if (key.length == 19) {
            t1 = t1 + 1
            t2 = t2 + 1
            t3 = t3 + 1
        }
        //86611103858332
        // log(key)       
        var date = new Date();
        var now = date.getTime();
        var numOfAccounts = (parseInt(key.slice(t1, t2)) - 1001);
        //log(key.slice(t1, t2))
        //log('t1','t2')
        //log(t1)
        // log(t2)
        //log(numOfAccounts)

        //log(payByMonth)
        //console.log(deadline);
        // aa = parseInt((Math.sin((Math.floor(now / 100000000)) + 19) * 1000000000).toString().slice(0, 9))
        //bb = Imei.slice(6, 15) % 1000000000
        //var key0 = aa + bb + "" + (1001 + parseInt(numberOfAccounts)).toString() + "" + validity + '' + (payByMonth + 0)

        var imei = device.getIMEI() + ""
        if (imei.length == 14) {
            imei += "" + 0
        }
        //log(imei)       
        var keywordOfTime = Math.floor(parseInt(key) / 1000000000) - parseInt(imei) % 1000000000
        var keyNow = parseInt(((Math.sin(Math.floor(now / 100000000) + 23)) * 1000000000).toString().slice(0, 9))
        //log(keyNow)
        //log(keywordOfTime)

        // log(key.slice(12,15))
        // log(numOfAccounts)
        //   log(keywordOfPrime)
        if (Math.abs(keywordOfTime - keyNow) < 10) {
            toastLog("激活码正确")
            var payByMonth = key[t3]
            var imei = device.getIMEI();
            config_water.imei = imei
            config_water.numOfAccounts = numOfAccounts
            //config_water.payByMonth = payByMonth
            config_water.pay = true
            var deadline = now + 24 * 3600 * 1000 * parseInt(key.slice(t2, t3));
            config_water.deadline = deadline
            config_water.remainTimes += numOfAccounts * 60
            //log(config_water)
            saveConfig(dir);
            toastLog("激活成功,重启软件生效!");
        }
        else {
            toastLog("激活码不正确，请联系Mike（微信1289713124）")
        }

    });
    ui.init_from_old_fast_login.click(() => {
        config = init_from_old_fast_login()
        accounts_list_generation(config, config_water)
        accounts_list_adjust(config_water)
        let accounts_list = config_water.accounts_list
        // let remark_list = remark_list_update(config_water)
        ui.list.setDataSource(accounts_list);
        //ui.button_list.setDataSource(remark_list);
        saveConfig(dir);
        toastLog("导入数据成功,重启软件生效!")
        try {
            files.copy("/sdcard/alipay/multimedia/config3.js", "/sdcard/antForest蚂蚁森林/config3.js")
        } catch (e) {
            log(e)
        }
    })
    ui.init_from_old_water.click(() => {
        config = init_from_old_water()
        accounts_list_generation(config, config_water)
        accounts_list_adjust(config_water)
        let accounts_list = config_water.accounts_list
        //let remark_list = remark_list_update(config_water)
        ui.list.setDataSource(accounts_list);
        //ui.button_list.setDataSource(remark_list);
        saveConfig(dir);
        toastLog("导入数据成功,重启软件生效!")
        try {
            files.copy("/sdcard/alipay/multimedia/config.js", "/sdcard/antForest蚂蚁森林/config.js")
        } catch (e) {
            log(e)
        }
    })
    ui.init_from_easy_login.click(() => {
        init_from_easy_login()
        // accounts_list_generation(config, config_water)
        accounts_list_adjust(config_water)
        let accounts_list = config_water.accounts_list
        //let remark_list = remark_list_update(config_water)
        ui.list.setDataSource(accounts_list);
        //ui.button_list.setDataSource(remark_list);
        saveConfig(dir);
        toastLog("导入数据成功")
    })
    ui.init_from_syn_steps.click(() => {
        init_from_syn_steps()
        // accounts_list_generation(config, config_water)
        accounts_list_adjust(config_water)
        let accounts_list = config_water.accounts_list
        //let remark_list = remark_list_update(config_water)
        ui.list.setDataSource(accounts_list);
        //ui.button_list.setDataSource(remark_list);
        saveConfig(dir);
        toastLog("导入数据成功")
    })
    ui.viewlog.click(() => {
        if (files.isFile("/sdcard/antForest蚂蚁森林/自动浇水日志.txt")) {
            app.viewFile("/sdcard/antForest蚂蚁森林/自动浇水日志.txt");
        }
        else {
            toastLog("没有日志文件")
        }

    })
    ui.clear_log.click(() => {
        confirm("确定清除历史日志?").then(value=>{
            if(value){
            files.remove("/sdcard/antForest蚂蚁森林/自动浇水日志.txt")
            toastLog("清除日志成功")
            }
        })
    })
    ui.clear.click(() => {
        app.openAppSetting("com.eg.android.AlipayGphone")
        toastLog("请手动删除支付宝全部数据")
    })

    //页面4
    ui.page4_ok.click(() => {

        let start_account = ui.page4_startAccount.text() ? parseInt(ui.page4_startAccount.text()):null
        let end_account = ui.page4_endAccount.text() ? parseInt(ui.page4_endAccount.text()) : null
        let start_position = ui.page4_start_position.text() ? parseInt(ui.page4_start_position.text()):null
        let end_position = ui.page4_end_position.text() ? parseInt(ui.page4_end_position.text()) : null
        let ignore = ui.page4_ignore.text() ? ui.page4_ignore.text():''
        if (start_account && end_account){
            for (let i = start_account; i <= end_account; i++) {   
                if (start_position &&end_position) {
                    config_water.accounts_list[i - 1].start_position = start_position
                    config_water.accounts_list[i - 1].end_position = end_position   
                }
                config_water.accounts_list[i - 1].ignore=ignore
                //log(config_water.accounts_list[i - 1].end_position);
            }
            ui.list.setDataSource(config_water.accounts_list);
            //log(config_water.accounts_list)
            saveConfig(dir);
            toastLog("批量设置成功")
        }
        else{
            toastLog("请设置信息")
        }
     
        

   
    })
  
    
}
function saveConfig(dir) {
    //config_water.sp1 = ui.sp1.getSelectedItemPosition()
    storage.put("config_water", config_water)
    let str = JSON.stringify(config_water)
    //log(config_water.remark_list)
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



//////浇水函数部分：
///函数部分
function work(config_water) {

    let buttons = config_water.buttons
    //  log(buttons)
    console.show()
    // console.log(config_water);
    let startAccount = config_water.startAccount
    let endAccount = config_water.endAccount
    let Accounts = config_water.accounts_list.slice(startAccount - 1, endAccount)
    //log(Accounts)
    auto.waitFor()
    //let sel5 =config_water.buttons.sel5
    //work_pre(1-sel5); //登陆vxp
    console.setPosition(0, device.height / 2);
    water_accounts_list(Accounts);
    app.startActivity("console");
}
function work_pre(sel) {
    //let sel2 = cofig_water.buttons.sel5
    // console.log(sel3);  
    if (sel == 0) {
        appName = "io.va.exposed";
        launch(appName);
        sleep(500)
        textContains("支付宝").waitFor();
        sleep(200)
        click("支付宝");
    }
    if (sel == 2) {
        toastLog("请手动打开您需要浇水的支付宝")
    }
}

function water_accounts_list(Accounts) {
    let sel5 =config_water.buttons.sel5
    let numOfAccounts = config_water.numOfAccounts
    //let AccountsWatered = config_water.AccountsWatered ? config_water.AccountsWatered:[]
    for (let kk = 0; kk < Accounts.length; kk++) {
        let account = Accounts[kk]
        //log(account)
        if (AccountsWatered.indexOf(account.account) < 0) {
            AccountsWatered.push(account.account)
        }
        storage.put("AccountsWatered", AccountsWatered)
        if (AccountsWatered.length > numOfAccounts + 10) {
            app.startActivity("console")
            sleep(500)
            toastLog("今日浇水账号过多，请明天再试")
            exit()
        }
        switchAccount(account.account, account.password,1);
        log("已成功登录到第" + account.order + "个账号")
        辅助点击()
        water_one_account(account)
    }
}


function 辅助点击(){
    threads.start(function () {
        let obj = textMatches(/稍后再说|打开/).findOne(time_search)
        if (obj) {
            sleep(200);
            click("稍后再说")
            click("打开")
        }
    })
    threads.start(function () {
        let obj = desc("重新加载").findOne(time_search)
        if (obj) {
            let obj2 = descContains("我的大树养成记录").findOnce()  
            if(!obj2){
                sleep(200);
                clickCenter(obj)
            }   
        }
    })
}

function water_one_account(account) {
    //let startOrder, num, non_list, 
    
    var waitingTime =1000;
    //  请保证好友列表至少有五个人
    let start_position = account.start_position;
    let end_position = account.end_position;
    let ignore = account.ignore.replace(/，/g, ",")
    let non_list = ignore==''?[]:ignore.split(",")
    //log(account)
   //log('non_list', non_list)
    let buttons = config_water.buttons
    let sel2 = buttons.sel2   //收球
    let numberTakePower=parseInt(sel2)
    let sel3 = buttons.sel3   //浇水版本
    let sel4 = buttons.sel4   //检测弹窗
    let sel5 = buttons.sel5   //跳转方式版本
   // let sel6 = config_water.sel6  //支付宝版本
   // let non_list = Account.noWaterList;
    non_list.push("你的好友")
    let waterPowerReal = 0 
    var obj = idMatches(/.*(h5_tv_|tab_description).*/).findOne()
    if (obj.id().indexOf("h5_tv_") > -1 || obj.id().indexOf("back") > -1) {
        sleep(1000)
        back()
        sleep(1000)
    }
    var my = idContains("tab_description").text("我的").findOne(2000);
    if (my) {
        my.parent().click();
        text("设置").waitFor();
        var mynameObj = idMatches(/.*(left_textview|user_name_left)/).findOne(1000)
    }
    var myname = mynameObj ? mynameObj.text() : "未找到昵称"
    log("本号昵称:" + myname);
    non_list.push(myname);
    let NameList = { waterList: "", nowaterList: "", waterPowerReal: 0 };
        
    if (parseInt(sel2)>0&&sel2<7){
        takeMyPower(numberTakePower, start_position,end_position)
    }   
    enterRankList();
    water_in_rank_list(start_position, end_position, non_list)
}

function enterRankList() {
    //https://60000002.h5app.alipay.com/app/src/home.html
    app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?saId=10000007&" + "clientVersion=3.7.0.0718&qrcode=" + "https://60000002.h5app.alipay.com/www/listRank.html"
    }));
    idContains("h5_tv_title").text("好友排行榜").findOne()
    toastLog("进入好友排行榜成功")
    toastLog("若卡在排行榜无法退出,请点击屏幕右上角");
}

function takeMyPower(numberTakePower, start_position, end_position){
    enterForeast(1)
    toastLog("成功进入蚂蚁森林");
    //sleep(500)
    //var y = obj.bounds().bottom
    let sel4= config_water.buttons.sel4
    let timeDetectList = [0, 3, 6, 15, 30]
    let timeDetect = timeDetectList[sel4]
    // press(device.width / 2, y, duration)
    var start = getPower();
    if (timeDetect > 0) {
        sleep(1000 * timeDetect / 2)
        //click(device.width/2,y)
        //press(device.width / 2, y, duration)
        sleep(1000 * timeDetect / 2)
        back();
        sleep(500)
        text("首页").findOne()
        enterForeast(1)
    }
    if (numberTakePower > 0) {
        start = takePower(numberTakePower);
    }
    log("初始能量:   " + start + "g")
    var dif = (end_position - start_position + 1) * 30
    if (start < dif) {
        log("警告:总能量不够，将少" + (dif - start) + "g");
    }
}


function water_in_rank_list(start_position,end_position,non_list){
    //log("进入")
    sleep(2000)
    var NameList={}
    let speed=1
    let y1=313.5*ratio
    let dy = 191 * ratio
    let sel3=config_water.buttons.sel3
    var is_end=[false]

    for (var i = 1; i <= end_position; i++) {
        var waterPowerPerson = 0;
        watered = false;
        if (i <= 3) {
            if (i < start_position) {
                continue;
            }
            var yi = y1 + (i-1) * dy
            let obj_1 = descMatches(/^((?!环保证书).)+/).boundsInside(200 * ratio, yi - 192 * ratio, 1000 * ratio, yi + 192 * ratio).findOne(2000)
            if (((!obj_1) && textMatches(/好友排行榜|蚂蚁森林/).findOne())){
                break;
            }
            //log("y"+i+':'+yi)
            //var obj_i=descMatches(/.*(t|g)/).boundsInside(0,yi-0.5*dy,device.width,yi+0.5*dy).findOne().parent()
            //var set=obj_i.children()
        } 
        else {
            if ((!desc(i).findOne(2000)) && textMatches(/好友排行榜|蚂蚁森林/).findOne()) {
                break;
            }
            var yi = desc(i).findOne().bounds().centerY();
            if (yi > 0.8 * device.width / 1080 * 1920) {
                swipe(device.width / 5 * 4, device.width / 1080 * 1920 * 4 / 5, device.width / 5 * 4, device.width / 1080 * 1920 * 1 / 5,200);
                // scrollDown()
                sleep(1000 * speed);
                var yi = desc(i).findOne().bounds().centerY();
                sleep(500 * speed)
            }
            if (i < start_position) {
                continue;
            }
        }

        //  NameiCon=descMatches(/^((?!环保证书).)+/).boundsInside(200,yi-192,1000,yi+100).findOne()
        NameiCon = descMatches(/^((?!环保证书).)+/).boundsInside(200 / 1080 * device.width, yi - 192 * device.width / 1080, 1000 * device.width / 1080, yi + 100 * device.width / 1080).findOne()
        Namei = NameiCon.contentDescription
        var jud = true;
        for (var k = 0; k < non_list.length; k++) { // log(non_list[k])
            if ((non_list[k] != "") && Namei.indexOf(non_list[k]) > -1) {
                jud = false;
                break;
            }
        }
        if (jud) {
            NameList.waterList += i + "," + Namei + "; ";
            waterPowerPerson = sel3 == 0 ? water2(yi, is_end) : water(yi, is_end)
            NameList.waterPowerReal += waterPowerPerson
        } 
        /*else {
            log(i + ","+ Namei+",停水名单跳过;")
            NameList.nowaterList += i + "," + Namei + "; ";
        }*/
        if (waterPowerPerson < 30 && jud) {
            if (watered) {
                log(i + "," + Namei + "已💧满,实际💧" + waterPowerPerson + "g")
            } else {
                console.error(i + "," + Namei + "💧" + waterPowerPerson + "g")
            }
        }
        if (waterPowerPerson == 30 && jud) {
            log(i + "," + Namei + "💧" + waterPowerPerson + "g")
        }
        if(is_end[0]){
            break;
        }

    }
    return NameList;
}


///三次浇水动作
function water(yi,is_end) {
    //press(device.width / 5 * 4, yi, duration);  
    click(device.width / 5 * 4, yi)
   // toastLog("点击x:" + device.width / 5 * 4 + "点击x:" +yi)
  //  var obj = descMatches(/你收取TA|你给TA助力/).findOne(10000)
    /*
    while (!obj) {
        //      var selector=desc("5")
        //    swipeToObj(selector)
        //    click(device.width /5*4,yi);
        press(device.width / 5 * 4, yi, duration);
        // var waterButton=desc("浇水").findOne(10000);
        var obj = descMatches(/你收取TA|你给TA助力/).findOne(10000)
    }*/
    //let water_button=desc("浇水").findOne()
   // log("找到浇水")
    var obj = idContains("h5_tv_title").textContains("的蚂蚁森林").findOne(20000)
    while (!obj) {
        press(device.width / 5 * 4, yi, duration);
        //click(device.width / 5 * 4, yi)
        boundsInside(0, 0, 1080 * ratio, ratio * 1920 / 3).descMatches(/\d+g/).findOne(1000)
        var obj = idContains("h5_tv_title").textContains("的蚂蚁森林").findOne(10000)
        //let water_button = desc("浇水").findOne(10000)
        //descContains("我的大树养成记录").findOne(5000)
    }
    var obj = boundsInside(0, 0, 1080 * ratio, ratio * 1920 / 3).descMatches(/\d+g/).findOne(1000)
    var power0 = obj ? parseInt(obj.contentDescription) : 0
    var waterTimes = 0;
    var waterPowerPerson = 0;
    threads.start(function () {
        selector1 = descContains("继续浇水")
        if (close1 = selector1.findOne(7000)) {
            sleep(500);
            waterTimes += 1
            close1.click();
        }
    })
    //点击浇水直至出现+10g动画
    outermost:
    while (1) {
        Timeout2 = 0;
        var to = "初始";
        threads.start(function () {
            events.observeToast();
            events.onToast(function (toast) {
                to = toast.getText()+"初始"
            });
        })

        //water_button.click()
        
        //clickCenter(water_button)
        //log("点击浇水")
       // click(waterButton.x, waterButton.y)
        click(waterButton.x, waterButton.y)
        // waterButton.click()    
        //  clickCenter(waterButton)                                                                                 
        waterTimes += 1;
        sleep(500)
        var obj = boundsInside(0, 0, device.width, device.width / 1080 * 1920 / 3).descMatches(/\d+g/).findOne(1000)
        var power1 = obj ? parseInt(obj.contentDescription) : 0
        //   log("第"+kkk+"次点击能量为"+power1)
        if (power1 - power0 >= 30) {
            waterPowerPerson = power1 - power0
            break;
        }
        if (waterTimes >= 25) {
            //sleep(1000*speed)
            //  log("退出")
            waterPowerPerson = power1 - power0
            break;
        }
        if (to.indexOf("今日浇水已到达") > -1) {
            //     sleep(1500)
            waterPowerPerson = power1 - power0
            // waterPowerPerson=30
            //    sleep(1000)
            watered = true
            break;
        }
        if (to.indexOf("能量不足") > -1) {
            sleep(1500)
            console.error("能量不足，后面都漏水")
            is_end[0]=true
            break;     
        }
    }
    back();
    textMatches(/好友排行榜|蚂蚁森林/).findOne(2000)
    sleep(1000 * speed);
    return waterPowerPerson;
}

function water2(yi,is_end) {
    var waterTimes = 0;
    var waterPowerPerson = 0
    threads.start(function () {
        selector1 = descContains("继续浇水")
        if (close1 = selector1.findOne(7000)) {
            sleep(200 * speed);
            close1.click();
        }
    })
    var to = "初始";
    //点击浇水直至出现+10g动画
    threads.start(function () {
        events.observeToast();
        events.onToast(function (toast) {
            to = toast.getText()+"初始"
        });
    })
    outermost:
    for (var waterTimes = 0; waterTimes < 3; waterTimes++) {     
        //press(device.width / 5 * 4, yi, duration);
        click(device.width / 5 * 4, yi)
        //    sleep(100) 
        //      click(device.width /5*4,yi)             
        //  var waterButton=desc("浇水").findOne(10000);   
        // var obj=descMatches(/你收取TA|你给TA助力/).findOne(10000) 
        //let water_button = desc("浇水").findOne(10000)
        var obj = idContains("h5_tv_title").textContains("的蚂蚁森林").findOne(10000)
      //  descContains("我的大树养成记录").findOne(5000)
        while (!obj) {
            //press(device.width / 5 * 4, yi, duration);
            click(device.width / 5 * 4, yi)
            boundsInside(0, 0, 1080 * ratio, ratio * 1920 / 3).descMatches(/\d+g/).findOne(1000)
            var obj = idContains("h5_tv_title").textContains("的蚂蚁森林").findOne(10000)
            //let water_button = desc("浇水").findOne(10000)
            //descContains("我的大树养成记录").findOne(5000)
        }
        var obj = boundsInside(0, 0, 1080*ratio, ratio * 1920 / 3).descMatches(/\d+g/).findOne(1000)
        var power0 = obj ? parseInt(obj.contentDescription) : 0
        //   log("初始能量为"+power0)             
        var kkk = 0
        while (kkk < 20) {
            //    times1=desc(myname).find().size()
            kkk += 1;
            //water_button.click()
            //clickCenter(water_button)   
            click(waterButton.x, waterButton.y)
            var obj = boundsInside(0, 0, 1080 * ratio, ratio * 1920 / 3 ).descMatches(/\d+g/).findOne(1000)
            var power1 = obj ? parseInt(obj.contentDescription) : 0
            //   log("第"+kkk+"次点击能量为"+power1)
            if (power1 - power0 == 10) {
                break;
            }
            click(waterButton.x, waterButton.y)
           // clickCenter(water_button)
            //water_button.click()
            //      sleep(100* speed)
            if (to.indexOf("今日浇水已到达") > -1) {
                back();
                sleep(2000)
                watered = true
                break outermost;
            }
            if (to.indexOf("能量不足") > -1) {
                let sel2=config_water.buttons.sel2
                //if(sel2==7){
                if (0) {
                    takeMyPower(1);
                    enterRankList()
                }
                else{
                    sleep(1500)
                    console.error("能量不足，后面都漏水")
                    is_end[0] = true
                    break outermost;
                }    
            }
        }
        // times0=times0
        if(kkk < 20){
            waterPowerPerson += 10;
        }
        back();
        // descMatches(/.*g|t/).boundsInside(0.8*device.width,device.height/2,device.width,device.height).findOne(1500)
        //  sleep(500)        
        textMatches(/好友排行榜|蚂蚁森林/).findOne(2000)
        sleep(500 * speed)
    }
    return waterPowerPerson;
}

function swipeToObj(selector) {
    var sel = selector
    var obj = sel.findOnce();
    var j = 0;
    outter:
    while (1) {
        if (obj) {
            x = obj.bounds().centerX()
            y1 = obj.bounds().top
            y2 = obj.bounds().bottom
            if (y1 > 0 && y2 > 0 && y2 < device.height * 9 / 10 && y1 < device.height * 9 / 10) {
                break outter;
                // log("跳出")    
            }
        }
        swipe(device.width / 5 * 4, device.width / 1080 * 1920 * 5 / 9, device.width / 5 * 4, device.width / 1080 * 1920 * 2 / 9, 200);
        sleep(500)
        obj = sel.findOnce();
        j += 1;
        if (j % 15 == 0) {
            back();
            sleep(2000)
            enterForeast()
            desc("合种").findOne(20000)
        }
    }
}

function takePower(numberTakePower) {
    console.hide()
    var start0 = getPower();
    var start = start0
    descContains("收集能量").findOne(2000)
    var filters = descContains("收集能量").find();
    if (filters.length > 0) {
        filters.sort(function (o1, o2) {
            return o1.bounds().centerX() - o2.bounds().centerX();
        });
    }
    var takemyself = 0;
    log("找到" + (filters.length) + "个能量球");
    var len = Math.min(filters.length, numberTakePower)
    //log(len)
    if (len > 0) {
        sleep(1000);
        for (var i = 0; i < len; i++) {
            clickCenter(filters[i])
            //   filters[i].click()       
            //      log("点击第"+i)
            if (id("com.alipay.mobile.ui:id/title_bar_title").exists()) {
                back();
                sleep(1500);
            }
        }
        sleep(1000);
        for (var i = 0; i < len; i++) {
            clickCenter(filters[i])
        }
        log("收取自己" + Math.min(filters.length, numberTakePower) + "个能量球")//,共计"+(start-start0)+"g后,有"+(start)+"g能量");
    }
    if (len > 0) {
        var selector1 = idContains("_close")
        if (selector1.findOne(1500)) {
            back();
            text("首页").findOne(2000)
            app.startActivity({
                data: "alipayqr://platformapi/startapp?saId=60000002"
            })
            //    var obj= text("蚂蚁森林").findOne().parent();
            //     sleep(200)
            //click("蚂蚁森林");
            //     while(!(click("蚂蚁森林")&&obj.click()&&clickCenter(obj)))
            desc("合种").findOne(20000);
        }

    }
    var start = getPower();
    console.show()
    return (start)
    //   else{ log("警告:总能量不够，将少"+(dif0-start)+"g");}   
    // return(start);
}
function getPower() {
    /* var filters=descMatches(/\d+g/).find();
     filters.sort(function (o1, o2) {           
          return o1.bounds().centerY() - o2.bounds().centerY(); 
          });
    */
    //  var obj=idContains("tree_energy").findOne(3000)
    var obj = boundsInside(0, 0, device.width, device.width / 1080 * 1920 / 3).descMatches(/\d+g/).findOne(2000)
    return obj ? parseInt(obj.contentDescription) : 0;
}


function clickCenter(obj) {
    let b = obj.bounds()
    return (click(b.centerX(), b.centerY()))
}

function enterForeast(sel) {
    if (sel) {
        app.startActivity({
            data: "alipayqr://platformapi/startapp?saId=60000002"
        })
        desc("合种").findOne()
    }
    else {
        textContains("首页").waitFor()
        click("首页");
        var obj = text("蚂蚁森林").findOne().parent().parent().parent();      
        if (obj) {
            obj.click()
        }
        click("蚂蚁森林")
        desc("合种").findOne()
        threads.start(function () {
            sleep(4000)
            if (text("首页").exists()) {
                var obj = text("蚂蚁森林").findOne()
                clickCenter(obj)
            }
        })
    }
}

function switchAccount(account, key, sel) {
    sel=1
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
    if (sel == 0) {
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
            clickCenter(obj);
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
    else {
        app.startActivity(app.intent({
            action: "VIEW",
            data: "alipayqr://platformapi/startapp?appId=20000008",
        }));
        threads.start(function () {
            obj = textMatches("换个验证方式|密码登录|换个方式登录").findOne(5000)
            click("密码登录")
            click("换个验证方式")
            click("换个方式登录")
        })
        this.logIn(account, key)
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