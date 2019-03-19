


exports.GetAuthStatus = function(JsonResp){

	var jsonr = JSON.parse(JsonResp);
	var Status = jsonr['success'];
	//console.log("Debug serv: Success:"+Status);
	return Status;
	

};
