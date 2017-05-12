package com.sand.weixin.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipaySystemOauthTokenRequest;
import com.alipay.api.response.AlipaySystemOauthTokenResponse;
import com.sand.weixin.SandpayConstants;
import com.sand.weixin.pojo.GatewayOrderPayRequest;
import com.sand.weixin.pojo.GatewayOrderPayRequest.GatewayOrderPayRequestBody;
import com.sand.weixin.pojo.GatewayOrderPayResponse;
import com.sand.weixin.pojo.GatewayOrderPayResponse.GatewayOrderPayResponseBody;
import com.sand.weixin.util.BigDecimalUtils;
import com.sand.weixin.util.HttpUtils;

import cn.com.sandpay.cashier.sdk.SandpayClient;
import cn.com.sandpay.cashier.sdk.SandpayRequestHead;
import cn.com.sandpay.cashier.sdk.SandpayResponseHead;
import cn.com.sandpay.cashier.sdk.util.CertUtil;
import cn.com.sandpay.cashier.sdk.util.DateUtil;
import cn.com.sandpay.cashier.sdk.util.SDKUtil;



@Controller
public class PayController {
	
	private Logger      logger = LoggerFactory.getLogger(PayController.class);
	
	@RequestMapping(value="payInit")
	public String openPay(HttpServletRequest request,HttpServletResponse response) {
		String userInfo=request.getHeader("User-Agent");
		logger.info("用户环境信息:"+userInfo);
		
		if(userInfo.indexOf("MicroMessenger")!=-1){
			logger.info("进行微信授权");
			return "/wx/wxtoken";
		}else if(userInfo.indexOf("AlipayClient")!=-1){
			logger.info("进行支付宝授权");
			return "/alipay/alitoken";
		}else{
			logger.info("error");
			return "error";
		}		
	}
	
	
	
	
	
	@RequestMapping(value="alipayReturn")
	@ResponseBody
	public ModelAndView alipay(HttpServletRequest request,HttpServletResponse response) {
		String userId ="";
		
		String app_id=request.getParameter("app_id");
		String source=request.getParameter("source");
		String scope=request.getParameter("scope");
		String auth_code=request.getParameter("auth_code");
		String state=request.getParameter("state");
		logger.info("支付宝返回app_id:"+app_id );
		logger.info(" source:"+source );
		logger.info(" scope:"+scope );
		logger.info(" auth_code:"+auth_code);
		logger.info(" state:"+state);
		
		String APP_ID = "XXX";
		String APP_PRIVATE_KEY = "XXX";
		String ALIPAY_PUBLIC_KEY = "XXX";
		AlipayClient alipayClient =
				new DefaultAlipayClient("https://openapi.alipay.com/gateway.do",
						APP_ID,APP_PRIVATE_KEY,"json","GBK",
						ALIPAY_PUBLIC_KEY,"RSA2");
		AlipaySystemOauthTokenRequest alirequest = new AlipaySystemOauthTokenRequest();
		alirequest.setCode(auth_code);
		alirequest.setGrantType("authorization_code");
		try {
		    AlipaySystemOauthTokenResponse oauthTokenResponse = alipayClient.execute(alirequest);
		    logger.info("支付宝AccessToken = "+oauthTokenResponse.getAccessToken());
		    logger.info("支付宝UserId = "+oauthTokenResponse.getUserId());
		    userId = oauthTokenResponse.getUserId();
		} catch (AlipayApiException e) {
		    //处理异常
		    e.printStackTrace();
		}
		request.setAttribute("userId", userId);
		
		ModelAndView mv = new ModelAndView();
		mv.addObject("userId", userId);
		mv.setViewName("alipay/payfor_alipay");
		return mv;
	}
	
	
	@RequestMapping(value= {"wx/order", "order"})
	@ResponseBody
	public String order(HttpServletRequest request,HttpServletResponse response) {
		BigDecimal amt=new BigDecimal(request.getParameter("amt"));
		String userId=request.getParameter("userId");
		String payMode = request.getParameter("payMode");
		logger.info("amt="+amt);
		logger.info("userId="+userId);
		/**调用支付网关公众号下单方法**/
		String payAmt = BigDecimalUtils.bigDecimalTo12AmtString(amt);
		

		// 加载证书
		try {
			CertUtil.init("classpath:sand-test.cer", "classpath:mid-test.pfx", "123456");
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		// 组后台报文
		SandpayRequestHead head = new SandpayRequestHead();
		GatewayOrderPayRequestBody body = new GatewayOrderPayRequestBody();
		
		GatewayOrderPayRequest gwOrderPayReq = new GatewayOrderPayRequest();
		gwOrderPayReq.setHead(head);
		gwOrderPayReq.setBody(body);
		
		head.setVersion("1.0");
		head.setMethod("sandpay.trade.pay");
		head.setAccessType("1");
		head.setMid("100211701160001");
		head.setChannelType("07");
		head.setReqTime(DateUtil.getCurrentDate14());
		
		body.setOrderCode(DateUtil.getCurrentDate14());
		
		body.setTotalAmount(payAmt);
		body.setSubject("话费充值");
		body.setBody("用户购买话费0.01");
		//body.setTxnTimeOut("");
		
		
		if(payMode!=null && payMode.equals("sand_wx")){
			//微信
			head.setProductId("00000005");
			body.setPayMode("sand_wx");
			body.setPayExtra("{\"subAppid\":\"XXX\",\"userId\":\""+userId+"\"}");

//			
		}else if(payMode!=null && payMode.equals("sand_alipay")){
			//支付宝
			head.setProductId("00000006");
			body.setPayMode("sand_alipay");
			body.setPayExtra("{\"userId\":\""+userId+"\"}");
		}
		
		
		body.setClientIp("127.0.0.1");
		body.setNotifyUrl("XXX");
		
		
		String credential ="";
		try {
			/**生产环境下单**/
			GatewayOrderPayResponse gwPayResponse = SandpayClient.execute(gwOrderPayReq, "https://cashier.sandpay.com.cn/gateway/api/order/pay");
			SandpayResponseHead respHead = gwPayResponse.getHead();
			
			if(SandpayConstants.SUCCESS_RESP_CODE.equals(respHead.getRespCode())) {
				logger.info("txn success.");
				
				GatewayOrderPayResponseBody respBody = gwPayResponse.getBody();
		        Map map = JSONObject.parseObject(respBody.getCredential());
		        Map params = JSONObject.parseObject(map.get("params").toString());
		        map.put("params",params);
		        credential = JSON.parseObject(map.toString()).toString();
		        logger.info("credential={}",credential);

				//JSON.parseObject(credential);
				
			} else {
				logger.error("txn fail respCode[{}],respMsg[{}].", respHead.getRespCode(), respHead.getRespMsg());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	
		return credential;
	}
	
	
	@RequestMapping(value="wx/wxReturn")
	@ResponseBody
	public ModelAndView wxReturn(HttpServletRequest request,HttpServletResponse response) {
		
		String code=request.getParameter("code");
		String state=request.getParameter("state");
		logger.info("微信返回[code:"+code +  " state:"+state+" ]");
		
		Map<String, Object> param=new HashMap<String, Object>();
		param.put("appid", "XXX");
		param.put("secret", "XXX");
		param.put("code", code);
		param.put("grant_type", "authorization_code");
		
		String ret=HttpUtils.doPost("https://api.weixin.qq.com/sns/oauth2/access_token", param);	
		logger.info("向微信申请access_token返回 " +  ret);
		JSONObject json = JSONObject.parseObject(ret);
		String openid = (String)json.get("openid");
		logger.info("openid返回 " +  openid);
		
		request.setAttribute("userId", openid);
		
		ModelAndView mv = new ModelAndView();
		mv.addObject("userId", openid);
		mv.setViewName("wx/payfor_weixin");
		return mv;
		
	}
	
	
}
