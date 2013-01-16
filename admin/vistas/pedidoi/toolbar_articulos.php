<?php $tabId=$_REQUEST['tabId']; ?>
<div class="ribbon tbArticulos">
	<ul>
		
		 <li><a href="#tbArticulos_<?php echo $tabId; ?>">Acciones</a>x</li>
	</ul>
	<div class="" id="tbArticulos_<?php echo $tabId; ?>">
		<ul>
			<li >				
				<button title="Nuevo" class="" name="nuevo">
					<div class="btnNuevo"></div>
					<span>Nuevo</span>
				</button>
				<button title="Editar" class="" name="editar">
					<div class="btnEditar"></div>
					<span>Editar</span>
				</button>				
				<button title="Guardar" class="" name="guardar">
					<div class="btnGuardar"></div>
					<span>Guardar</span>
				</button>
				<button title="Eliminar" class="" name="eliminar">
					<div class="btnEliminar"></div>
					<span>Eliminar</span>
				</button>
				
			 </li>			 
		</ul>
	</div>
</div>
