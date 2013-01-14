var ListaReservaciones=function(){
	this.init=function(tabId){
		tabId = '#' + tabId;
		this.tabId = tabId;
		
		$('div'+tabId).css('padding','0px 0 0 0');
		$('div'+tabId).css('margin-top','0px');
		$('div'+tabId).css('border','0 1px 1px 1px');

		var tab=$('a[href="'+tabId+'"]');
		tab.html('Reservacones');
		tab.addClass('listaReservaciones');
				
		this.configurarGrid(tabId);
	};

	
	this.configurarGrid=function(tabId){
		var pageSize=10;
		var hContainer = $('#tabs').height();
		var hNav= $('#tabs .ui-tabs-nav').height();
		var newH = hContainer-hNav;
		var altoHeaderGrid = 38;
		newH=newH - (2*altoHeaderGrid);
		newH=parseInt(newH/altoHeaderGrid);
		pageSize=newH-1;		

		//var totalRows=<?php //echo isset($this->total)?$this->total: 0 ?>;
		var fields=[
			{ name: "id"  },
			{ name: "nombre"},
			{ name: "email"},			
			{ name: "telefono"},
			{ name: "origen"},
			{ name: "destino"},
			{ name: "vuelo"}
		];
		var dataReader = new wijarrayreader(fields);

		var dataSource = new wijdatasource({
			proxy: new wijhttpproxy({
				url: "/admin/reservaciones/paginar",
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
		this.dataSource=dataSource;
		var grid=$("#lista_de_reservaciones");

		
		var me=this;
		grid.wijgrid({
			dynamic: true,
			allowColSizing:true,
			//allowEditing:false,
			allowKeyboardNavigation:true,
			allowPaging: true,
			pageSize:pageSize,
			selectionMode:'singleRow',
			data:dataSource,
			columns: [ 
			{ dataKey: "id", visible:false, headerText: "COD" },			
			{dataKey: "nombre", headerText: "Nombre" }, 
			{dataKey: "email", headerText: "Email" },
			{dataKey: "telefono", headerText: "Telefono" },
			{dataKey: "vuelo", headerText: "Vuelo" },
			{dataKey: "origen", headerText: "Origen" },
			{dataKey: "destino", headerText: "Destino" }
			],
			rowStyleFormatter: function(args) {
				// if (args.dataRowIndex>-1)
					// args.$rows.attr('pedidoId',args.data.id);
			},
			loading: function (dataSource, userData) {                            
				// var fi=$('#tabs '+me.tabId+' .txtFechaI').val();	
				// var ff=$('#tabs '+me.tabId+' .txtFechaF').val();			
                // me.dataSource.proxy.options.data={fechai:fi, fechaf:ff};
            },
			cellStyleFormatter: function(args) { 
				if (args.column._originalDataKey=='fecha'){
					// console.log(args);		
					args.$cell.addClass("colFecha");
				}			
			} 
		});
		
		var me=this;
		
		grid.wijgrid({ selectionChanged: function (e, args) { 					
			var item=args.addedCells.item(0);
			var row=item.row();
			var data=row.data;			
			me.selected=data;			
		} });
		
		grid.wijgrid({ loaded: function (e) { 
			// $('#lista_de_reservaciones tr').bind('dblclick', function (e) { 			
				// var pedidoId=$(e.currentTarget).attr('pedidoId');
				// if (pedidoId==undefined || pedidoId=='' || pedidoId==0) return false;				
				// TabManager.add('/pedidoi/getPedido','Editar Pedido',pedidoId);				
			// });			
		} });
	};
}
ListaReservaciones.prototype.eliminar=function(){
	
	var id = this.selected.id;
	var me=this;
	$.ajax({
			type: "POST",
			url: '/pedidoi/eliminar',
			data: { id: id}
		}).done(function( response ) {		
			var resp = eval('(' + response + ')');
			var msg= (resp.msg)? resp.msg : '';
			var title;
			if ( resp.success == true	){
				icon='/images/yes.png';
				title= 'Success';				
				var gridPedidos=$(me.tabId+" #lista_pedidos_internos");				
				gridPedidos.wijgrid('ensureControl', true);  
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
}