setSocketListeners();

$(document).ready(function(){

	$('.connectionsettings').hide();
	$('.editdomains').hide();
	$('.createdomains').show();


	// When html page loads, retrieve the content of the JSON file that determines the labels for each field.
	socket.emit('get_structure',{});

	// When clicking the Save Fields button, save the labels as a JSON structure and override the existing one (by passing it to the server)
	$('#CreateDomainButton').click( function(e) { 
			$('#CreateDomainButton a').addClass('active');
			$('#LoadDomainButton a').removeClass('active');
			$('#ConnectionSettings a').removeClass('active');

			$('.createdomains').show();
			$('.connectionsettings').hide();
			$('.loaddomains').hide();

	});

	$('#LoadDomainButton').click( function(e) { 
			$('#LoadDomainButton a').addClass('active');
			$('#CreateDomainButton a').removeClass('active');
			$('#ConnectionSettings a').removeClass('active');

			$('.createdomains').hide();
			$('.connectionsettings').hide();
			$('.loaddomains').show();
	});

	$('#ConnectionSettings a').click( function(e) { 
			$('#ConnectionSettings a').addClass('active');
			$('#CreateDomainButton a').removeClass('active');
			$('#LoadDomainButton a').removeClass('active');
	
			$('.createdomains').hide();
			$('.connectionsettings').show();
			$('.loaddomains').hide();


	});
	



});

function setSocketListeners(){ 

	// On receiving the content of the JSON file, we update all labels
	socket.on('structure_sent',function(result){
		//console.log(result);

	});


	socket.on('server_side_error',function(result){
		console.log("Error on server:"+result);
	});
};
