!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.paymentjs=e()}}(function(){return function e(t,n,r){function a(i,c){if(!n[i]){if(!t[i]){var u="function"==typeof require&&require;if(!c&&u)return u(i,!0);if(o)return o(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return a(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)a(r[i]);return a}({1:[function(e,t,n){t.exports={userCallback:void 0,innerCallback:function(e,t){'function'==typeof this.userCallback&&('undefined'==typeof t&&(t=this.error()),this.userCallback(e,t),this.userCallback=void 0)},error:function(e,t){return e='undefined'==typeof e?'':e,t='undefined'==typeof t?'':t,{msg:e,extra:t}}}},{}],2:[function(e,t,n){var r={}.hasOwnProperty,a={};t.exports=a,a.channels={sand_h5:e('./channel/sand_h5'),sand_pc:e('./channel/sand_pc'),wx_pub:e('./channel/wx_pub'),ali_pub:e('./channel/ali_pub'),bank_pc:e('./channel/bank_pc')},a.extras={ap:e('./channel/extras/ap')},a.getChannelModule=function(e){if(r.call(a.channels,e))return a.channels[e]},a.getExtraModule=function(e){if(alert("==moduleName=="+e),alert("==extras moduleName=="+a.extras),r.call(a.extras,e))return a.extras[e]}},{"./channel/ali_pub":3,"./channel/bank_pc":4,"./channel/extras/ap":5,"./channel/sand_h5":6,"./channel/sand_pc":7,"./channel/wx_pub":8}],3:[function(e,t,n){var r=(e('../callbacks'),e('../utils'),e('../stash')),a=(e('../channelMod'),{}.hasOwnProperty);t.exports={handleCharge:function(e){var t=e.params;r.jsApiParameters=t,alert("==订单号=="+r.jsApiParameters.tradeNo),this.aliAPICall()},aliAPICall:function(){a.call(r,'jsApiParameters')&&AlipayJSBridge.call("tradePay",{tradeNO:r.jsApiParameters.tradeNO},function(e){alert("==ali resonse=="+e)})}}},{"../callbacks":1,"../channelMod":2,"../stash":10,"../utils":11}],4:[function(e,t,n){var r=e('../utils');({}).hasOwnProperty;t.exports={handleCharge:function(e){var t=e.params,n=e.submitUrl;r.formSubmitNew(n,'post',t)}}},{"../utils":11}],5:[function(e,t,n){var r=e('../../stash'),a={}.hasOwnProperty;!function(){var e={},n={};n.PADCHAR='=',n.ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',n.makeDOMException=function(){try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(t){var e=new Error('DOM Exception 5');return e.code=e.number=5,e.name=e.description='INVALID_CHARACTER_ERR',e.toString=function(){return'Error: '+e.name+': '+e.message},e}},n.getbyte64=function(e,t){var r=n.ALPHA.indexOf(e.charAt(t));if(r===-1)throw n.makeDOMException();return r},n.decode=function(e){e=''+e;var t,r,a,o=n.getbyte64,i=e.length;if(0===i)return e;if(i%4!==0)throw n.makeDOMException();t=0,e.charAt(i-1)===n.PADCHAR&&(t=1,e.charAt(i-2)===n.PADCHAR&&(t=2),i-=4);var c=[];for(r=0;r<i;r+=4)a=o(e,r)<<18|o(e,r+1)<<12|o(e,r+2)<<6|o(e,r+3),c.push(String.fromCharCode(a>>16,a>>8&255,255&a));switch(t){case 1:a=o(e,r)<<18|o(e,r+1)<<12|o(e,r+2)<<6,c.push(String.fromCharCode(a>>16,a>>8&255));break;case 2:a=o(e,r)<<18|o(e,r+1)<<12,c.push(String.fromCharCode(a>>16))}return c.join('')},n.getbyte=function(e,t){var r=e.charCodeAt(t);if(r>255)throw n.makeDOMException();return r},n.encode=function(e){if(1!==arguments.length)throw new SyntaxError('Not enough arguments');var t,r,a=n.PADCHAR,o=n.ALPHA,i=n.getbyte,c=[];e=''+e;var u=e.length-e.length%3;if(0===e.length)return e;for(t=0;t<u;t+=3)r=i(e,t)<<16|i(e,t+1)<<8|i(e,t+2),c.push(o.charAt(r>>18)),c.push(o.charAt(r>>12&63)),c.push(o.charAt(r>>6&63)),c.push(o.charAt(63&r));switch(e.length-u){case 1:r=i(e,t)<<16,c.push(o.charAt(r>>18)+o.charAt(r>>12&63)+a+a);break;case 2:r=i(e,t)<<16|i(e,t+1)<<8,c.push(o.charAt(r>>18)+o.charAt(r>>12&63)+o.charAt(r>>6&63)+a)}return c.join('')},e.url='pay.htm',e.pay=function(t){var o=encodeURIComponent(n.encode(t));a.call(r,'APURL')&&(e.url=r.APURL),location.href=e.url+'?goto='+o},e.decode=function(e){return n.decode(decodeURIComponent(e))},t.exports=e}()},{"../../stash":10}],6:[function(e,t,n){var r=e('../utils');({}).hasOwnProperty;t.exports={handleCharge:function(e){var t=e.params,n=e.submitUrl;r.redirectTo(n+'?params='+t)}}},{"../utils":11}],7:[function(e,t,n){var r=e('../utils');({}).hasOwnProperty;t.exports={handleCharge:function(e){var t=e.params,n=e.submitUrl;r.formSubmit(n,'post',t)}}},{"../utils":11}],8:[function(e,t,n){var r=e('../callbacks'),a=(e('../utils'),e('../stash')),o=e('../channelMod'),i={}.hasOwnProperty;t.exports={handleCharge:function(e){var t=e.params;alert(t);for(var n=['appId','timeStamp','nonceStr','package','signType','paySign'],o=0;o<n.length;o++)if(!i.call(t,n[o]))return void r.innerCallback('fail',r.error('invalid_credential','missing_field_'+n[o]));a.jsApiParameters=t,this.callpay()},callpay:function(){var e=this,t=o.getExtraModule('wx_jssdk');if('undefined'!=typeof t&&t.jssdkEnabled())t.callpay();else if('undefined'==typeof WeixinJSBridge){var n=function(){e.jsApiCall()};document.addEventListener?document.addEventListener('WeixinJSBridgeReady',n,!1):document.attachEvent&&(document.attachEvent('WeixinJSBridgeReady',n),document.attachEvent('onWeixinJSBridgeReady',n))}else this.jsApiCall()},jsApiCall:function(){i.call(a,'jsApiParameters')&&WeixinJSBridge.invoke('getBrandWCPayRequest',a.jsApiParameters,function(e){delete a.jsApiParameters,'get_brand_wcpay_request:ok'==e.err_msg?r.innerCallback('success'):'get_brand_wcpay_request:cancel'==e.err_msg?r.innerCallback('cancel'):r.innerCallback('fail',r.error('wx_result_fail',e.err_msg))})}}},{"../callbacks":1,"../channelMod":2,"../stash":10,"../utils":11}],9:[function(e,t,n){var r=e('./callbacks'),a=e('./channelMod'),o={}.hasOwnProperty,PaymentSDK=function(){};PaymentSDK.prototype={createPayment:function(e,t){'function'==typeof t&&(r.userCallback=t);var n;if('string'==typeof e)try{n=JSON.parse(e)}catch(e){return void r.innerCallback('fail',r.error('json_decode_fail',e))}else n=e;if('undefined'==typeof n)return void r.innerCallback('fail',r.error('json_decode_fail'));var i=n.payMode;if(!o.call(n,'params'))return void r.innerCallback('fail',r.error('invalid_charge','no_params'));var c=a.getChannelModule(i);c.handleCharge(n)}},t.exports=new PaymentSDK},{"./callbacks":1,"./channelMod":2}],10:[function(e,t,n){t.exports={}},{}],11:[function(e,t,n){var r={}.hasOwnProperty,a=t.exports={stringifyData:function(e,t,n){'undefined'==typeof n&&(n=!1);var a=[];for(var o in e)r.call(e,o)&&'function'!=typeof e[o]&&('bfb_wap'==t&&'url'==o||'yeepay_wap'==t&&'mode'==o||'channel_url'!=o&&a.push(o+'='+(n?encodeURIComponent(e[o]):e[o])));return a.join('&')},request:function(e,t,n,o,i,c){if('undefined'==typeof XMLHttpRequest)return void console.log('Function XMLHttpRequest is undefined.');var u=new XMLHttpRequest;if('undefined'!=typeof u.timeout&&(u.timeout=6e3),t=t.toUpperCase(),'GET'===t&&'object'==typeof n&&n&&(e+='?'+a.stringifyData(n,'',!0)),u.open(t,e,!0),'undefined'!=typeof c)for(var s in c)r.call(c,s)&&u.setRequestHeader(s,c[s]);'POST'===t?(u.setRequestHeader('Content-type','application/json; charset=utf-8'),u.send(JSON.stringify(n))):u.send(),'undefined'==typeof o&&(o=function(){}),'undefined'==typeof i&&(i=function(){}),u.onreadystatechange=function(){4==u.readyState&&o(u.responseText,u.status,u)},u.onerror=function(e){i(u,0,e)}},formSubmitNew:function(e,t,n){if('undefined'==typeof window)return void console.log('Not a browser, form submit url: '+e);var a=document.createElement('form');a.setAttribute('method',t),a.setAttribute('action',e),a.setAttribute('target','_blank');for(var o in n)if(r.call(n,o)){var i=document.createElement('input');i.setAttribute('type','hidden'),i.setAttribute('name',o),i.setAttribute('value',n[o]),a.appendChild(i)}document.body.appendChild(a),a.submit()},formSubmit:function(e,t,n){if('undefined'==typeof window)return void console.log('Not a browser, form submit url: '+e);var a=document.createElement('form');a.setAttribute('method',t),a.setAttribute('action',e);for(var o in n)if(r.call(n,o)){var i=document.createElement('input');i.setAttribute('type','hidden'),i.setAttribute('name',o),i.setAttribute('value',n[o]),a.appendChild(i)}document.body.appendChild(a),a.submit()},randomString:function(e){'undefined'==typeof e&&(e=32);for(var t='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',n=t.length,r='',a=0;a<e;a++)r+=t.charAt(Math.floor(Math.random()*n));return r},redirectTo:function(e){return'undefined'==typeof window?void console.log('Not a browser, redirect url: '+e):void(window.location.href=e)},documentReady:function(e){return'undefined'==typeof document?void e():void('loading'!=document.readyState?e():document.addEventListener('DOMContentLoaded',e))}}},{}]},{},[9])(9)});
//# sourceMappingURL=paymentjs.js.map
