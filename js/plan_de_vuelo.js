var PlanDeVuelo=function(){
	
}

PlanDeVuelo.prototype.init=function(){		
	$(':radio').change(function(e){
		
		if (e.srcElement.defaultValue =='sencillo'){
			$('#divFechaHora').slideUp();
		}else{
			$('#divFechaHora').slideDown();
		}
	});
	
	$('#fechaSalida').wijinputdate({ dateFormat: 'dd/MM/yyyy', showTrigger: true});
	$('#fechaRegreso').wijinputdate({ dateFormat: 'dd/MM/yyyy', showTrigger: true});
	this.comfigurarComboOrigen();
	this.comfigurarComboDestino();
	
	
	$('#btnGo').click(function(){
		$('#form_1').submit();
		return false;
	});
}
PlanDeVuelo.prototype.comfigurarComboOrigen=function(){	
	var fields=[{
		name: 'label',
		mapping: function (item) {
			return item.label;
		}
	}, {
		name: 'value',
		mapping: 'label'
	}, {
		name: 'selected',
		defaultValue: false
	},{name:'id'}];

	var myReader = new wijarrayreader(fields);

	var proxy = new wijhttpproxy({
		url: "/sis/getOrigenes",		
		dataType:"json"
	});

	var datasource = new wijdatasource({
		reader:  new wijarrayreader(fields),
		proxy: proxy
	});

	datasource.reader.read= function (datasource) {			
		var totalRows=datasource.data.totalRows;			
		datasource.data = datasource.data.rows;
		datasource.data.totalRows = totalRows;
		myReader.read(datasource);
	};			

	datasource.load();	
	var combo=$('#cmbOrigen').wijcombobox({
		data: datasource,
		showTrigger: true,
		minLength: 1,
		animationOptions: {
			animated: "Drop",
			duration: 1000
		},
		//forceSelectionText: true,
		// search: function (e, obj) {
			// obj.datasrc.proxy.options.data.name_startsWith = obj.term.value;
		// },
		select: function (e, item) {				
			$('#fkOrigen').val(item.id);				
		}
	});

	var animationOptions = {
		 animated: "Drop",
		 duration: 1000
	};
	combo.wijcombobox("option", "showingAnimation", animationOptions);		
	combo.wijcombobox("option", "hidingAnimation", animationOptions);	
}

PlanDeVuelo.prototype.comfigurarComboDestino=function(){	
	var fields=[{
		name: 'label',
		mapping: function (item) {
			return item.label;
		}
	}, {
		name: 'value',
		mapping: 'label'
	}, {
		name: 'selected',
		defaultValue: false
	},{name:'id'}];

	var myReader = new wijarrayreader(fields);

	var proxy = new wijhttpproxy({
		url: "/sis/getOrigenes",		
		dataType:"json"
	});

	var datasource = new wijdatasource({
		reader:  new wijarrayreader(fields),
		proxy: proxy
	});

	datasource.reader.read= function (datasource) {			
		var totalRows=datasource.data.totalRows;			
		datasource.data = datasource.data.rows;
		datasource.data.totalRows = totalRows;
		myReader.read(datasource);
	};			

	datasource.load();	
	var combo=$('#cmbDestino').wijcombobox({
		data: datasource,
		showTrigger: true,
		minLength: 1,
		animationOptions: {
			animated: "Drop",
			duration: 1000
		},
		//forceSelectionText: true,
		// search: function (e, obj) {
			// obj.datasrc.proxy.options.data.name_startsWith = obj.term.value;
		// },
		select: function (e, item) {				
			$('#fkDestino').val(item.id);				
		}
	});

	var animationOptions = {
		 animated: "Drop",
		 duration: 1000
	};
	combo.wijcombobox("option", "showingAnimation", animationOptions);		
	combo.wijcombobox("option", "hidingAnimation", animationOptions);	
}