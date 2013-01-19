<style type="text/css">
	form.frmPedidoi label{
		width:100px;
		/* display:inline-block; */
	}
	
	
</style>
<script src="/js/admin/catalogos/pedidos/edicion_pedido.js"></script>
<script>
	$( function(){
		var tabId="<?php echo $_REQUEST['tabId']; ?>";
		var pedidoId=<?php echo $_REQUEST['pedidoId']; ?>;
		var almacen="<?php echo isset($this->pedido)?  $this->pedido['nombreAlmacen'] : ''; ?>";
		
		EdicionPedido.init(tabId, pedidoId, almacen);

	});
</script>
<?php $this->mostrar('pedidoi/toolbar'); ?>
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
	<div style='' class="pnlArticulos ui-widget-content">
		<div style='position:relative;'>
			<hr></hr>
			<h3 style='position:absolute;top:-31px; left:40px;border:0px;' class='ui-widget-content'>Art&iacute;culos del Pedido</h3>
		</div>
		<?php $this->mostrar('pedidoi/toolbar_articulos'); ?>
		<table class="grid_articulos" style="width:800px !Important;">
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
	<div class="pnlEdicionArticulo ui-widget-content">
		<div style='position:relative;'>
			<hr></hr>
			<h3 style='position:absolute;top:-31px; left:40px;border:0px;' class='ui-widget-content'>Art&iacute;culo</h3>
		</div>
		<?php $this->mostrar('pedidoi/edicion_articulo'); ?>
		
	</div>
</div>