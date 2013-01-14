<script type="text/javascript">
	$(function () {
		// $(".ribbon").wijribbon({
			// click: function (e, cmd) {
				// alert(cmd.commandName);
			// }
		// })
	});	
</script>
<style type="text/css">
	
</style>
<?php $tabId=$_REQUEST['tabId']; ?>
<div class="ribbon tbPedido">
	<ul>
		 <li><a href="#tbPedido_<?php echo $tabId; ?>">Format</a></li>		 
	</ul>
	<div id="tbPedido_<?php echo $tabId; ?>" class="">
		<ul>
			<li id="actiongroup">				
				<button title="Nuevo" class="" name="nuevo">
					<div class="btnNuevo"></div>
					<span>Nuevo</span>
				</button>
				<button title="Guardar" class="" name="guardar">
					<div class="btnGuardar"></div>
					<span>Guardar</span>
				</button>
				<button title="Eliminar" class="" name="eliminar">
					<div class="btnEliminar"></div>
					<span>Eliminar</span>
				</button>
				<button title="Imprimir" class="" name="imprimir">
					<div class="btnImprimir"></div>
					<span>Imprimir</span>
				</button>				
			 </li>	
			
		</ul>
	</div>
</div>
