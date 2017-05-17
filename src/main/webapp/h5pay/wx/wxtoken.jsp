<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title></title>
</head>

<script type="text/javascript">
function gotox(url){
	window.location.href = url;
}
</script>

<body
	onload="gotox('https://open.weixin.qq.com/connect/oauth2/authorize?appid=XXX&redirect_uri=http://XXX/h5pay/wx/wxReturn.do&response_type=code&scope=snsapi_base&state=mid-888002199990001')">
</body>
</html>