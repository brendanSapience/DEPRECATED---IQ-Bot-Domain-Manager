
setSocketListeners();



var FieldDictionary = [];




// 
// 
// 	FUNCTIONS
//
//
//

    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }

function checkDomain(){

	var dom = new Object();
	
	if($('#domain_name').val() == ""){
		return "Error: Domain Name cannot be Empty.";
	}else{
		if(!/^(?!\d)[A-Za-z0-9 _-]*$/.test($('#domain_name').val())){
			return "Error: Domain Name has forbidden characters."

		}else{
			return "";
		}
	}

}

function checkAliases(){

			var NonEmptyAliases = [];
			var EmptyAliasFound = false;
			$('#field_alias_table tbody').find('tr').each(function(){

				
				var myUL = $(this).find('ul');
				myUL.find('li').each(function(){

					var myaliases = $(this).find('input').val();
					if(myaliases == ""){
						EmptyAliasFound = true;
						
					}
				})
		});
		if(!EmptyAliasFound){
			return "";
		}else{
			return "Error: One or more Aliases are empty.";
		}
		
}

function setSocketListeners(){
//domain_create_response

	socket.on('languages_sent',function(Languages){
		
		select = document.getElementById('lang_selection');

		select.options.length = 0;

		var LangTable = Languages['languages'];
		LangTable.forEach(function(element){
			//console.log(element);
			var opt = document.createElement('option');
			opt.value = element;
    		opt.innerHTML = element;
    		select.appendChild(opt);

		});

	});

	socket.on('domain_create_response',function(result){
		$("#import_domain").prop("disabled",false);
		
		var MyRes = JSON.parse(result);

		var status = MyRes['status'];
		var Message = MyRes['message'];
		//console.log("Status:"+status);
		if(status === 403){
			//console.log("Status in there:"+Message);
			$("#import_domain_status").text("Error: "+Message);
		}else{
			var isSuccess = MyRes['success'];
			var errors = MyRes['errors'];
			if(isSuccess){
				$("#import_domain_status").text("Domain Imported Successfully!");
			}else{

				$("#import_domain_status").text("Error: "+errors);
			}
		}

	});

	socket.on('demo_mode',function(DemoMode){
		
		if(DemoMode){
			$("#import_domain").prop("disabled",false);
		}else{
			$("#import_domain").prop("disabled",true);
		}

	});

	socket.on('server_side_error',function(err){
		
		console.log("Error Returned from Server: "+err)
		$("#import_domain_status").text("Error: "+err);
		$("#import_domain").prop("disabled",false);
	});


};

function getDomainStructure(){
	$("#import_domain_status").text("");
	var dom = new Object();

	var CheckDomainNameMsg = checkDomain();
	var CheckAliasesMsg = checkAliases();

	if(CheckDomainNameMsg == ""){
		if(CheckAliasesMsg == ""){
			dom = getJsonStructure();

			
			var text = JSON.stringify(dom);

			return text;
		    //var filename = "IQ Bot Domain - "+dom.name+".json";
		    
		    //download(filename, text);

		}else{
			$("#import_domain_status").text(CheckAliasesMsg);
			return "";
		}


	}else{
		$("#import_domain_status").text(CheckDomainNameMsg);
		return "";
	}
}

function fillAliases(id, Language, Aliases){
	//console.log("DEBUG: [" + id+"_AliasTable : "+Language+" : "+Aliases+"]");
	//var foundUL = $('#'+id+"_AliasTable").find("ul").length;

	var foundUL = $('#'+id+"_AliasTable").find("ul #"+Language+"_"+id).length;
	$('#'+id+"_AliasTable").find("ul #"+Language+"_"+id).val(Aliases);
	$('#'+id+"_AliasTable").find("ul #"+Language+"_"+id).css({
                'background': '#FFFFFF'
            });
	//console.log("DEBUG found ul?:" + foundUL);

}

function addAliases(aMap){
			$('#field_alias_table tbody').append(


				'<tr class="d-flex" id="'+aMap.id+'_AliasTable'+'">'+
				'<td class="col-3" scope="row" ><h5>'+aMap.name+'</h5></td>'+
				'<td class="col-9" scope="row" class="AliasInfo">'+
						
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
						

						'<li class="li_spec" id="'+IntID+'_LI">'+
							'<div class="form-inline form-group row">'+
							'<div class="col-sm-2">'+
								'<h5><label class="label_left lang_aliases" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h5>'+
								'</div>'+
								 //'<input type="text" class="input-xxlarge form-control all_aliases" id="'+IntID+'" >'+ 		
								 //'<div class="col-xs-12">'+
								 '<div class="col-sm-10">'+
								'<input style="display:table-cell; width:100%; background-color:#FFC2C2" type="text" class="input-sm form-control all_aliases" id="'+IntID+'" value="" placeholder="Invoice #|Invoice Number|Invoice N:">'+
								'</div>'+
							'</div>'+
						'</li>'

		            );
        	});

}

function addField(FieldName,FieldFormat, FieldType, FieldDefault){
	var aMap = new Object();

		$("#action_buttons").show();

		socket.emit('get_mode',{});

		// cant start with a number and can only have letters, numbers and spaces
		//if(!/^(?!\d)[A-Za-z0-9 _]*$/.test($('#new_field_name').val()) || $('#new_field_name').val() == ""){
			
		if(!/^(?!\d)[^,;!@#$%^&*()-]+$/.test(FieldName) || FieldName == ""){
		//if(!/^(?!\d)[A-Za-z0-9 _]*$/.test(FieldName) || FieldName == ""){
			//console.log("Error in Field Name!!");
			// should add a popup to notify of error
		}else{

			$('#divfields').show();
			$('#divalias').show();

			//aMap.name = $('#new_field_name').val();
			aMap.name = FieldName;
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
				'<tr id="'+aMap.id+'" class="d-flex">'+
					'<td class="col-1"><button id="remove_field" type="button" class="btn-sm btn btn-danger delete_field">Delete</button></td>'+
					'<td scope="row" class="col-3 field_name"><h6>'+aMap.name+'</h6></td>'+
					'<td class="col-2 field_type">'+
						'<select class="form-control-sm" id="dropdownMenuButton0">'+
							'<option>Standard</option>'+
							'<option>Table</option>'+
						'</select>'+
					'</td>'+

					'<td class="col-2 field_data_type">'+
						'<select class="form-control-sm" id="dropdownMenuButton0">'+
						'<option>Text</option>'+
						'<option>Date</option>'+
						'<option>Number</option>'+
						'</select>'+

						//'</div>'+
					'</td>'+

					'<td class="col-4 is_default">'+
						'<div>'+
							'<input class="form-check-input is_default_chkbox" type="checkbox" value=""  checked="true">'+					
						'</div>'+
					'</td>'+
				'</tr>'
			);

		//var fieldtype = $(this).find('td.field_type').find('select').val();
		//var fielddatatype = $(this).find('td.field_data_type').find('select').val();

			if(FieldFormat == "TABLE_COLUMN_FIELD"){
				$('#'+aMap.id).find('td.field_type').find('select').val("Table");

				//$(aMap.id).find('td.field_type').find('select').val(FieldFormat);
			}else if(FieldFormat == "STANDARD_FIELD"){
				$('#'+aMap.id).find('td.field_type').find('select').val("Standard");
			}

			if(FieldType != null){
				$('#'+aMap.id).find('td.field_data_type').find('select').val(FieldType);
			}

			//console.log("Debug: ["+FieldDefault+"]");

			if(FieldDefault != null){
				if(FieldDefault){
					$('#'+aMap.id).find('.is_default_chkbox').prop('checked', true);
					
				}else{
					$('#'+aMap.id).find('.is_default_chkbox').prop('checked', false);
				}
				
			}

			addAliases(aMap);
		}


		}
		return aMap.id;
}

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

function getJsonStructure(){
	var dom = new Object();
	dom.name = "";
	dom.languages = [];
	dom.fields = [];



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
	return dom;
}

function addLanguage(newLanguage){

			var BadgeID = newLanguage;
    		$('#lang_badges h5 ul').append('<li class="list-inline-item" href="#"><span id="'+BadgeID+'" class="badge badge-success badge_lang">'+BadgeID+'</span></li>');
		
			// for each TR in the alias table (ie: for each data point)
			$('#field_alias_table tbody').find('tr').each(function(){

				var FieldID = $(this).attr('id');
				var IdOfRow = $(this).find('ul').attr('id');
				//console.log("DEBUG Row:"+IdOfRow);

				var IntID = BadgeID+"_"+FieldID;

				$(this).find('ul').append(
					'<li class="li_spec" id="'+IntID+'_LI">'+
							'<div class="form-inline form-group row">'+
							'<div class="col-sm-2">'+
								'<h5><label class="label_left lang_aliases" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h5>'+
								'</div>'+
								 //'<input type="text" class="input-xxlarge form-control all_aliases" id="'+IntID+'" >'+ 		
								 //'<div class="col-xs-12">'+
								 '<div class="col-sm-10">'+
								'<input style="display:table-cell; width:100%; background-color:#FFC2C2" type="text" class="input-sm form-control all_aliases" id="'+IntID+'" value="" placeholder="Invoice #|Invoice Number|Invoice N:">'+
								'</div>'+
							'</div>'+
						'</li>'
				);
		});
					
		
}

function pad2(n) { return n < 10 ? '0' + n : n }

//$(staticAncestors).on(eventName, dynamicChild, function() {});



$(document).ready(function(){

setSocketListeners();

socket.emit('get_languages');

// Alias Fields should be redish if empty, white if not empty
$('#createdomaindiv').on('input', '.all_aliases', function() { 
	if($(this).val() != ""){
		jQuery(this).css({
                'background': '#FFFFFF'
            });
	}else{
		jQuery(this).css({
                'background': '#FFC2C2'
            });
	}

 });





$(".custom-file-input").on("change", function() {
	var file = document.getElementById("DomainLoadFilePicker").files[0];
		if (file) {
		    var reader = new FileReader();
		    reader.readAsText(file, "UTF-8");
		    reader.onload = function (evt) {
		    	
		    	// If the file is a Taxonomy File, it should be processed separatly
		    	var Filename = file.name;
		    	if(Filename.endsWith(".csv")){
		    		//var MyString = evt.target.result;
		  
					var ARR = CSVToArray(evt.target.result,",");

					var RepresentedLanguages = [];

					var idx = 0;
					for (var lang in ARR[0]){
						if(idx > 3){
							var LanguageToAdd = ARR[0][lang];
							addLanguage(LanguageToAdd);
							RepresentedLanguages.push(LanguageToAdd);
							//console.log("Adding: "+ARR[0][lang]);
						}
						idx++;
					}
					for(var idx in ARR){
						if(idx>0){

							var FieldInfo = ARR[idx];
							var FieldName = FieldInfo[0];
							var FieldType = FieldInfo[1];
							var FieldKind = FieldInfo[2];
							var FieldDefault = FieldInfo[3];
							var ProcFieldDefault = false;
							var ProcFieldKind = "FORM_FIELD";

							//TABLE_COLUMN_FIELD
							if(FieldKind === "TC"){ProcFieldKind = "TABLE_COLUMN_FIELD"}
							if(FieldDefault === "Y"){ProcFieldDefault = true;}

							//console.log("Adding Field:"+FieldName+","+FieldType+","+ProcFieldKind+","+ProcFieldDefault)
							var FieldID = addField(FieldName,ProcFieldKind,FieldType,ProcFieldDefault);


							for (var lang in RepresentedLanguages){

								var aLang = RepresentedLanguages[lang];
								var currentAliasIndex = 4+Number(lang);
								//console.log("Index is:"+currentAliasIndex)
								var AllAliases = FieldInfo[currentAliasIndex];
								//console.log("DEBUg:"+aLang+":"+FieldID+":"+AllAliases);
								fillAliases(FieldID,aLang,AllAliases);
							}
							

						}
					}

		    	}else{
		    				    	// If the file is a standard JSON File:
			    	var DomainInfo = JSON.parse(evt.target.result);

			    	var dName = DomainInfo['name'];
			    	var dLanguages = DomainInfo['languages'];
			    	var dFields = DomainInfo['fields'];

			    	//"|"+console.log(dFields);

					$('#domain_name').val(DomainInfo['name']);

			    	for(var lang in dLanguages){
			    		//console.log("Language: "+dLanguages[lang]);
						addLanguage(dLanguages[lang]);
			    	}
			    	
			    	for (var field in dFields){

			    		FieldInfo = dFields[field];
			    		//console.log("DEBUGSDSAD:"+FieldInfo['name']);

			    		var fname = FieldInfo['name'];
			    		var ftype = FieldInfo['type'];
			    		var fformat = FieldInfo['format'];
			    		var fdefault = FieldInfo['default'];

			    		var faliases = FieldInfo['aliases'];


			    		//console.log("DEBUg:"+fname+":"+ftype+":"+fformat+":"+fdefault);
			    		var FiledID = addField(fname,ftype,fformat,fdefault);

			    		

			    		for (var i in faliases){
			    			LangAlias = faliases[i];

			    			var AllAliases = "";

			    			aLang = LangAlias['language'];
			    			aNames = LangAlias['names'];
			    			for(var j in aNames){
			    				AllAliases = AllAliases+"|"+aNames[j];
			    			}

			    			var AllAliases_Corrected = AllAliases.substring(1);
			    			fillAliases(FiledID,aLang,AllAliases_Corrected);
			    			//console.log("DEBUG for Alias: "+ aLang+" - ["+AllAliases+"]");

			    		}


			    	}
		    	}



		        //console.log(evt.target.result);
		    }
		    reader.onerror = function (evt) {
		        console.log("Error reading file");
		    }
		    $('#CreateDomainButton').trigger('click');
		}
});



	// live check of Domain Name 
    jQuery('#domain_name').bind('input propertychange', function() {

        if (/^(?!\d)[A-Za-z0-9 _-]*$/.test(jQuery(this).val())) {
            jQuery(this).css({
                'background': '#FFFFFF'
            });
        } else {
            jQuery(this).css({
                'background': '#FFC2C2'
            });
        }
    });

    // Live check of Field Name
    jQuery('#new_field_name').bind('input propertychange', function() {

    	//
    	///^(?!\d)[A-Za-z0-9 _]*$/
	    if (/^(?!\d)[^,;!@#$%^&*()-]+$/.test(jQuery(this).val())) {
	        jQuery(this).css({
	            'background': '#FFFFFF'
	        });
	    } else {
	        jQuery(this).css({
	            'background': '#FFC2C2'
	        });
	    }
    });

// When click Export Domain
$("#create_domain").on("click",function(){

	var JsonContent = getDomainStructure();
	if(JsonContent != ""){
		var DomainName = $('#domain_name').val();
		var filename = "IQ Bot Domain - "+DomainName+".json";
		download(filename, JsonContent);
	}
//
});

// When click Export Domain
$("#import_domain").on("click",function(){

	var JsonContent = getDomainStructure();
	if(JsonContent != ""){

		var DomainName = $('#domain_name').val();
		

		var date = new Date();

		var TimeStamp = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() );


		var filename = "IQ Bot Domain - "+DomainName+" - "+TimeStamp+".json";
		download(filename, JsonContent);
	}

	$("#import_domain_status").text("");
	var dom = new Object();
	
	var CheckDomainNameMsg = checkDomain();
	var CheckAliasesMsg = checkAliases();


	if(CheckDomainNameMsg == ""){
		if(CheckAliasesMsg == ""){
			dom = getJsonStructure();
		 	socket.emit('import_json_domain',dom);
		 	$("#import_domain").prop("disabled",true);

		}else{
			$("#import_domain_status").text(CheckAliasesMsg);
		}
	}else{
		$("#import_domain_status").text(CheckDomainNameMsg);
	
	}

});

	// removing Language Badges
	$("#lang_badges h5 ul").on("click","li", function() {

		//$(this).remove();
		// when language is removed, need to go through alias table and remove languages
	});

	// adding language badges
	$("#add_lang").on("click", function() {

		if (!$('#'+$('#lang_selection').val()+'').length) {

			addLanguage($('#lang_selection').val());
					
		}
	});

	// Deleting Data points
	$("#field_list_table tbody").on("click",".delete_field", function() {
		var FieldID = $(this).closest('tr').attr('id');
		$('#'+FieldID+'_AliasTable').remove();
		$(this).closest('tr').remove();
		var Pos = getPositionOfId(FieldDictionary,FieldID);
		FieldDictionary.splice(Pos, 1);
	});

	// adding a data point
	$("#add_field").on("click", function() {
		
		addField($('#new_field_name').val(),null,null,null);
		// TO DO

		
	});

});

