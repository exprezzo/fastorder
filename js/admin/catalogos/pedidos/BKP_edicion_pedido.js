var EdicionPedido={	
	init:function(tabId, pedidoId, almacen){		
		tabId = '#'+tabId;
		this.tabId=tabId;
		var tab=$('div'+tabId);
		$('div'+tabId).css('padding','0');
		$('div'+tabId).css('border','0 1px 1px 1px');
		
		tab.addClass('frmPedido');
		var tab=$('a[href="'+tabId+'"]');		
		tab.addClass('frmPedido');
		
		//Para identificar el contenido del tab
		//var objId='pedidoi_id_'+pedidoId;								
		//$('#tabs '+tabId).attr('objId',objId);
		
		//Establecer titulo e icono
		if (pedidoId>0){
			$('a[href="'+tabId+'"]').html('Pedido-'+almacen+' ID: '+pedidoId);		
		}else{
			$('a[href="'+tabId+'"]').html('Nuevo Pedido');
		}
		
		this.configurarFormulario(tabId);
		this.configurarToolbar(tabId);
		// this.configurarListaArticulos(tabId);
	},
	nuevo:function(){
		var tabId=this.tabId;
		var tab = $('#tabs '+tabId);
		$('a[href="'+tabId+'"]').html('Nuevo Pedido');
		tab.find('.txtId').val(0);
	},
	// cargarValoresIniciales:function(){
	// },
	guardar:function(){
		var tabId=this.tabId;
		var tab = $('#tabs '+tabId);
		var me=this;
		var pedido={
			id		: tab.find('.txtId').val(),
			almacen	: tab.find('.txtFkAlmacen').val(),
			fecha	: tab.find('.txtFecha').val()
		};
		
		//Envia los datos al servidor, el servidor responde success true o false.
		
		$.ajax({
			type: "POST",
			url: '/admin/pedidoi/guardar',
			data: { pedido: pedido}
		}).done(function( response ) {
			
			var resp = eval('(' + response + ')');
			var msg= (resp.msg)? resp.msg : '';
			var title;
			if ( resp.success == true	){
				icon='/images/yes.png';
				title= 'Success';
				
				tab.find('.txtId').val(resp.datos.id),
				tab.find('.txtFkAlmacen').val(resp.datos.fk_almacen),
				tab.find('.txtFecha').wijinputdate('option','date', resp.datos.fecha); 
				$('a[href="'+me.tabId+'"]').html('Pedido-'+resp.datos.nombreAlmacen+' ID: '+resp.datos.id);		
				
			}else{
				icon= '/images/error.png';
				title= 'Error';					
			}
			
			//cuando es true, envia tambien los datos guardados.
			//actualiza los valores del formulario.
			$.gritter.add({
				position: 'bottom-left',
				title:title,
				text: msg,
				image: icon,
				class_name: 'my-sticky-class'
			});
		});
	},
	editar:function(){
		alert("editar");
	},
	eliminar:function(){
		alert("editar");
	},	
	configurarFormulario:function(tabId){
		$('#tabs '+tabId+' .txtFecha').wijinputdate({ dateFormat: 'd/M/yyyy', showTrigger: true});		
		
		//COMBO
		
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
			url: "/admin/pedidoi/getAlmacenes",
			dataType:"json"			
		});
		
		var datasource = new wijdatasource({
			reader:  new wijarrayreader(fields),
			proxy: proxy,
			loaded: function (data) {				
				var val=$('#tabs '+tabId+' .txtFkAlmacen').val();
				$.each(data.items, function(index, datos) {					
					if (parseInt(val)==parseInt(datos.id) ){						
						$('#tabs '+tabId+' .cmbAlmacen').wijcombobox({selectedIndex:index});
					}
				});				
			}
		});
		
		datasource.reader.read= function (datasource) {			
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			myReader.read(datasource);
		};			
		
		datasource.load();	
		var combo=$('#tabs '+tabId+' .cmbAlmacen').wijcombobox({
			data: datasource,
			showTrigger: true,
			minLength: 1,
			animationOptions: {
				animated: "Drop",
				duration: 1000
			},
			forceSelectionText: true,
			search: function (e, obj) {
				//obj.datasrc.proxy.options.data.name_startsWith = obj.term.value;
			},
			select: function (e, item) {				
				$('#tabs '+tabId+' .txtFkAlmacen').val(item.id);				
			}
		});
		
		
		var animationOptions = {
			 animated: "Drop",
			 duration: 1000
		};
		combo.wijcombobox("option", "showingAnimation", animationOptions);		
		combo.wijcombobox("option", "hidingAnimation", animationOptions);
		
		
		
	},
	configurarToolbar:function(tabId){		
		
		var me=this;
		$(tabId+ "> .tbPedido").wijribbon({
			click: function (e, cmd) {
				switch(cmd.commandName){
					case 'nuevo':
						TabManager.add('/admin/pedidoi/nuevo','Nuevo Pedido');				
					break;
					case 'guardar':
						me.guardar();
					break;
					case 'eliminar':
						me.nuevo();
					break;
					
					default:						
						$.gritter.add({
							position: 'bottom-left',
							title:"Informaci&oacute;n",
							text: "Acciones del toolbar en construcci&oacute;n",
							image: '/images/info.png',
							class_name: 'my-sticky-class'
						});
					break;
				}
				
			}
		});
		
		
		
	}
	
}