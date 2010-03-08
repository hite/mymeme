/**
 * @author hite_091109_2ndinst
 * @date 2009-12-5 18:45:55
 */

var curpage = 0,pageSize=10;
var authorCache = new Array();

var toDashBoard = function(){
		var u = User();
		window.location.assign("home.html?guid="+u.guid);
}

 var morePage =function(){
 	curpage++;
	window.location.assign(window.location.href+"#page="+curpage)
	//myhome posts
 }


 var refactoredPost = function(posts){
 	posts.each(function(item){
		var author_guid = item.guid;
		//check Cache
		if(authorCache[author_guid]){
			var m =authorCache[author_guid];
			item.author_name = m.name;
			item.author_avatar = m.avatar_url;
			item.author_url = item.url;
			item.auhor_title = item.title;
		}else{
			var query ={
				q:"SELECT * FROM meme.info WHERE owner_guid= '"+author_guid+"'",
				format:'json',
				asyn:false,
				cbFunction:function(reply){
					var m = reply.query.results.meme;
					item.author_name = m.name;
					item.author_avatar = m.avatar_url;
					item.author_url = item.url;
					item.auhor_title = item.title;
					//store
					authorCache[author_guid] = m;
				}
			};
			new Ajax(query);
		}
	});
	return posts;
 }
 /**
  * 返回 包含posts的div元素，以class=group-post的div为组
  * @param {Object} posts json格式的posts
  */
  var post = function(posts){
		posts = refactoredPost(posts);
		var inner = new Element("div",{class:"group-post"	});
		posts.each(function(item){
			
			var div = new Element("div",{class:"post"});
			//author
			var author = new Element("a",{
				href:"index.html?guid="+item.guid,
				target:"_blank",
				title:item.author_name
			});
			new Element("img",{
				src:item.author_avatar,
				title:item.auhor_title
			}).inject(author);
			
			var author_div = new Element("div",{class:"author"});
			author.inject(author_div);
			author_div.inject(div);

			//content
			var content_div = new Element("div",{class:"content"});
			if(item.type=="text"){
				new Element("span",{
					html:item.content
				}).inject(content_div);
			}else if(item.type=="photo"){
				new Element("img",{
					src:item.content,
					title:item.caption
				}).inject(content_div);
			}
			content_div.inject(div);
			
			div.inject(inner);
		});
		
		return inner;
 }
 
 var userInfo = function(m){
 	var inner =$html({
			tag:'img',
				att: {
					src: m.avatar_url,
					style:"float:left;",
					onclick:m.url,
					title:m.title
				}
			});
		var inf = new Element("div");
		inf.setStyle("float","left");
		
		new Element("p",{html:m.name}).inject(inf);
		new Element("p",{html:m.description}).inject(inf);
		new Element("p",{html:'you have '+m.followers +' followers .'}).inject(inf);
		inner +=inf.innerHTML;
		return inner;
 }
 
 var $html = function(options){
 	var html;
 	if(options.tag){
		html = "<"+options.tag;
		var obj= options.att;
		if(obj){
			 for (var each in obj) 
             if (obj.hasOwnProperty(each)) {
			 	html +=" "+each+"='"+obj[each]+"' ";
             }
		}
		html +=">";
		if(options.nested){
			html += $html(options.nested);
		}
		html += "</"+options.tag+">";
	}else{
		html = options;
	}
	
	return html;
 }
 /**
  * 根据不同的类型返回不同url
  * @param {Object} options
  */
 var generateQuery = function(options){
 	var queryURL = "";
 	if("private"==options.type){
		queryURL = options.q;
	}else{
	    var BASEURL = "http://query.yahooapis.com/v1/public/yql";
	 	if(options){
		    queryURL += BASEURL;
			queryURL += "?";
			queryURL +=toQueryString(options);
		}
	}
	return queryURL;
 }

 var toQueryString = function(obj){
    var parts = [];
    for (var each in obj) 
        if (obj.hasOwnProperty(each)) {
            parts.push(encodeURIComponent(each) + '=' + encodeURIComponent(obj[each]));
        }
    return parts.join('&');
};

 var Ajax = function(options){
 		var xmlHttp ;
		if (window.ActiveXObject) {
        	xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }else if (window.XMLHttpRequest) {
       		 xmlHttp = new XMLHttpRequest();
        }
		var url = generateQuery(options);
		var asyn = options.asyn==undefined?true:options.asyn;
		xmlHttp.open("POST", url, asyn);
		

	    xmlHttp.onreadystatechange = function(){
			if (xmlHttp.readyState == 4) {//completed
				if(xmlHttp.status==200 || xmlHttp.status == 304){//success or local OK
					
					var args ; 
					if(options.format){
							if("json"==options.format.toLowerCase()){
								args= JSON.decode( xmlHttp.responseText);	
							}else if("xml"==options.format.toLowerCase()){
								args = xmlHttp.responseXML;
							}
					}else{
						args =  xmlHttp.responseText;
					}
					var callback = options.cbFunction;
					if(typeof(callback)=="function"){
						callback(args);
					}else{
						window[callback](args);
					}
				}
			}
		};
	    xmlHttp.send(options.data==undefined?"":options.data);
		//firefox does't work well when asyn=false;
		if(!asyn){
			if (xmlHttp.readyState == 4) {//completed
				if(xmlHttp.status==200 || xmlHttp.status == 304){//success
					
					var args ;
					var type = options.format.toLowerCase();
					if("json"== type){
						args= JSON.decode(xmlHttp.responseText);	
					}else if("xml"==type){
						args =xmlHttp.responseXML;
					}else{
						args= xmlHttp.responseText;
					}
					var callback = options.cbFunction;
					if(typeof(callback)=="function"){
						callback(args);
					}else{
						window[callback](args);
					}
				}
			}
	    }  
 }
 
 var paramsMap = function(url){
 	var reg =new RegExp("^(.)*\\?","i");
	var args = url.replace(reg,"").replace(reg.compile("#(.)*$"),"").split("&");
	
	var params = new Array();
	args.each(function(item,index){
	     var map = item.split("=");  
	     if(map.length==2){
		    params[map[0]] = map[1];
	    }
	});
	return params;
 } 
 
 var User =  function(){
 	var u ={};
	var userName = $("userName")?document.getElementById("userName").value:null;
	if (paramsMap(window.location.search)["userName"]) {
		userName = paramsMap(window.location.search)["userName"];
	}
	u.userName = userName;
	
    var guid = $("guid")?document.getElementById("guid").value:null;
	if (paramsMap(window.location.search)["guid"]) {
		guid = paramsMap(window.location.search)["guid"];
	}
	u.guid = guid ;
 	return u;
 };
