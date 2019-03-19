
// Internal Functions
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

exports.GetCurrentDate =function(){
	var today = new Date();
	var DD = today.getDate();
	var MM = today.getMonth()+1; //January is 0!
	var YYYY = today.getFullYear();

	DD = checkTime(DD);
	MM = checkTime(MM);

    return YYYY+'-'+MM+'-'+DD;
}

exports.GetCurrentTime = function(){
	var today = new Date();

	var hh = today.getHours();
	var mm = today.getMinutes();
	var ss = today.getSeconds();

	mm = checkTime(mm);
    ss = checkTime(ss);

    return hh+':'+mm+':'+ss;
}

exports.GetCurrentDateTime =function(){
	var today = new Date();
	var DD = today.getDate();
	var MM = today.getMonth()+1; //January is 0!
	var YYYY = today.getFullYear();

	var hh = today.getHours();
	var mm = today.getMinutes();
	var ss = today.getSeconds();

	mm = checkTime(mm);
    ss = checkTime(ss);

	DD = checkTime(DD);
	MM = checkTime(MM);

    return YYYY+'-'+MM+'-'+DD+ ' ' +hh+':'+mm+':'+ss;
}

exports.GetPortFromURL =function(FullURL){
	var SplitURLArr = FullURL.split(":");
	var PortCandidate = SplitURLArr[SplitURLArr.length - 1];
	return PortCandidate;
}

exports.GetRootFromURL =function(FullURL){
	var SplitURLArr = FullURL.split(":");
	var URLCandidate = SplitURLArr[SplitURLArr.length - 2];
	return URLCandidate.replace("//","");

}