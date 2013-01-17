<script src="/js/admin/catalogos/pedidos/edicion_articulo.js"></script>
<script>
	$(function(){
		var  tabId="<?php echo $_REQUEST['tabId']; ?>";
		var frmEdicionArticulo = new EdicionArticulo(tabId);
		 frmEdicionArticulo.init(tabId);
	});
</script>
<div class="frmEditInlinePedido" style="">

	<form>
		<select class="cmbArticulo" placeholder="Articulo">
			<option value="1">a</option>
			<option value="2">b</option>
			<option value="3">c</option>
			<option value="4">d</option>
		</select>				
		<input placeholder="cantidad" class="txtCantidad"/>
		<select placeholder="Unidad de Medida" class="cmbUm">
			<option>A</option>
			<option>B</option>
			<option>C</option>
			<option>D</option>
		</select>
	</form>
	<div class="toolbarFormPedidoInline">

		<div style="text-align:center;" class="boton btnNew">
			<div class="iconWrap">		
				<div class="icon"></div>
			</div>
			<div class="wrapText">
				<span>Guardar</span>
			</div>		
		</div>
		<div style="text-align:center;" class="boton btnEdit">
			<div class="iconWrap">		
				<div class="icon"></div>
			</div>
			<div class="wrapText">
				<span>Cancelar</span>
			</div>		
		</div>				
		<div style="text-align:center;" class="boton btnDelete">
			<div class="iconWrap">		
				<div class="icon"></div>
			</div>
			<div class="wrapText">
				<span>Borrar</span>
			</div>		
		</div>			
	</div>
</div>