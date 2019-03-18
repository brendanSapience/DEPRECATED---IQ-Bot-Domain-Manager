setSocketListeners();

$(document).ready(function(){

	$('.connectionsettings').hide();
	$('.editdomains').hide();
	$('.createdomains').hide();


	// When html page loads, retrieve the content of the JSON file that determines the labels for each field.
	socket.emit('get_structure',{});

	// When clicking the Save Fields button, save the labels as a JSON structure and override the existing one (by passing it to the server)
	$('#CreateDomainButton').click( function(e) { 
			$('#CreateDomainButton').addClass('active');
			$('#EditDomainButton').removeClass('active');
			$('#ConnectionSettings').removeClass('active');

			$('.createdomains').show();
			$('.connectionsettings').hide();
			$('.editdomains').hide();

	});

	$('#EditDomainButton').click( function(e) { 
			$('#EditDomainButton').addClass('active');
			$('#CreateDomainButton').removeClass('active');
			$('#ConnectionSettings').removeClass('active');

			$('.createdomains').hide();
			$('.connectionsettings').hide();
			$('.editdomains').show();
	});

	$('#ConnectionSettings').click( function(e) { 
			$('#ConnectionSettings').addClass('active');
			$('#CreateDomainButton').removeClass('active');
			$('#EditDomainButton').removeClass('active');

			$('.createdomains').hide();
			$('.connectionsettings').show();
			//$('.connectionsettings').load('../assets/html/connectionsettings.html');
			$('.editdomains').hide();


	});
	



});

function setSocketListeners(){ 

	// On receiving the content of the JSON file, we update all labels
	socket.on('structure_sent',function(result){
		console.log(result);

	});


	socket.on('server_side_error',function(result){
		console.log("Error on server:"+result);
	});
};
