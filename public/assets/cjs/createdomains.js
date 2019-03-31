$(document).ready(function(){

$("#create_domain").on("click",function(){
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
			var FieldID = fieldname.replace(/\s/g, '');
			console.log("Debug :"+rId + " - "+FieldID);
			var oneAlias = new Object();

			if(rId == FieldID+"_AliasTable"){
				$('#'+rId).find('ul').find('li').each(function(){
					var MyLanguage = $(this).find(".lang_aliases").attr('lang');
					var MyAliases = $(this).find(".all_aliases").val();

					console.log("Finding Language: "+MyLanguage);
					

					oneAlias.language = MyLanguage;
					if(MyAliases != ""){
					oneAlias.names = MyAliases.split("|");
					}else{
						oneAlias.names = [""];
					}



					console.log("Debug: "+MyAliases + " - For: "+MyLanguage);
					myFieldInfo.aliases.push(oneAlias);

				});


				//console.log("Debug : IN!");
			}

		});


		dom.fields.push(myFieldInfo);



	});

	console.log(dom);

});



	// removing Language Badges
	$("#lang_badges h5 ul").on("click","li", function() {
		$(this).remove();
		// when language is removed, need to go through alias table and remove languages
	});


	// adding language badges
	$("#add_lang").on("click", function() {

		if (!$('#'+$('#lang_selection').val()+'').length) {
    			$('#lang_badges h5 ul').append('<li class="list-inline-item" href="#"><span id="'+$('#lang_selection').val()+'" class="badge badge-success badge_lang">'+$('#lang_selection').val()+'</span></li>');
		
    	var BadgeID = $('#lang_selection').val();
		// for each TR in the alias table (ie: for each data point)
		$('#field_alias_table tbody').find('tr').each(function(){

			var FieldID = $(this).attr('id');
			var IdOfRow = $(this).find('ul').attr('id');
			console.log("DEBUG Row:"+IdOfRow);

			var IntID = BadgeID+"_"+FieldID;

			$(this).find('ul').append(
						'<li class="list-inline-item" id="'+IntID+'_LI">'+
							'<div class="input-group">'+
								'<h6><label class="label_left" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h6>'+
								  		
								'<input type="text" class="test input " id="'+IntID+'" value="">'+
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


	});

	// adding a data point
	$("#add_field").on("click", function() {

		var LName = $('#new_field_name').val().toLowerCase();
		var FieldID = LName.replace(/\s/g, '');

		if (!$('#'+FieldID).length) {


		$('#field_list_table tbody').append(


			'<tr id="'+FieldID+'">'+
				'<td><button id="remove_field" type="button" class="btn btn-danger btn-sm delete_field">Delete</button></td>'+
				'<td scope="row" class="field_name"><h5>'+$('#new_field_name').val()+'</h5></td>'+
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


					'<tr id="'+FieldID+'_AliasTable'+'">'+
					'<td scope="row" ><h5>'+$('#new_field_name').val()+'</h5></td>'+
					'<td scope="row" class="AliasInfo">'+
						
						    '<ul id="'+FieldID+'_AliasLanguageList" class="list-inline cust_aliasfield">'+
								//'<li class="list-inline-item">'+
								//'<div class="input-group">'+
								//  		'<h6><label class="label_left" for="usr">English: </label></h6>'+
								  		
								//  		'<input type="text" class="test input " id="f" value="invoice #|Invoice Number|My Invoice N:">'+
								//  	'</div>'+
								//'</li>'+

								//'<li class="list-inline-item">'+
								//	'<div class="input-group">'+
								//  		'<h6><label class="label_left" for="usr">Spanish: </label></h6>'+
								  		
								 // 		'<input type="text" class="test input" id="d" value="Facture|Facture Num:|Numero de facture">'+
								//  	'</div>'+
								//'</li>'+


							'</ul>'+ 

						      '</td>'+
						    '</tr>'
				);

				$('#lang_badges').find('li').each(function(){

					var BadgeID = $(this).find('span').attr('id');

		            //console.log("gaga?:"+BadgeID);
					var IntID = BadgeID+"_"+FieldID;
		            
		            $('#'+FieldID+'_AliasLanguageList').append(
						

						'<li class="list-inline-item" id="'+IntID+'_LI">'+
							'<div class="input-group">'+
								'<h6><label class="label_left lang_aliases" lang="'+BadgeID+'" for="usr">'+BadgeID+': </label></h6>'+
								  		
								'<input type="text" class="test input all_aliases" id="'+IntID+'" value="">'+
							'</div>'+
						'</li>'

		            );
        		});



	}
	});

	//$(document).on("click",".std_field", function() {
	//	$(this).addClass('active');//.siblings().removeClass('active');
	//	var a = $(this).attr('class'); 
	//	var b = $(this).attr('id'); 
	//	var c = $(this).siblings().attr('class'); 
	//	var d = $(this).siblings().attr('id'); 
	//	console.log("Classes: "+a+" : "+b+" | "+c+" : "+d);
	//});

	//$(document).on("click",".number_type", function() {
	//	$(this).addClass('active');//.siblings().removeClass('active');
	//	$(this).siblings().removeClass('active');
	//	var a = $(this).attr('class'); 
	//	var b = $(this).attr('id'); 
	//	var c = $(this).siblings().attr('class'); 
	//	var d = $(this).siblings().attr('id'); 

		//console.log("Classes: "+a+" : "+b+" | "+c+" : "+d);
	
	//});

});

