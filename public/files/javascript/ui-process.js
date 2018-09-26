setSocketListeners();

$(document).ready(function(){

	// When html page loads, retrieve the content of the JSON file that determines the labels for each field.
	socket.emit('get_structure',{});

	// When clicking the Save Fields button, save the labels as a JSON structure and override the existing one (by passing it to the server)
	$('#save-button').click( function(e) { 
		var JsonStructure = "{"+
		'"titleid1":'+'"'+$('#field1id').text()+'",'+
		'"titleid2":'+'"'+$('#field2id').text()+'",'+
		'"titleid3":'+'"'+$('#field3id').text()+'",'+
		'"titleid4":'+'"'+$('#field4id').text()+'",'+
		'"titleid5":'+'"'+$('#field5id').text()+'",'+
		'"titleid6":'+'"'+$('#field6id').text()+'"'+
		"}"
		var JsonData = JSON.parse(JsonStructure);
		console.log(JsonData)
	    socket.emit('save_structure',JsonData);

	});
	
// When clicking the Save Record button, we update the table (no server side action needed here)
	$('#save-data-button').click( function(e) {
		var newRowContent = "<tr>"+
			"<td>"+$('#field1').val()+"</td>"+
			"<td>"+$('#field2').val()+"</td>"+
			"<td>"+$('#field3').val()+"</td>"+
			"<td>"+$('#field4').val()+"</td>"+
			"<td>"+$('#field5').val()+"</td>"+
			"<td>"+$('#field6').val()+"</td>"+
			"</tr>";

		$("#datatable tbody").append(newRowContent);

		$('#field1').val("");
		$('#field2').val("");
		$('#field3').val("");
		$('#field4').val("");
		$('#field5').val("");
		$('#field6').val("");

	});

});

function setSocketListeners(){ 

	// On receiving the content of the JSON file, we update all labels
	socket.on('structure_sent',function(result){
		console.log(result);

		$('#field1id').text(result["titleid1"]);$('#col1').text(result["titleid1"]);
		$('#field2id').text(result["titleid2"]);$('#col2').text(result["titleid2"]);
		$('#field3id').text(result["titleid3"]);$('#col3').text(result["titleid3"]);
		$('#field4id').text(result["titleid4"]);$('#col4').text(result["titleid4"]);
		$('#field5id').text(result["titleid5"]);$('#col5').text(result["titleid5"]);
		$('#field6id').text(result["titleid6"]);$('#col6').text(result["titleid6"]);
	});


	socket.on('server_side_error',function(result){
		console.log("Error on server:"+result);
	});
};
