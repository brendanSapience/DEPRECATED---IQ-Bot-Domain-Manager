function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function getPositionOfId(dictionary, idToFind){
	//int Pos = -1;
	var idx = 0;
	for(var entry of dictionary){
		//console.log("DEBUG:"+entry.id+":"+idToFind+":");
    	if(entry.id == idToFind){
    		//console.log("IN!");
    		return idx;
    		//break;
    	}
    	//console.log("up");
    	idx++;
	}

	return -1;
}

function getNameFromId(dictionary, idToFind){
	//int Pos = -1;
	//var idx = 0;
	for(var entry of dictionary){
		//console.log("DEBUG:"+entry.id+":"+idToFind+":");
    	if(entry.id == idToFind){
    		//console.log("IN!");
    		return entry.name;
    		//break;
    	}
    	//console.log("up");
    	//idx++;
	}

	return "";
}


$(document).ready(function(){

var FieldDictionary = [];

$("#create_domain").on("click",function(){
	var dom = new Object();
	dom.name = "";
	dom.languages = [];
	dom.fields = [];

	if(!/^(?!\d)[A-Za-z0-9 _]*$/.test($('#domain_name').val())){
		console.log("Error in Domain Name!");

	}else{

	// Populate Domain Name
	dom.name = $('#domain_name').val();

	// Populate Languages
	$('#lang_badges h5 ul').find('li').each(function(){
		var myid = $(this).find('span').attr('id');
		
		dom.languages.push(myid);
	});

	// Populate each Field
	$('#field_list_table tbody').find('tr').each(function(){
		var myFieldInfo = new Object();

		var MasterID = $(this).attr('id');

		var fieldname = $(this).find('td.field_name').text();
		var fieldtype = $(this).find('td.field_type').find('select').val();
		var fielddatatype = $(this).find('td.field_data_type').find('select').val();
		var StandardizedFieldType = "";

		if(fieldtype == "Standard"){StandardizedFieldType = "FORM_FIELD"};
		if(fieldtype == "Table"){StandardizedFieldType = "TABLE_COLUMN_FIELD"};
		var fieldisdefault = $(this).find('input.is_default_chkbox').is(':checked');

		// Popular Field singular fields
		myFieldInfo.name = fieldname;
		myFieldInfo.type= StandardizedFieldType;
		myFieldInfo.format = fielddatatype;
		myFieldInfo.default = fieldisdefault;

		// Populate Field Aliases
		myFieldInfo.aliases = [];

		$('#field_alias_table tbody').find('tr').each(function(){
			var rId = $(this).attr('id');
			var rIdNum = rId.split("_")[0];
			//var FieldID = fieldname.replace(/\s/g, '');
			var FieldName = getNameFromId(FieldDictionary,rId);

			//console.log("Debug :"+rIdNum + " - "+MasterID);
			

			if(rIdNum == MasterID){
				$('#'+rId).find('ul').find('li').each(function(){
					var oneAlias = new Object();
					var MyLanguage = $(this).find(".lang_aliases").attr('lang');
					var MyAliases = $(this).find(".all_aliases").val();

					oneAlias.language = MyLanguage;
					if(MyAliases != ""){
					oneAlias.names = MyAliases.split("|");
					}else{
						oneAlias.names = [""];
					}



					//console.log("Debug: "+MyAliases + " - For: "+MyLanguage);
					myFieldInfo.aliases.push(oneAlias);

				});


				//console.log("Debug : IN!");
			}

		});


		dom.fields.push(myFieldInfo);



	});
	
	var text = JSON.stringify(dom);
    var filename = "domain.json";
    
    download(filename, text);
	console.log(dom);
	}


});

	// removing Language Badges
	$("#lang_badges h5 ul").on("click","li", function() {
		$(this).remove();
		// when language is removed, need to go through alias table and remove languages
	});

	// adding language badges
	$("#add_lang").on("click", function() {

		if (!$('#'+$('#lang_selection').val()+'').length) {

			var BadgeID = $('#lang_selection').val();
    		$('#lang_badges h5 ul').append('<li class="list-inline-item" href="#"><span id="'+BadgeID+'" class="badge badge-success badge_lang">'+BadgeID+'</span></li>');
		
			// for each TR in the alias table (ie: for each data point)
			$('#field_alias_table tbody').find('tr').each(function(){

				var FieldID = $(this).attr('id');
				var IdOfRow = $(this).find('ul').attr('id');
				//console.log("DEBUG Row:"+IdOfRow);

				var IntID = BadgeID+"_"+FieldID;

				$(this).find('ul').append(
						'<li class="list-inline-item" id="'+IntID+'_LI">'+
							'<div class="input-group">'+
								'<h6><label class="label_left" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h6>'+
								'<input type="text" class="test input all_aliases" id="'+IntID+'" value="">'+
							'</div>'+
						'</li>'
				);
		});
					
		}
	});

	// Deleting Data points
	$("#field_list_table tbody").on("click",".delete_field", function() {
		var FieldID = $(this).closest('tr').attr('id');
		$('#'+FieldID+'_AliasTable').remove();
		$(this).closest('tr').remove();
		var Pos = getPositionOfId(FieldDictionary,FieldID);
		//console.log("Pos:"+Pos);
		FieldDictionary.splice(Pos, 1);
	});

	// adding a data point
	$("#add_field").on("click", function() {
		var aMap = new Object();

		// cant start with a number and can only have letters, numbers and spaces
		if(!/^(?!\d)[A-Za-z0-9 _]*$/.test($('#new_field_name').val())){
			console.log("Error in Field Name!!");
			// should add a popup to notify of error
		}else{
			aMap.name = $('#new_field_name').val();
			aMap.id = (new Date).getTime();;

			Boolean = AlreadyExists = false;
			FieldDictionary.forEach(function(entry) {

    			if(entry.name == aMap.name){
    				AlreadyExists = true;
    			}
			});

		if(!AlreadyExists){

			FieldDictionary.push(aMap);
			$('#field_list_table tbody').append(
				'<tr id="'+aMap.id+'">'+
					'<td><button id="remove_field" type="button" class="btn btn-danger btn-sm delete_field">Delete</button></td>'+
					'<td scope="row" class="field_name"><h5>'+aMap.name+'</h5></td>'+
					'<td class="field_type">'+
						'<select class="form-control" id="dropdownMenuButton0">'+
							'<option>Standard</option>'+
							'<option>Table</option>'+
						'</select>'+
					'</td>'+

					'<td class="field_data_type">'+
						'<select class="form-control" id="dropdownMenuButton0">'+
						'<option>Text</option>'+
						'<option>Date</option>'+
						'<option>Number</option>'+
						'</select>'+

						//'</div>'+
					'</td>'+

					'<td class="is_default">'+
						'<div>'+
							'<input class="form-check-input is_default_chkbox" type="checkbox" value="" id="defaultCheck1" checked>'+					
						'</div>'+
					'</td>'+
				'</tr>'
			);


			$('#field_alias_table tbody').append(


				'<tr id="'+aMap.id+'_AliasTable'+'">'+
				'<td scope="row" ><h5>'+aMap.name+'</h5></td>'+
				'<td scope="row" class="AliasInfo">'+
						
					'<ul id="'+aMap.id+'_AliasLanguageList" class="list-inline cust_aliasfield">'+


					'</ul>'+ 

				'</td>'+
				'</tr>'
				);

				$('#lang_badges').find('li').each(function(){

					var BadgeID = $(this).find('span').attr('id');

		            //console.log("gaga?:"+BadgeID);
					var IntID = BadgeID+"_"+aMap.id;
		            
		            $('#'+aMap.id+'_AliasLanguageList').append(
						

						'<li class="list-inline-item" id="'+IntID+'_LI">'+
							'<div class="input-group">'+
								'<h6><label class="label_left lang_aliases" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h6>'+
								  		
								'<input type="text" class="test input all_aliases" id="'+IntID+'" value="">'+
							'</div>'+
						'</li>'

		            );
        		});
		}


		}
		

		
	});

});

