
//var output;
if(typeof port == "undefined") 
	 port = 26571;
var wsUrl = "ws://127.0.0.1:"+port+"/"+ getCmdline();
var iTryCount = 0;
var bRetry = false;
var bConnect = false;
var bReadJson = false;
var appDownloadUrl = "./CloudAppPublisher/CloudAppInstall 22.0/CloudAppLauncher_Installer.exe";
var launcherUrl = "..";
var appNameJson = "apprun.json";
var runapp= "cloudlauncher://" + getCmdline();
var meter1 = 0;
var meter2 = 0;

window.addEventListener("load", onLoad, false); 

function onLoad() {          
		  try {
				var laurpackage = window.document.getElementById("launcherpackage");
				$.ajaxSettings.async = false;
				$.getJSON(appNameJson, function (data) {
					var jsonObj = data;
					launcherUrl = jsonObj["deployment_urls"]["launcher"];
					if(launcherUrl.length > 0)
						appDownloadUrl = getHost(launcherUrl) + "/CloudAppLauncher_Installer.exe";
					bReadJson = true;
				});
				laurpackage.href = appDownloadUrl;
				var runappurl = window.document.getElementById("runapplication");
				runappurl.href = runapp;
				laurpackage.addEventListener('click',function(){
					if(meter2 == 0){
						meter2=makeAutoRun(4000);
					}
				})
				init();
			  }          
          catch (ex) {
            showRun();
          }
 }

 
function init() {
	output = document.getElementById("output");
	
	if(window.WebSocket){
		writeToScreen('This browser supports WebSocket');
			}else{
		writeToScreen('This browser does not supports WebSocket');
			}		
	testWebSocket();	
	meter1 = makeTimeout(1500);	
} 

function testWebSocket() {		
	writeToScreen('create socketing..');
	bConnect = false;
	websocket = new WebSocket(wsUrl);
	websocket.onopen = function() {
		onOpen();
	};
	websocket.onclose = function() {
		onClose();
	};
	websocket.onmessage = function(evt) {
		onMessage(evt);
	};
	websocket.onerror = function(evt) {
		//onError(evt);
	};
	
} 

function onOpen() 
{  	   
} 

function onClose() {
	showRun();
	//writeToScreen("DISCONNECTED");
} 

function showRun(){
	if(!bRetry && !bConnect)
	{	
		window.clearInterval(meter1);
		bRetry = true;
		var elt = document.createElement('a');
		elt.setAttribute('href', runapp);
		elt.style.display = 'none';
		document.body.appendChild(elt);
		elt.click();
		document.body.removeChild(elt);
		window.document.getElementById("showrun").style.display = ""
		writeToScreen('<span style="color: #ff0000;"> </span>');		
	}
}

function onMessage(evt) {
	
	var strData = decodeURI(evt.data);
			
	if((strData.indexOf('Error') >= 0))
	{
		writeToScreen('<span style="color: #ff0000;">'+ strData +'</span>');
		websocket.close();	
		showRun();
		window.clearInterval(meter1);
	}
	else if(!isNaN(evt.data))
	{			
		bConnect = true;				
		wsUrl = "ws://127.0.0.1:"+strData+"/"+ getCmdline();
		writeToScreen("modify port:" + evt.data);
		websocket.close();
		window.clearInterval(meter1);
		window.clearInterval(meter2);
		testWebSocket();
	}
	else if((strData.indexOf('finish') >= 0))
	{
		bConnect = true;
		websocket.close();		
		window.clearInterval(meter1);
	}
	else if(strData.indexOf('connect success') >= 0)
	{
		writeToScreen('<span style="color: #0088ff;">RESPONSE: '+ strData+'</span>');			
		bConnect = true;
		window.clearInterval(meter2);
		window.clearInterval(meter1);
	}
	else
	{			
		writeToScreen('<span style="color: #0000ff;">RESPONSE: '+ strData+'</span>');
		bConnect = true;
		window.clearInterval(meter2);
		window.clearInterval(meter1);
	}
	
} 

function onError(evt) {
	 writeToScreen('<span style="color: red;">ERROR: uninstall service '+ evt.data +'</span>');
	 websocket.close();       
} 

function doSend(message) {
	writeToScreen("SEND: " + message); 
	websocket.send(message);
} 

function writeToScreen(message) {
	var pre = document.getElementById("outtext");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	//output.appendChild(pre);
} 

function makeTimeout(nTimeout){
	return window.setInterval(function(){
		//writeToScreen("connect timeout");
		showRun();		
	},nTimeout)
}

function makeAutoRun(nTimeout){
	return window.setInterval(function(){
		//writeToScreen("connect timeout");
		testWebSocket();
	},nTimeout)
}

function isMatchLauncherType(notSupportStartMode) {
    var launcherType = -1;
    $.ajaxSettings.async = false;
	var jsonUrl = "./CloudAppPublisher/CloudAppInstall/LauncherSetup.json?varRandom=" + Math.random();
	if(bReadJson)
	{
		jsonUrl = launcherUrl + "/LauncherSetup.json?varRandom=" + Math.random();
	}
    $.getJSON(jsonUrl, function (data) {
        var jsonObj = data;
        launcherType = jsonObj["mode"];
    });

    if (notSupportStartMode == launcherType) {
        return false;
    }
    else {
        return true;
    }
}

function isIE() {
    var strUserAgent = window.navigator.userAgent.toLowerCase();
    var isLowerIE = strUserAgent.indexOf("compatible") > -1 && strUserAgent.indexOf("msie") > -1;   
    var isIE11 = strUserAgent.indexOf('trident') > -1 && strUserAgent.indexOf("rv:11.0") > -1;
    return isLowerIE || isIE11
}

function isWindows7() {
    var bIsWindows7 = false;
    var strUserAgent = window.navigator.userAgent.toLowerCase();

    if (strUserAgent.indexOf("windows nt 6.1") > -1 || strUserAgent.indexOf("windows 7") > -1) {
        bIsWindows7 = true;
    }

    return bIsWindows7;
}

function getCookie(){
	var strCookie = "";
	//strCookie = "name=aaa;pw=111";
	return strCookie;
}

function getCmdline(){
	var strCookie = getCookie();
	var strUrl = window.location.href;	
	if(strCookie.length > 0)
	{
		strUrl += " -cookie ";
		strUrl += strCookie;
	}
	return strUrl;
}

function getHost(launcherdata){	
	var strTmp = launcherdata.substr(0, 4);
	strTmp = strTmp.toLowerCase();
	if(strTmp == 'http')
	{
		return launcherdata;
	}
	
	var strUrl = window.location.origin;	
	if(strUrl.length <= 0)
	{
		strUrl = "http://";
		strUrl += window.location.host;
	}
	
	strUrl += "/" + launcherdata;
	
	return strUrl;
}