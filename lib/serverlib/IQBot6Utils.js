


exports.GetAuthStatus = function(JsonResp){

	var jsonr = JSON.parse(JsonResp);
	var token = jsonr['token'];

	//console.log("Debug serv: Success:"+Status);
	if(token){
		if(token != "timeout"){
			return true;
		}else{
			return false;
		}
		
	}else{
		return false;
	}
	//return Status;
};

exports.GetAuthToken = function(JsonResp){

	var jsonr = JSON.parse(JsonResp);
	var token = jsonr['token'];


	//console.log("Debug serv: Success:"+Status);
	if(token){
		if(token != "timeout"){
			return token;
		}else{
			return "";
		}
		
	}else{
		return "";
	}
	//return Status;
};