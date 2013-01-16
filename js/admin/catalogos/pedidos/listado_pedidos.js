var ListaPedidos=function(){
	this.init=function(tabId){
		tabId = '#' + tabId;
		this.tabId = tabId;
		
		$('div'+tabId).css('padding','0px 0 0 0');
		$('div'+tabId).css('margin-top','0px');
		$('div'+tabId).css('border','0 1px 1px 1px');

		var tab=$('a[href="'+tabId+'"]');
		tab.html('Pedidos');
		tab.addClass('listaPedidos');
		
		this.configurarToolbar(tabId);		
		this.configurarGrid(tabId);
	};
	this.configurarToolbar=function(tabId){
		var me=this;
		$(tabId+ " > .tbPedidos").wijribbon({
			click: function (e, cmd) {
				switch(cmd.commandName){
					case 'nuevo':
						TabManager.add('/admin/pedidoi/nuevo','Nuevo Pedido');				
					break;
					case 'editar':
						if (me.selected!=undefined){													
							TabManager.add('/admin/pedidoi/getPedido','Editar Pedido',me.selected.id);
						}
					break;
					case 'eliminar':
						if (me.selected==undefined) return false;
						var r=confirm("¿Eliminar el pedido?");
						if (r==true){
						  me.eliminar();
						}
					break;
					case 'refresh':
						var fi=$('#tabs '+tabId+' .txtFechaI').val();
						alert(fi);
						var gridPedidos=$(me.tabId+" #lista_pedidos_internos");
						gridPedidos.wijgrid('ensureControl', true);
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
					case 'imprimir':
						alert("Imprimir en construcción");						
					break;
				}
				
			}
		});
		$('#tabs '+tabId+' .txtFechaI').wijinputdate({ dateFormat: 'd/M/yyyy', showTrigger: true});	
		$('#tabs '+tabId+' .txtFechaF').wijinputdate({ dateFormat: 'd/M/yyyy', showTrigger: true});	
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
		var dataReader = new wijarrayreader([
			{ name: "id"  },
			{ name: "fecha"},
			{ name: "nombreAlmacen"}
		]);

		var dataSource = new wijdatasource({
			proxy: new wijhttpproxy({
				url: "/admin/pedidoi/paginar",
				dataType: "json"
			}),
			dynamic:true,			
			reader:new wijarrayreader([
				 { name: "id"},
				 { name: "fecha"},
				 { name: "nombreAlmacen"}
			])							
		});
		dataSource.reader.read= function (datasource) {
			
			var totalRows=datasource.data.totalRows;			
			datasource.data = datasource.data.rows;
			datasource.data.totalRows = totalRows;
			dataReader.read(datasource);
		};				
		this.dataSource=dataSource;
		var gridPedidos=$("#lista_pedidos_internos");

		// gridPedidos.wijgrid();
		var me=this;
		gridPedidos.wijgrid({
			dynamic: true,
			allowColSizing:true,
			//allowEditing:false,
			allowKeyboardNavigation:true,
			allowPaging: true,
			pageSize:pageSize,
			selectionMode:'singleRow',
			data:dataSource,
			columns: [ { dataKey: "id", hidden:true, visible:false, headerText: "ID" },{dataKey: "nombreAlmacen", headerText: "Almac&eacute;n",width:'80%' }, {dataKey: "fecha", headerText: "Fecha",width:'20%' } ],
			rowStyleFormatter: function(args) {
				if (args.dataRowIndex>-1)
					args.$rows.attr('pedidoId',args.data.id);
			},
			loading: function (dataSource, userData) {                            
				var fi=$('#tabs '+me.tabId+' .txtFechaI').val();	
				var ff=$('#tabs '+me.tabId+' .txtFechaF').val();			
                me.dataSource.proxy.options.data={fechai:fi, fechaf:ff};
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
			$('#lista_pedidos_internos tr').bind('dblclick', function (e) { 			
				var pedidoId=$(e.currentTarget).attr('pedidoId');
				if (pedidoId==undefined || pedidoId=='' || pedidoId==0) return false;				
				TabManager.add('/admin/pedidoi/getPedido','Editar Pedido',pedidoId);				
			});			
		} });
	};
}
ListaPedidos.prototype.eliminar=function(){
	
	var id = this.selected.id;
	var me=this;
	$.ajax({
			type: "POST",
			url: '/admin/pedidoi/eliminar',
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