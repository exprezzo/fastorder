
var EdicionArticulo=function (tabId){
	this.init=function(tabId){		
		tabId = '#'+tabId;		
		
		this.tabId=tabId;
		
		
		
		this.configurarFormulario(tabId);	
		this.configurarGrid(tabId);	
		this.configurarComboDestino(tabId);
		this.configurarToolbar(tabId);		
		var me=this;
		
		$(this.tabId+' .frmEditInlinePedido .btnCancel').click(function(){			
			$(me.tabId+' .frmEditInlinePedido').css('visibility','hidden');				
		});				
		
		$(this.tabId+' .frmEditInlinePedido .btnGuardar').click(function(){			
			//$(me.tabId+' .frmEditInlinePedido').css('visibility','hidden');				
			me.guardar();
		});
		
		
		// var w=$(me.tabId+' table.grid_articulos th:eq(0)').width();
		// $(me.tabId+' .frmEditInlinePedido .cmbArticulo').css('width',w-5);				
		// w=$(me.tabId+' table.grid_articulos th:eq(1)').width();
		// $(me.tabId+' .frmEditInlinePedido .txtCantidad').css('width',w-5);				
		// w=$(me.tabId+' table.grid_articulos th:eq(2)').width();				
		// $(me.tabId+' .frmEditInlinePedido .cmbUm').css('width',w-5);	
		this.configurarComboArticulo();
		$(me.tabId+' .frmEditInlinePedido .txtCantidad').wijinputnumber({
            type: 'numeric',           
            decimalPlaces: 2,
            showSpinner: true			
        });
		
		
		//$(me.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox({});
		this.configurarComboUM();
		
		
	};
	this.configurarComboArticulo=function(){
		//alert("asd");
		var tabId=this.tabId;
		var fields=[{
			name: 'label',
			mapping: 'nombre'
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
				// var val=$('#tabs '+tabId+' .txtFkAlmacen').val();
				// $.each(data.items, function(index, datos) {					
					// if (parseInt(val)==parseInt(datos.id) ){						
						// $('#tabs '+tabId+' .cmbAlmacen').wijcombobox({selectedIndex:index});
					// }
				// });				
			}
		});
		
		// datasource.proxy.options.data={
			// id		:$(this.tabId+' .frmPedidoi .txtId').val(),
			// IdTmp	:$(this.tabId+' .frmPedidoi .txtIdTmp').val()
		// };
		
		// datasource.proxy.options.data={
			// id		:5,
			// IdTmp	:6
		// };
		
		datasource.reader.read= function (datasource) {
			var totalRows=datasource.data.totalRows;
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			myReader.read(datasource);
		};
		
		datasource.load();
		var combo=$('#tabs '+tabId+' .cmbArticulo').wijcombobox({
			data: datasource,
			showTrigger: true,
			autoFilter: false,
			minLength: 1,
			animationOptions: {
				animated: "Drop",
				duration: 1000
			},
			forceSelectionText: false,
			search: function (e, obj) {
				//obj.datasrc.proxy.options.data.name_startsWith = obj.term.value;
			},
			select: function (e, item) {			
				$('#tabs '+tabId+' .txtFkArticulo').val(item.value);
			}
		});
		
		
	}
	this.guardar=function(){
		
		//Obtener todos los datos del formulario inline, obtener el id_temp del pedido
		//Enviar datos al servidor
		//En la respuesta, refrescar el grid
			
		var datos={
			id			:$(this.tabId+' .frmEditInlinePedido .txtId').val(),
			id_tmp		:$(this.tabId+' .frmEditInlinePedido .txtIdTmp').val(),
			cantidad	:$(this.tabId+' .frmEditInlinePedido .txtCantidad').val(),
			IdTmp		: $(this.tabId+' .frmEditInlinePedido .txtIdTmp').val(),
			fk_um		:$(this.tabId+' .frmEditInlinePedido .txtFkUm').val(),
			fk_articulo	:$(this.tabId+' .frmEditInlinePedido .txtFkArticulo').val(),
			fk_pedido	:$(this.tabId+' .frmPedidoi .txtId').val(),
			fk_tmp		:$(this.tabId+' .frmPedidoi .txtIdTmp').val()
		}
		var me=this;
		$.ajax({
			type: "POST",
			url: '/admin/pedidoi/guardarArticulo',
			data: {datos:datos}
		}).done(function( response ) {
									
			var resp = eval('(' + response + ')');
			var msg= (resp.msg)? resp.msg : '';
			var title;
			if ( resp.success == true	){
				icon='/images/yes.png';
				title= 'Success';
				
				
				$(me.tabId+' .frmEditInlinePedido').css('visibility','hidden');				
				$(me.tabId+' .grid_articulos').wijgrid('ensureControl', true);
				
				//this.gridArticulos.endEdit();
				
				
				
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
	this.configurarGrid=function(tabId){
		
		
		
		var fields=[
			{ name: "id"  },
			{ name: "id_tmp"  },
			{ name: "nombre"},
			{ name: "fk_articulo"},
			{ name: "cantidad"},
			{ name: "um"},
			{ name: "fk_um"}
		];
		var dataReader = new wijarrayreader(fields);
		var me=this;
		var dataSource = new wijdatasource({
			proxy: new wijhttpproxy({
				url: "/admin/pedidoi/getListaArticulos",
				dataType: "json"				
			}),
			
			dynamic:true,			
			reader:new wijarrayreader(fields),
			loading: function(e, data) { 
				var id=$(me.tabId+' .frmPedidoi .txtId').val();					
				var fk_tmp=$(me.tabId+' .frmPedidoi .txtIdTmp').val();					
			
                me.dataSource.proxy.options.data.id=id;
				me.dataSource.proxy.options.data.fk_tmp=fk_tmp;
				
			}
		});
		me.dataSource=dataSource;
		dataSource.reader.read= function (datasource) {		
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			dataReader.read(datasource);
		};				
		
		 // this.gridArticulos= new Oct.EditableGrid({
			// target: '#tabs '+this.tabId+" .grid_articulos"
		// });
		
		var gridPedidos=$('#tabs '+tabId+" .grid_articulos");				
		
		gridPedidos.wijgrid({
			dynamic: true,
			allowColSizing:true,
			allowPaging: true,
			pageSize:5,
			//allowEditing:false,
			allowKeyboardNavigation:true,			
			selectionMode:'singleRow',
			data:dataSource,
			beforeCellEdit: this.beforeCellEdit, 
			columns: [ 
				{ dataKey: "id", hidden:true, visible:false, headerText: "ID" },
				{ dataKey: "id_tmp", hidden:true, visible:false, headerText: "ID_TMP" },
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
			console.log("me.selected"); console.log(me.selected);
		} });
		
		gridPedidos.wijgrid({ loaded: function (e) { 
			$(tabId+' .grid_articulos tbody tr').bind('dblclick', function (e) { 																											
				var position = $(e.currentTarget).position();				
				$(me.tabId+' .frmEditInlinePedido').css('visibility','visible');				
				$(me.tabId+' .frmEditInlinePedido').css('top',position.top+'px');
				
				var w=$(me.tabId+' table.grid_articulos th:eq(0)').width();
				$(me.tabId+' .frmEditInlinePedido form  > div:eq(0)').css('width',w-5);				
			//	$(me.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox('repaint');				
				
				 w=$(me.tabId+' table.grid_articulos th:eq(1)').width();
				$(me.tabId+' .frmEditInlinePedido form  > div:eq(1)').css('width',w);				
				$(me.tabId+' .frmEditInlinePedido form  .txtCantidad').css('width',w-25);				
				
				var w=$(me.tabId+' table.grid_articulos th:eq(2)').width();
				$(me.tabId+' .frmEditInlinePedido form  > div:eq(2)').css('width',w-5);				
			//	$(me.tabId+' .frmEditInlinePedido .cmbUm').wijcombobox('repaint');				
				
				// w=$(me.tabId+' table.grid_articulos th:eq(2)').width();				
				// $(me.tabId+' .frmEditInlinePedido form > div:eq(2)').css('width',w-5);				
				
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
	
	this.configurarComboUM=function(){		
		var tabId=this.tabId;
		var fields=[{
			name: 'label',
			mapping: 'nombre'
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
		var combo=$(tabId+' .cmbUm').wijcombobox({
			data: datasource,
			showTrigger: true,
			minLength: 1,
			autoFilter: false,
			animationOptions: {
				animated: "Drop",
				duration: 1000
			},
			//forceSelectionText: true,
			search: function (e, obj) {
				//obj.datasrc.proxy.options.data.name_startsWith = obj.term.value;
			},
			select: function (e, item) {				
				
				$('#tabs '+tabId+' .txtFkUm').val(item.value);
			}
		});
						
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
		//Cargar los datos en el editor
		
		if (this.selected !=undefined){
			
			$(this.tabId+' .frmEditInlinePedido .txtId').val(this.selected.id);
			$(this.tabId+' .frmEditInlinePedido .txtIdTmp').val(this.selected.id_tmp);
			$(this.tabId+' .frmEditInlinePedido .txtCantidad').val(this.selected.cantidad);
			$(this.tabId+' .frmEditInlinePedido .txtCantidad').wijinputnumber('setText',this.selected.cantidad);
			$(this.tabId+' .frmEditInlinePedido .txtFkArticulo').val(this.selected.fk_articulo);				
			$(this.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox("option", "text", this.selected.nombre);			
			$(this.tabId+' .frmEditInlinePedido .txtFkUm').val(this.selected.fk_um);
			$(this.tabId+' .frmEditInlinePedido .cmbUm').wijcombobox("option", "text", this.selected.um); //
		}
		
		
		
		var w=$(this.tabId+' table.grid_articulos thead th:eq(0)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(0)').css('width',w-5);				
		$(this.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox('repaint');				
		
		 w=$(this.tabId+' table.grid_articulos thead th:eq(1)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(1)').css('width',w);				
		$(this.tabId+' .frmEditInlinePedido form  .txtCantidad').css('width',w-25);				
		
		var w=$(this.tabId+' table.grid_articulos thead th:eq(2)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(2)').css('width',w-5);				
		$(this.tabId+' .frmEditInlinePedido .cmbUm').wijcombobox('repaint');				
		
	};
	this.mostrarEditor=function(){		
		$(this.tabId+' .frmEditInlinePedido').css('visibility','visible');				
		var w=$(this.tabId+' table.grid_articulos thead th:eq(0)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(0)').css('width',w-5);				
		$(this.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox('repaint');				
		
		 w=$(this.tabId+' table.grid_articulos thead th:eq(1)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(1)').css('width',w);				
		$(this.tabId+' .frmEditInlinePedido form  .txtCantidad').css('width',w-25);				
		
		var w=$(this.tabId+' table.grid_articulos thead th:eq(2)').width();
		$(this.tabId+' .frmEditInlinePedido form  > div:eq(2)').css('width',w-5);				
		$(this.tabId+' .frmEditInlinePedido .cmbUm').wijcombobox('repaint');				
	};
	// this.mostrarTabEdicionArticulo=function(){
		// var data=this.selected;
		// this.mostrarTab(1, data);
	// };
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
		$(this.tabId+ ' .btnAgregar').click(function(){		
			
			$(me.tabId+' .frmEditInlinePedido').css('top','38px');
			$(me.tabId+' .frmEditInlinePedido .txtId').val(0);
			$(me.tabId+' .frmEditInlinePedido .txtCantidad').wijinputnumber('setText',0);
			$(me.tabId+' .frmEditInlinePedido .txtFkArticulo').val(0);				
			$(me.tabId+' .frmEditInlinePedido .cmbArticulo').wijcombobox("option", "text", '');			
			$(me.tabId+' .frmEditInlinePedido .txtFkUm').val(0);
			$(me.tabId+' .frmEditInlinePedido .cmbUm').wijcombobox("option", "text", ''); //
			
			me.mostrarEditor();
		});
	}
}