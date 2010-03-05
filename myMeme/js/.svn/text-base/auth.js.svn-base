/**
 * @author hite_091109_2ndinst
 */
var consumer_Key ="dj0yJmk9WFNzYXluTW5IQW1vJmQ9WVdrOVdEVjRhbU5YTXpZbWNHbzlNVEV4TXpRd09EZ3lNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kNw--";
var consumer_Secret ="53f395972cef451b2762145f7afe1dab27cfd8db";

var getReqToken =function(){
	var url = "https://api.login.yahoo.com/oauth/v2/get_request_token";  
    url+="?oauth_nonce="+(new Date().getTime());  
	url+="&oauth_timestamp="+(Math.round(new Date().getTime()/1000)-16*60*60); //time zone
	url+="&oauth_consumer_key="+consumer_Key;
	url+="&oauth_signature_method=plaintext"; 
	url+="&oauth_signature="+consumer_Secret+"%26";  
	url+="&oauth_version=1.0";
	url+="&xoauth_lang_pref=en-us";  
	url+="&oauth_callback=http://www.the631.com/mymeme";
	
	var query ={
			q:url,
			asyn:true,
			type:"private",
			cbFunction:function(reply){
				alert(reply);
			}
		};
		new Ajax(query); 
}
