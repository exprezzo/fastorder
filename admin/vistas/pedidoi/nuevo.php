<style type="text/css">
	form.frmPedidoi label{
		width:100px;
		/* display:inline-block; */
	}
	
	div.frmPedido{ width: auto !important; display: inline-block !important; padding:8px; border:#b7c7e1 1px solid !important; box-shadow: 10px 10px 5px #888888; margin-top:10px; left:100px;}
	div.frmPedido .formTitle{display:block; padding:0px 0 0 6px; cursor:move; }
	div.frmPedido .formTitle .closeBtn{cursor:pointer; width:16px; height:16px; display:inline-block; }
	
	.toolbarFormPedido .boton{ 	border-radius:9px;	border:#e3e2d9 1px solid;display: inline-block; padding: 10px 3px 10px 3px; cursor:pointer; }
	.toolbarFormPedido span{ margin-top: 5px;display: inline-block;border-radius: 6px;	padding: 0px 6px 0px 6px;border: #e3e2d9 1px solid;font-family:arial; color:white; font-size: 12px; font-family: cursive; }
	.iconWrap{	border: #9b9b9b 1px solid; display: inline-block; border-radius: 45px; padding: 2px; }
	.iconWrap .icon{ width: 20px;height: 20px; background-color: rgb(228, 226, 226); background-repeat: no-repeat; background-position: 50%; border-radius: 45px; padding: 3px; }
	.boton.btnNew .icon{ background: #8db817 url('/images/document_new.png') no-repeat scroll center;  }		
	.boton.btnNew span{background: #8db817; }
	
	.boton.btnEdit .icon{background: #dbc512 url('/images/document_edit.png') no-repeat scroll center;}
	.boton.btnEdit span{background-color: #dbc512;}
	.boton.btnEmail .icon{background: #4f77b5 url('/images/pre_mail.png') no-repeat scroll center;}
	.boton.btnEmail span{background-color: #4f77b5;}
	.boton.btnPrint .icon{background: #9d9c9c url('/images/printer.png') no-repeat scroll center;}
	.boton.btnPrint span{background-color: #9d9c9c;}
	.boton.btnDelete .icon{background: #d74e46 url('/images/delete.png') no-repeat scroll center;}
	.boton.btnDelete span{background-color: #d74e46;}
	
	div.frmPedido .paneles{padding:8px;}
	div.frmPedido .pnlIzq{display: inline-block !important;} 
	div.frmPedido .pnlDer{display: inline-block !important; margin-top: 3px; vertical-align: top;} 
		
	.frmEditInlinePedido{position:absolute;z-index:10;transition: all 1s;-visibility:hidden;margin-left:-8px; -webkit-transition: all .5s;}
	.frmEditInlinePedido .cmbArticulo{width:226px;}	
	.frmEditInlinePedido .txtCantidad{width:235px;}	
	.frmEditInlinePedido .cmbUm{width:186px;}
	.frmEditInlinePedido form {background:white; width:682px; border:black 1px solid;border-radius:10px; box-shadow: 10px 10px 5px #888888;}
	.toolbarFormPedidoInline {display: inline-block; margin-top:-1px; margin-left:78px; }
	.toolbarFormPedidoInline .boton{border-radius:9px;	border:#e3e2d9 1px solid;display: inline-block; padding: 5px 3px 5px 3px; cursor:pointer; background:white; border:black 1px solid;border-radius:10px; box-shadow: 10px 10px 5px #888888; }
	.toolbarFormPedidoInline span{margin-left:3px; margin-top: 5px;display: inline-block;border-radius: 6px;	padding: 0px 6px 0px 6px;border: #e3e2d9 1px solid;font-family:arial; color:white; font-size: 12px; font-family: cursive; }	
	.toolbarFormPedidoInline .iconWrap{float:left; }
	
	.toolbarFormPedidoInline .wrapText{display:inline; float:right; }	
	.toolbarFormPedidoInline .btnEdit{margin-left: 116px;text-align: center;margin-right: 112px;}
</style>
<script src="/js/admin/catalogos/pedidos/edicion_pedido.js"></script>
<script>
	$( function(){
		var tabId="<?php echo $_REQUEST['tabId']; ?>";
		var pedidoId=<?php echo $_REQUEST['pedidoId']; ?>;
		var almacen="<?php echo isset($this->pedido)?  $this->pedido['nombreAlmacen'] : ''; ?>";
		var edicion = new EdicionPedido();
		edicion.init(tabId, pedidoId, almacen);
	});
</script>

<!--div >
	<button class='btnGuardar'>Guardar</button>
	<button class='btnEliminar'>Eliminar</button>
	<button class='btnNuevo'>Nuevo</button>
</div-->

<?php
	$fecha= isset($this->pedido)? $this->pedido['fecha'] : '';
	$nombreAlmacen= isset($this->pedido)? $this->pedido['nombreAlmacen'] : '';
	$fk_almacen= isset($this->pedido)? $this->pedido['fk_almacen'] : '';
	$id= isset($this->pedido)? $this->pedido['id'] : 0;
?>


<div class="formTitle ui-widget-header ">
	<span class="">PEDIDO</span>
	<span class="closeBtn ui-icon ui-icon-close"></span>
</div>

<div class="paneles">
	<div class="pnlIzq">
		<form class='frmPedidoi' style='padding-top:10px;'>	
			<input type='hidden' name='id' class="txtId" value="<?php echo $id; ?>" />	
			<input type='hidden' name='fecha' class="txtFkAlmacen" value="<?php echo $fk_almacen; ?>" />
			<div style='display:inline-block;'>
				<div class="inputBox" style='margin-bottom:5px;'>
					<label >Fecha:</label>
					<input type='text' name='fecha' class="txtFecha" value="<?php echo $fecha; ?>" autofocus />
				</div>
				<div class="inputBox" style='margin-bottoms:5px;'>		
					<label>Almacen:</label>
					<select class="cmbAlmacen" style='width:170px;'>			
					</select>
				</div>		
			</div>
			<div style='display:inline-block;'>
				<div class="inputBox" style='margin-bottoms:5px;'>		
					<label>Destino:</label>
					<select class="cmbDestino" style='width:170px;'>			
					</select>
				</div>		
				
			</div>
			<br />	
		</form>
		<div class="cardArticulos">
			<div style='display:inline-block;' class="pnlArticulos ui-widget-content">								
				<table class="grid_articulos" style="width:650px;">
					<thead>
						<th>Producto</th> 
						<th>Cantidad</th>
					</thead>
				  <tbody>
					<tr><td></td> <td></td></tr>
					<?php 
						if ( isset($this->pedido) )
						foreach($this->pedido['articulos'] as $articulo){			
						//	echo '<tr><td>'.$articulo['nombreProducto'].'</td> <td>'.$articulo['cantidad'].'</td></tr>';
						}
					?>
					
				  </tbody>
				</table>
			</div>
			
			<?php $this->mostrar('pedidoi/edicion_articulo'); ?>
			
		</div>
	</div>
	<div class="pnlDer" >
		<div class="toolbarFormPedido">
		
			<div style="text-align:center;" class="boton btnNew">
				<div class="iconWrap">		
					<div class="icon"></div>
				</div>
				<div>
					<span>Nuevo</span>
				</div>		
			</div>
			<div style="text-align:center;" class="boton btnEdit">
				<div class="iconWrap">		
					<div class="icon"></div>
				</div>
				<div>
					<span>Editar</span>
				</div>		
			</div>
			<div style="text-align:center;" class="boton btnEmail">
				<div class="iconWrap">		
					<div class="icon"></div>
				</div>
				<div>
					<span>Email</span>
				</div>		
			</div>
			<div style="text-align:center;" class="boton btnPrint">
				<div class="iconWrap">		
					<div class="icon"></div>
				</div>
				<div>
					<span>Imprimir</span>
				</div>		
			</div>
			<div style="text-align:center;" class="boton btnDelete">
				<div class="iconWrap">		
					<div class="icon"></div>
				</div>
				<div>
					<span>Borrar</span>
				</div>		
			</div>			
		</div>
	</div>
</div>