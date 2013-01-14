<script src="/js/catalogos/pedidos/edicion_articulo.js"></script>
<script>
	$(function(){
		var  tabId="<?php echo $_REQUEST['tabId']; ?>";
		var frmEdicionArticulo = new EdicionArticulo(tabId);
		 frmEdicionArticulo.init(tabId);
	});
</script>
<?php include_once('../app/vistas/pedidoi/toolbar_articulo.php'); ?>
<form>	
	<div class="inputBox" style='margin-bottoms:5px;'>		
		<label>Articulo:</label>
		<select class="cmbArticulo" style='width:170px;'>			
		</select>
	</div>	
	
	<div class="inputBox" style='margin-bottoms:5px;'>
		<label >Cantidad:</label>
		<input type='text' name='cantidad' class="txtCantidad" value="" />
	</div>
	
	<div class="inputBox" style='margin-bottoms:5px;'>		
		<label>UM:</label>
		<select class="cmbUM" style='width:170px;'>			
		</select>
	</div>	
</form>	