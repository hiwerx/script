// ==UserScript==
// @name         CSDN优化
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  去除登录弹窗，代码免登录复制
// @author       hiwerx
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      AGPL License
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
   
    let host = location.host
    if(host.indexOf('zhihu')>-1){
        cleanZhuhu()
    }else if(host.indexOf('csdn')>-1){
        //移除主页链接，将主页用于点击复制
        $('.toolbar-logo > a').removeAttr('href')
        $('.toolbar-logo > a > img').attr('title','点此复制选中文本')
        copyPcContentListen()
        cleanCsdn()
    }
    // Your code here...
})();

function cleanCsdn(){
    new Promise((resolve, reject) => {
        setTimeout(function() {
            // 关闭登录弹窗
            let boxTag = document.querySelector("#passportbox");
            if(boxTag!=null)click("#passportbox > span")

            // 继续浏览器浏览
            let pageContinueTags = document.querySelectorAll(".wap-shadowbox")
            for (let pageContinueTag of pageContinueTags ) {
                console.log('pageContinueTag: '+pageContinueTag)
                if(pageContinueTag!=null){
                    let continueTagStyle = pageContinueTag.getAttribute('style')
                    console.log(continueTagStyle)
                    if('display:none;' == continueTagStyle){
                        console.log('display:none;清楚定时器')
                    }
                    pageContinueTag.setAttribute('style','display:none;')
                }
            }
            resolve(1)
        },1000);
    }).then((data) => {
        // 关闭常驻页面底部的 前往csdn按钮
        let openAppTags = document.querySelectorAll(".feed-Sign-style-new")
        for(let opTag of openAppTags){
            opTag.setAttribute('class','')
        }
        // 移出正文 打开app按钮
        $('.btn_open_app_prompt_div').remove()
        //移出广告
        $('.spec_space').remove()

        // 去除令人作呕的点击列表就自动下载app和会员才能查看的链接
        let links = document.querySelectorAll("#recommend > div > dl > div")
        for (let index = links.length-1; index >=0; index--) {
            let link = links[index];
            if(link.getAttribute('data-type')=="download"){
                link.parentElement.remove();
            }else{
                link.removeAttribute('class')
            }
        }
    })

    // 允许代码复制
    let codeTags = document.querySelectorAll('code')
    for (let codeTag of codeTags) {
        let codeStyle = codeTag.getAttribute('style')
        if(codeStyle!=null&&codeStyle!=''){
            codeTag.setAttribute('style',codeStyle +'  user-select: all;')
        }else{
            codeTag.setAttribute('style','  user-select: all;')
        }
    }

    //代码自动展开
    let zhankaiTags = document.querySelectorAll(".hide-preCode-bt")
    for (let name of zhankaiTags ) {
        name.click()
    }

    // 展开剩余页面
    let openCodeTage = document.querySelector(".detail-open-removed")
    if(openCodeTage!=null)openCodeTage.click()

    // 去除点击查看更多内容后弹出框
    let tanchTags = document.querySelector(".app-bt-cance.read_more_btn")
    if(tanchTags!=null)tanchTags.click()
   /* for(let tanchTag of tanchTags){
        tanchTag.click()
    }*/

    // 去除公众号广告
    let extensionBox = document.querySelector('#blogExtensionBox')
    if(extensionBox!=null)extensionBox.setAttribute('style','display:none;')

    // 去除手机网页打开小程序按钮
    let weixin = document.querySelector('.feed-Sign-weixin')
    if(weixin!=null)weixin.removeAttribute('class')

    // 继续监控页面
    setInterval(function() {
        // 去除选浏览器继续还是打开app弹框,监控shadowbox，有冒头就按下去
        let pageContinueTags = document.querySelectorAll(".wap-shadowbox")
        for (let pageContinueTag of pageContinueTags ) {
            //  console.log('pageContinueTag: '+pageContinueTag)
            if(pageContinueTag!=null){
                let continueTagStyle = pageContinueTag.getAttribute('style')

                pageContinueTag.setAttribute('style','display:none;')
            }
        }
        // 去除不定时弹出的登录框
        let boxTag = document.querySelector("#passportbox");
        if(boxTag!=null)click("#passportbox > span")

        //去除令人作呕的点击列表就自动下载app
        let links = document.querySelectorAll(".recommend-jump-app.open_app_channelCode")
        for (let link of links ) {
            link.removeAttribute('class')
        }
    },1000);

}

function cleanZhuhu(){
    let interv = setInterval(function() {
        console.log('监听弹窗')
        let closeLogin = document.querySelector(".Button.Modal-closeButton.Button--plain")
        if(closeLogin!=null)closeLogin.click()

        let rightLogin = document.querySelector(".css-1ynzxqw")
        if(rightLogin!=null)rightLogin.setAttribute('style','display:none;')
    },500)

    setTimeout(function() {
        console.log('结束轮询')
        clearInterval(interv)
    },5000)

}

//点击动作
function click(style){
    let styleTag = document.querySelector(style)
    if(styleTag!=null)styleTag.click()
}

function copyPcContentListen(){
    //监听csdn home点击事件
    let homeTag = document.querySelector(".toolbar-logo")
    if(homeTag==null)return
    homeTag.addEventListener('click',function(e){
        var txt = window.getSelection?window.getSelection():document.selection.createRange().text;
        if(txt!=null&&txt!=''){
            let body = document.body
            let div = document.createElement('div')
            div.innerHTML='<textarea  id="copyId"  >'+txt+'</textarea >'
            body.append(div)
            let copyText = document.getElementById("copyId")
            copyText.select()
            document.execCommand('Copy')
            $('#copyId').remove()
        }else{
            alert('请选中复制文本')
        }
    })
}
