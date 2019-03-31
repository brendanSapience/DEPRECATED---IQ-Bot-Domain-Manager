


exports.GetAuthStatus = function(JsonResp){

	var jsonr = JSON.parse(JsonResp);
	var token = jsonr['token'];
	//console.log("Debug serv: Success:"+Status);
	if(token){
		return true;
	}else{
		return false;
	}
	//return Status;
	

};
