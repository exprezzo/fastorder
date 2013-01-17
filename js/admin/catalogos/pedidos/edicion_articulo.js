
var EdicionArticulo=function (tabId){
	this.init=function(tabId){		
		tabId = '#'+tabId;		
		
		this.tabId=tabId;
		this.configurarFormulario(tabId);	
		this.configurarGrid(tabId);	
		this.configurarComboDestino(tabId);
	//	this.configurarToolbar(tabId);		
	};
	
	this.configurarGrid=function(tabId){
		var fields=[
			{ name: "id"  },
			{ name: "nombre"},
			{ name: "fk_articulo"},
			{ name: "cantidad"},
			{ name: "um"},
			{ name: "fk_um"}
		];
		var dataReader = new wijarrayreader(fields);

		var dataSource = new wijdatasource({
			proxy: new wijhttpproxy({
				url: "/admin/pedidoi/getListaArticulos",
				dataType: "json"				
			}),
			dynamic:true,			
			reader:new wijarrayreader(fields)							
		});
		
		dataSource.reader.read= function (datasource) {		
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			dataReader.read(datasource);
		};				
			
		var gridPedidos=$('#tabs '+tabId+" .grid_articulos");				
		
		gridPedidos.wijgrid({
			dynamic: true,
			allowColSizing:true,
			
			//allowEditing:false,
			allowKeyboardNavigation:true,
			allowPaging: true,
			pageSize:6,
			selectionMode:'singleRow',
			data:dataSource,
			beforeCellEdit: this.beforeCellEdit, 
			columns: [ 
				{ dataKey: "id", hidden:true, visible:false, headerText: "ID" },
				{dataKey: "nombre", headerText: "Articulo"},
				{dataKey: "cantidad", headerText: "Cantidad"},
				{dataKey: "um", headerText: "um"},
				{dataKey: "fk_articulo", headerText: "fk_articulo", visible:false},
				{dataKey: "fk_um", headerText: "fk_um", visible:false}
			],
			rowStyleFormatter: function(args) {
				if (args.dataRowIndex>-1)
					args.$rows.attr('pedidoId',args.data.id);
			},
			cellStyleFormatter: function(args) { 
			 if (args.column._originalDataKey=='fecha'){
				// console.log(args);		
				 args.$cell.addClass("colFecha");				
			 }
			
			} 
		});		
		var me=this;
		
		gridPedidos.wijgrid({ selectionChanged: function (e, args) { 					
			var item=args.addedCells.item(0);
			var row=item.row();
			var data=row.data;			
			me.selected=data;			
		} });
		
		gridPedidos.wijgrid({ loaded: function (e) { 
			$(tabId+' .grid_articulos tr').bind('dblclick', function (e) { 																											
				var position = $(e.currentTarget).position();				
				$('.frmEditInlinePedido').css('visibility','visible');				
				$('.frmEditInlinePedido').css('top',position.top+'px');
			//	$('.frmEditInlinePedido').css('left',position.left+'px');				
				me.editar();
			});			
		} });
	};
	
	this.configurarFormulario=function(tabId){
		 // $(tabId+" .txtCantidad").wijinputnumber( 
        // {
            // type: 'numeric',
            // minValue: -100,
            // maxValue: 1000,
            // decimalPlaces: 4,
            // showSpinner: true
        // });		
		// this.configurarComboArticulos(tabId);
		// this.configurarComboUM(tabId);
	};
	this.configurarComboArticulos=function(tabId){		
		var fields=[{
			name: 'label',
			mapping: function (item) {
				return item.nombre;
			}
		}, {
			name: 'value',
			mapping: 'id'
		}, {
			name: 'selected',
			defaultValue: false
		}];
		
		var myReader = new wijarrayreader(fields);
		
		var proxy = new wijhttpproxy({
			url: "/admin/pedidoi/getArticulos",
			dataType:"json"			
		});
		
		var datasource = new wijdatasource({
			reader:  new wijarrayreader(fields),
			proxy: proxy,
			loaded: function (data) {	
				//Seleccionar elemento
				// var val=$('#tabs '+tabId+' .txtFkAlmacen').val();
				// $.each(data.items, function(index, datos) {					
					// if (parseInt(val)==parseInt(datos.id) ){						
						// $('#tabs '+tabId+' .cmbAlmacen').wijcombobox({selectedIndex:index});
					// }
				// });				
			}
		});
		
		datasource.reader.read= function (datasource) {			
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			myReader.read(datasource);
		};			
		
		datasource.load();	
		var combo=$(tabId+' .cmbArticulo').wijcombobox({
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
				//$('#tabs '+tabId+' .txtFkAlmacen').val(item.id);				
			}
		});
		
		
		var animationOptions = {
			 animated: "Drop",
			 duration: 1000
		};
		combo.wijcombobox("option", "showingAnimation", animationOptions);		
		combo.wijcombobox("option", "hidingAnimation", animationOptions);
	};
	this.configurarComboUM=function(tabId){		
		var fields=[{
			name: 'label',
			mapping: function (item) {
				return item.nombre;
			}
		}, {
			name: 'value',
			mapping: 'id'
		}, {
			name: 'selected',
			defaultValue: false
		}];
		
		var myReader = new wijarrayreader(fields);
		
		var proxy = new wijhttpproxy({
			url: "/admin/pedidoi/getUnidadesMedida",
			dataType:"json"			
		});
		
		var datasource = new wijdatasource({
			reader:  new wijarrayreader(fields),
			proxy: proxy,
			loaded: function (data) {	
				//Seleccionar elemento
				// var val=$('#tabs '+tabId+' .txtFkAlmacen').val();
				// $.each(data.items, function(index, datos) {					
					// if (parseInt(val)==parseInt(datos.id) ){						
						// $('#tabs '+tabId+' .cmbAlmacen').wijcombobox({selectedIndex:index});
					// }
				// });				
			}
		});
		
		datasource.reader.read= function (datasource) {			
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			myReader.read(datasource);
		};			
		
		datasource.load();	
		var combo=$(tabId+' .cmbUM').wijcombobox({
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
				//$('#tabs '+tabId+' .txtFkAlmacen').val(item.id);				
			}
		});
				
		var animationOptions = {
			 animated: "Drop",
			 duration: 1000
		};
		combo.wijcombobox("option", "showingAnimation", animationOptions);		
		combo.wijcombobox("option", "hidingAnimation", animationOptions);
	};
	this.configurarComboDestino=function(tabId){		
		var fields=[{
			name: 'label',
			mapping: function (item) {
				return item.nombre;
			}
		}, {
			name: 'value',
			mapping: 'id'
		}, {
			name: 'selected',
			defaultValue: false
		}];
		
		var myReader = new wijarrayreader(fields);
		
		var proxy = new wijhttpproxy({
			url: "/admin/pedidoi/getArticulos",
			dataType:"json"			
		});
		
		var datasource = new wijdatasource({
			reader:  new wijarrayreader(fields),
			proxy: proxy,
			loaded: function (data) {	
				//Seleccionar elemento
				// var val=$('#tabs '+tabId+' .txtFkAlmacen').val();
				// $.each(data.items, function(index, datos) {					
					// if (parseInt(val)==parseInt(datos.id) ){						
						// $('#tabs '+tabId+' .cmbAlmacen').wijcombobox({selectedIndex:index});
					// }
				// });				
			}
		});
		
		datasource.reader.read= function (datasource) {			
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			myReader.read(datasource);
		};			
		
		datasource.load();	
		var combo=$(tabId+' .cmbDestino').wijcombobox({
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
				//$('#tabs '+tabId+' .txtFkAlmacen').val(item.id);				
			}
		});
		
		
		var animationOptions = {
			 animated: "Drop",
			 duration: 1000
		};
		combo.wijcombobox("option", "showingAnimation", animationOptions);		
		combo.wijcombobox("option", "hidingAnimation", animationOptions);
	};
	this.mostrarTabArticulos=function(){
		//Posicionar tab Edicion articulo
		this.mostrarTab(0);
	};
	this.editar=function(){
		console.log(this.selected);
		//Cargar los datos en el editor
		
		$(this.tabId+' .frmEditInlinePedido .txtCantidad').val(this.selected.cantidad);
		$(this.tabId+' .frmEditInlinePedido .cmbArticulo').val(this.selected.fk_articulo);
		
	};
	this.mostrarTabEdicionArticulo=function(){
		var data=this.selected;
		this.mostrarTab(1, data);
	};
	this.mostrarTab=function(tabIndex, data){
		
		var tabId = this.tabId;
		var elJQ=$(tabId+' .pnlArticulos');
		var alto= elJQ.height();
		var ancho= elJQ.width();
		var position = elJQ.position();		
		
		var pnlArt=$(tabId+' .pnlEdicionArticulo');		
		pnlArt.width(ancho);
		pnlArt.height(alto);
		pnlArt.css('top',position.top);
		pnlArt.css('left',position.left);
		//pnlArt.css('z-index',10);
		if (tabIndex==0){
			pnlArt.css('visibility','hidden');
			$(tabId+' .pnlArticulos').css('visibility','visible');
		}else if (tabIndex==1){
			pnlArt.css('visibility','visible');
			$(tabId+' .pnlArticulos').css('visibility','hidden');
			
		}		
	};
	this.configurarToolbar=function(tabId){
		var me=this;
		$(tabId+ " .tbArticulos").wijribbon({
			click: function (e, cmd) {
				switch(cmd.commandName){
					case 'nuevo':
						me.mostrarTabEdicionArticulo();
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
		
		var me=this;
		$(tabId+ " .tbEdicionArticulo").wijribbon({
			click: function (e, cmd) {
				switch(cmd.commandName){					
					case 'aceptar':
					case 'cancelar':
						me.mostrarTabArticulos(tabId);						
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