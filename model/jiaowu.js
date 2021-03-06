/**
 * Created by wx_swjtu on 2017/9/3.
 */
var fs=require("fs");
var charset = require('superagent-charset');
var superagent=charset(require("superagent"));
var cherrio=require("cheerio");



function Get_Captcha(type,callback) {
    //type=0 swjtu type=1 swjtu_em
    let url="http://jiaowu.em.swjtu.edu.cn/servlet/GetRandomNumberToJPEG";
    if(type==0)
    {
        url="http://jiaowu.swjtu.edu.cn/servlet/GetRandomNumberToJPEG"
    }
    superagent
        .get(url)
        .end(function (err,sres) {
            //console.log(sres.header);
            callback(err,sres.body,sres.header['set-cookie']);
        });
}

function Login(type,username,password,ranstring,globalcookie,callback) {
    function ClearBr(key) {
        key = key.replace(/<\/?.+?>/g,"");
        key = key.replace(/[\r\n]/g, "");
        return key;
    }
    let url="http://jiaowu.em.swjtu.edu.cn/servlet/UserLoginSQLAction";
    if(type==0)
    {
        url="http://jiaowu.swjtu.edu.cn/servlet/UserLoginSQLAction"
    }
    //ranstring表示验证码
    superagent
        .post(url)
        .charset()
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Cookie','user_id=2015121613; user_type=student; user_style=modern; language=cn; '+globalcookie)
        .set('Referer','http://jiaowu.em.swjtu.edu.cn/service/login.jsp?user_type=student')
        .set('Origin','http://jiaowu.em.swjtu.edu.cn')
        .type('form')
        .send({"url":"../servlet/UserLoginCheckInfoAction"})
        .send({"OperatingSystem":""})
        .send({"Browser":""})
        .send({"user_id":username})
        .send({"password":password})
        .send({"ranstring":ranstring})
        .send({"user_type":"student"})
        .send({"btn":""})
        .end(function (error,sres) {
            let $=cherrio.load(sres.text);
            callback(error,ClearBr($('body').text()));
        });
}

module.exports={
    Get_Captcha:Get_Captcha,
    Login:Login,
};