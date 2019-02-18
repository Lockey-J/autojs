"ui";
//storages.remove("friends_manager")

var storage = storages.create("friends_manager")
var config_friends_manager = storage.get("config_friends_manager", {})
var config = {}
var Accounts2 = []
var dir = "/sdcard/antForest蚂蚁森林/config_friends_manager.js"
var timeout = 180000
var date = new Date();
var now = date.getTime();

console.setGlobalLogConfig({
    file: "/sdcard/antForest蚂蚁森林/加删好友日志.txt"
});

log("===========================================");
var date = new Date();
log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "加删好友运行日志")
if ((!config_friends_manager.pay) || (!config_friends_manager.deadline) || now > config_friends_manager.deadline) {
    config_friends_manager.numOfAccounts = 100
    config_friends_manager.remainTimes=50
}
if (config_friends_manager.deadline && (config_friends_manager.deadline - now)/ 24 / 3600000  < 1) {
    toastLog("您的有效期还有" + parseInt((config_friends_manager.deadline - now) / 3600000) + "小时，请及时联系Mike，以免影响使用")
}
if (config_friends_manager.remainTimes && (config_friends_manager.remainTimes ) < 10) {
    toastLog("您的次数还剩" + config_friends_manager.remainTimes+ "次，请及时联系Mike，以免影响使用")
}

if (!config_friends_manager.accounts_list) {
    init_from_file()
   // accounts_list_adjust
//  init_from_easy_login()
}
//config_friends_manager.numOfAccounts = 200
//console.log("账号个数"+config_friends_manager.numOfAccounts );

accounts_list_adjust(config_friends_manager)
show_friends_manager(config_friends_manager)


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
            config_friends_manager.accounts_list = config_easy_login.accounts_list
            //log(config_friends_manager.accounts_list)
        }
        catch (err) {
            log("读取配置文件出错" + err)
        }
    }
    else {
        toastLog("读取失败，没有快捷登录VIP版配置文件")
    }
}
function init_from_water() {
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
function accounts_list_generation(config, config_friends_manager) {
    var accounts_list = []
    let numOfAccounts = config_friends_manager.numOfAccounts
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
    config_friends_manager.accounts_list = accounts_list
}

//log(files.isFile("/sdcard/alipay/蚂蚁森林/config_friends_manager.js"))
function init_from_file() {
    if (files.isFile(dir)) {
        try {
            var str = uncompile(open(dir).read(), 11)
            config_friends_manager = eval('(' + str + ')')
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
        // config_friends_manager.numOfAccounts = config.numOfAccounts ? config.numOfAccounts : 50
        let numOfAccounts = config_friends_manager.numOfAccounts
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
        config_friends_manager.accounts_list = accounts_list
    }
}

function accounts_list_adjust(config_friends_manager) {
    let len = config_friends_manager.accounts_list.length
    let numOfAccounts = config_friends_manager.numOfAccounts
    if (len < numOfAccounts) {
        for (let i = len; i < numOfAccounts; i++) {
            let account = { account: "", password: "", remark: "", order: i + 1 }
            config_friends_manager.accounts_list.push(account)
        }
    }
    if (len > numOfAccounts) {
        config_friends_manager.accounts_list = config_friends_manager.accounts_list.slice(0, numOfAccounts)
    }

}

//log(config_friends_manager.accounts_list)



//生成remark_list
function remark_list_update(config_friends_manager) {
    let accounts_list = config_friends_manager.accounts_list
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

function show_friends_manager(config_friends_manager) {
    ui.layout(
        <drawer id="drawer">
            <vertical>
                <appbar >
                    <toolbar id="toolbar" title="加删好友" h="32" />
                    <tabs id="tabs" />
                </appbar>
                <viewpager id="viewpager" layout_weight="0.75" h="18">
                    <frame>
                    
                       <vertical >
                            <ScrollView>
                            <vertical layout_weight="0.8">
                                
                                    <text textSize="16sp" margin="8">1. 请复制用微信扫支付宝好友二维码得到的链接</text>
                                    <horizontal>
                                        <text w="66" h="*" gravity="right|center" size="16">好友1</text>
                                    <input id="friend1" hint="                                                   "/>

                                    </horizontal>
                                    <horizontal>
                                        <text w="66" h="*" gravity="right|center" size="16">好友2</text>
                                    <input id="friend2" hint="                                                   "  />
                                    </horizontal>
                                    <horizontal>
                                        <text w="66" h="*" gravity="right|center" size="16">好友3</text>
                                    <input id="friend3" hint="                                                   "  />
                                    </horizontal>
                                    
                                    <horizontal>
                                        <text w="66" h="*" gravity="right|center" size="16">好友4</text>
                                    <input id="friend4" hint="                                                   "  />
                                    </horizontal>
                                    <horizontal>
                                        <text w="66" h="*" gravity="right|center" size="16">好友5</text>
                                    <input id="friend5" hint="                                                   " />
                                    </horizontal>
                        
                                    <text textSize="16sp" margin="8">2. 请选择需要操作的账号</text>
                                    <linear>
                                        <radiogroup margin="0 16">
                                            <radio id="type1" text="方式一    " />
                                                <input id="type1Content" hint="             1-10            " />
                                            
                                                <radio id="type2" text="方式二    " checked="true" /><input id="type2Content" hint="    1,3,5,7,8,9,10    "  />
                                            
                                        </radiogroup>
                                    </linear>
                                    <linear gravity="center">
                                    </linear>                              
                                </vertical> 

                            </ScrollView>
                               <vertical>   
                                <linear gravity="center">
                                    <button id="help" text="使用帮助" h="60" w="100" /><button id="delete" text="删除好友" h="60" w="100" /> <button id="add" text="添加好友" h="60" w="100" />
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

                            
                          
                            
                            <button id="viewlog" text="查看日志" />
                        </vertical>
                    </frame>
                </viewpager>
            </vertical>
        </drawer>
    );
    activity.setSupportActionBar(ui.toolbar);
    ui.page3.text("每填写或者修改一个账号时，请点击其下方对应的确认按钮，填写或修改完毕再点击最下方的“保存配置到文件”按钮")

    //设置滑动页面的标题
    ui.viewpager.setTitles(["设置", "录入信息", "使用帮助"]);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);
    //初始化界面
    let accounts_list = config_friends_manager.accounts_list

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
            config_friends_manager.accounts_list = accounts_list
            remark_list = remark_list_update(config_friends_manager)
            storage.put("config_friends_manager", config_friends_manager)
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
        //  config_friends_manager.accounts_list=accounts_list
    });

    
    //initForm2()
    let FriendsQr = config_friends_manager.FriendsQr ? config_friends_manager.FriendsQr:[]
    var initForm2 = function () {
        let type1Content = config_friends_manager.type1Content ? config_friends_manager.type1Content:''
        let type2Content = config_friends_manager.type2Content ? config_friends_manager.type2Content:''
        let type = config_friends_manager.type ? config_friends_manager.type:1
        for (var i = 1; i <= FriendsQr.length; i++) {
            ui["friend" + i].text(FriendsQr[i - 1] + "")
        }
        if (type == 1) { 
            ui.type1.checked = true 
            ui.type1Content.text(type1Content + "");
        }else { 
            ui.type2.checked = true 
            ui.type2Content.text(type2Content + "");
        }


    };
    //   <button id="back" text="上一步" h="60" w="130"/>
    initForm2();

    ui.add.click(() => {
        if (config_friends_manager.remainTimes<1) {
            toastLog("您的次数已用尽")
            exit()
        }
        if (config_friends_manager.deadline - now< 0) {
            toastLog("您的使用期限已结束")
            exit()
        }
        config_friends_manager.opetation = 1
        var res=pre_work()
        saveConfig(dir)
        threads.shutDownAll()
        threads.start(function () {
            work(res)
        })
    })
    ui.delete.click(() => {
        if (config_friends_manager.remainTimes < 1) {
            toastLog("您的次数已用尽")
            exit()
        }
        if (config_friends_manager.deadline - now < 0) {
            toastLog("您的使用期限已结束")
            exit()
        }
        config_friends_manager.opetation = 0
        var res=pre_work()
        saveConfig(dir)
        threads.shutDownAll()
        threads.start(function () {
            work(res)
        })
    })

    ui.save.click(function () {
        // ui.button_list.setDataSource(remark_list);
        saveConfig(dir)
    })

    // ui.copy_imei.click(function () {
    //     let imei = device.getIMEI()
    //     setClip(imei)
    //     toastLog("本机IMEI为" + imei + "，复制成功")
    // })

    // ui.ok.click(() => {
    //     // log(ui.initialPassword.text())
    //     //  var key=uncompile(uncompile(ui.initialPassword.text()+""))
    //     var key = parseInt(uncompile(uncompile(ui.initialPassword.text() + "", 0), 0))
    //     key = key + "";
    //     var t1 = 9, t2 = 13, t3 = 17
    //     if (key.length == 17) {
    //         t1 = t1 - 1
    //         t2 = t2 - 1
    //         t3 = t3 - 1
    //     }
    //     if (key.length == 16) {
    //         t1 = t1 - 2
    //         t2 = t2 - 2
    //         t3 = t3 - 2
    //     }
    //     if (key.length == 15) {
    //         t1 = t1 - 3
    //         t2 = t2 - 3
    //         t3 = t3 - 3
    //     }
    //     if (key.length == 14) {
    //         t1 = t1 - 4
    //         t2 = t2 - 4
    //         t3 = t3 - 4
    //     }
    //     if (key.length == 19) {
    //         t1 = t1 + 1
    //         t2 = t2 + 1
    //         t3 = t3 + 1
    //     }
    //     //86611103858332
    //    // log(key)       
    //     var date = new Date();
    //     var now = date.getTime();
    //     var numOfAccounts = 2*6;
    //     //log(key.slice(t1, t2))
    //     //log('t1','t2')
    //     //log(t1)
    //    // log(t2)
    //     //log(numOfAccounts)
        
    //     //log(payByMonth)
    //     //console.log(deadline);
    //    // aa = parseInt((Math.sin((Math.floor(now / 100000000)) + 19) * 1000000000).toString().slice(0, 9))
    //     //bb = Imei.slice(6, 15) % 1000000000
    //     //var key0 = aa + bb + "" + (1001 + parseInt(numberOfAccounts)).toString() + "" + validity + '' + (payByMonth + 0)

    //     var imei = device.getIMEI() + ""
    //     if (imei.length == 14) {
    //         imei += "" + 0
    //     }
    //     //log(imei)       
    //     var keywordOfTime = Math.floor(parseInt(key) / 1000000000) - parseInt(imei) % 1000000000
    //     var keyNow = parseInt(((Math.sin(Math.floor(now / 100000000) + 19)) * 1000000000).toString().slice(0, 9))
    //     //log(keyNow)
    //     //log(keywordOfTime)

    //     // log(key.slice(12,15))
    //     // log(numOfAccounts)
    //     //   log(keywordOfPrime)
    //     if (true) {
    //         toastLog("开始破解")
    //         var payByMonth = key[t3]
    //         var imei = device.getIMEI();
    //         config_friends_manager.imei = imei
    //         config_friends_manager.numOfAccounts = numOfAccounts
    //         config_friends_manager.payByMonth = payByMonth
    //         config_friends_manager.pay=true
    //         if (true) {
    //             var deadline = now + 24 * 3600 * 1000 * 7;
    //             config_friends_manager.deadline=deadline
    //             config_friends_manager.remainTimes += numOfAccounts*60
    //         }
    //         else{
    //             config_friends_manager.deadline=deadline
    //             config_friends_manager.remainTimes += numOfAccounts*60
    //         }
    //         //log(config_friends_manager)
    //         saveConfig(dir);
    //         toastLog("破解成功,重启软件生效!");
    //     }
    //     else {
    //         toastLog("激活码正确")
    //         var payByMonth = key[t3]
    //         var imei = device.getIMEI();
    //         config_friends_manager.imei = imei
    //         config_friends_manager.numOfAccounts = numOfAccounts
    //         config_friends_manager.payByMonth = payByMonth
    //         config_friends_manager.pay=true
    //         if (true) {
    //             var deadline = now + 24 * 3600 * 1000 * 7;
    //             config_friends_manager.deadline=deadline
    //             config_friends_manager.remainTimes += numOfAccounts*60
    //         }
    //         else{
    //             config_friends_manager.deadline=deadline
    //             config_friends_manager.remainTimes += numOfAccounts*60
    //         }
    //         //log(config_friends_manager)
    //         saveConfig(dir);
    //         toastLog("激活成功,重启软件生效!");
    //     }

    // });
    // 
    ui.viewlog.click(() => {
        if (files.isFile("/sdcard/antForest蚂蚁森林/加删好友日志.txt")) {
            app.viewFile("/sdcard/antForest蚂蚁森林/加删好友日志.txt");
        }
        else {
            toastLog("没有日志文件")
        }

    })

    function saveConfig(dir) {
        //config_friends_manager.sp1 = ui.sp1.getSelectedItemPosition()
        storage.put("config_friends_manager", config_friends_manager)
        let str = JSON.stringify(config_friends_manager)
        //log(config_friends_manager.remark_list)
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


function pre_work() {
    var FriendsQr = []
    var Accounts = []
    accounts_list=config_friends_manager.accounts_list
    for (var i = 1; i < 6; i++) {
        // log(ui["friend"+i].text())
        if (ui["friend" + i].text()) {
            FriendsQr.push(ui["friend" + i].text())
            //log(ui["friend" + i].text())
        }
    }
    var type1Content = ui.type1Content.text()
    var type1Content = type1Content.replace(/－/g, "-")
    var type2Content = ui.type2Content.text()
    var type2Content = type2Content.replace(/，/g, ",")
    if (ui.type1.checked) {
        type = 1
        startOrder = parseInt(type1Content.split("-")[0]) - 1
        endOrder = parseInt(type1Content.split("-")[1])
        // log(startOrder+"/"+ endOrder)
        Accounts = accounts_list.slice(startOrder, endOrder)
    } else {
        type = 2
        indexSet = type2Content.split(",")
        for (var j = 0; j < indexSet.length; j++) {
            i = parseInt(indexSet[j]) - 1
            Accounts.push(accounts_list[i])
        }
    }
    res={}
    res.FriendsQr = FriendsQr 
    res.Accounts = Accounts
    config_friends_manager.FriendsQr=FriendsQr
    config_friends_manager.type1Content = type1Content 
    config_friends_manager.type2Content = type2Content 
    return (res)
}
//////浇水函数部分：
///函数部分
function work(res) {
    auto.waitFor()//  auto();
    console.show()
    var Accounts=res.Accounts
    var AccountsFinish = config_friends_manager.AccountsFinish ? config_friends_manager.AccountsFinish:[]
    var FriendsQr=res.FriendsQr
    var numOfAccounts=config_friends_manager.numOfAccounts
    var opetation = config_friends_manager.opetation
    for (var i = 0; i < Accounts.length; i++) {
        account = Accounts[i]
        if (AccountsFinish.length <= numOfAccounts+2) {
            if (AccountsFinish.indexOf(account.account) < 0) {
                AccountsFinish.push(account.account)
                storage.put("AccountsFinish", AccountsFinish)
            }

        } else if (AccountsFinish.indexOf(account.account) < 0) {
            toastLog("此账号不在原有账号中")
            exit()
        }
        
        switchAccount(account.account, account.password);
        
        // switchAccount(i+1);
        log("当前位于第" + account.order + "个账号");
        for (var j = 0; j < FriendsQr.length; j++) {
            var url = FriendsQr[j]//收款码最后一段FrendsQr
            app.startActivity({
                data: "alipayqr://platformapi/startapp?saId=10000007&" + "clientVersion=3.7.0.0718&qrcode=" + url
            })
            if (parseInt(opetation)) {
                var op=addFriend()
            }
            else { 
                var op=deleteFriend() 
            }
            if(op){
                config_friends_manager.remainTimes -= 1
                storage.put("config_friends_manager", config_friends_manager)
                //console.log('remainTime' + config_friends_manager.remainTimes);
            }
        }
    }
    exit();
}


function save() {
    
    // log(Accounts)
    storage.put("FriendsQr", FriendsQr)
    //      log
    //   storage.put("name",name) 
    storage.put("type", type)
    storage.put("type1Content", type1Content)
    storage.put("type2Content", type2Content)
}


function addFriend() {  
    var op=false
    var obj = textMatches(/加好友|发消息/).findOne()
    var name0 = idContains("tv_name").findOne()
    var name = name0 ? name0.text() : ""
    if (obj.text() == "加好友") {
        click("加好友")
        //obj.click()
        text("发消息").findOne(2000)
        log("已成功添加" + name)
        sleep(1000)
        op=true
    }else { 
        log(name + "已是好友，无需再添加") 
        sleep(500)
    }
    back();
    sleep(1000)
    return op
}

function deleteFriend() {  
    var op = false
    var obj = textMatches(/加好友|发消息/).findOne()
    var name0 = idContains("tv_name").findOne()
    var name = name0 ? name0.text() : ""
    if (obj.text() == "发消息") {
        var obj = idContains("right_container_2").desc("设置").findOne()
        obj.click()
        sleep(200)
        clickCenter(obj)
        sleep(200)
        clickCenter(obj)
        //if(obj.click()&&clickCenter(obj)){}
        //clickCenter(obj)
        idContains("set_delete").text("删除").findOne().click()
        //click("删除")
        idContains("ensure").text("删除").findOne().click()
        click("删除")
        log("已成功删除" + name)
        op = true
        text('首页').findOne(1000)
    }
    else {
        log(name + "不是好友，无需删除")
        sleep(1000)
        back()
        //   sleep(1000)
    }
    //back();
    sleep(1000)
    //back();
    return op
}


function clickCenter(obj) {
    let b = obj.bounds()
    return (click(b.centerX(), b.centerY()))
}


function switchAccount(account, key) {
    this.logIn = function (account, key) {
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
    app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?appId=20000008",
    }));
    threads.start(function () {
        obj = textMatches("换个验证方式|密码登录|换个方式登录").findOne(4000)
        click("密码登录")
        click("换个验证方式")
        click("换个方式登录")
    })
    this.logIn(account, key)
    threads.start(function () {
        //var obj=desc("下次再说").findOne(10000)
        var obj = text("自助解限").findOne(10000)
        if (obj) {
            sleep(2000)
            click(500, 950)
            //clickCenter(obj)
        }
    })
}