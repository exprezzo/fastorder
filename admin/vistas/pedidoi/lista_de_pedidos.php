﻿<script src="/js/admin/catalogos/pedidos/listado_pedidos.js"></script>
<style type="text/css">
	.colFecha{
		text-align:right;
	}
	.tbFecha input{
		height: 30px;
font-size: 17px;
text-align: right;
	}
	
	.tbFecha > div:first-child{
		display:block;
	}
	
	.tbFecha .ui-icon{
		
	/*
		background-image: url('/images/office_calendar.png') !important;
		width:52px !important;
		height:19px !important;*/
		background-position:-47px -95px !important; 
		
	}
	
	.tbFecha .wijmo-wijinput-trigger{
		background: transparent;
		border: 0;
		
	}
	
	
</style>
<script>			
	$( function(){
			
		
		var tabId="<?php echo $_REQUEST['tabId']; ?>";
		var lista=new ListaPedidos(tabId);
		lista.init(tabId);
		
	});
</script>
<?php 
	//include_once('../app/vistas/pedidoi/lista_toolbar.php') 
	global $_PETICION;
	$this->mostrar($_PETICION->controlador.'/lista_toolbar');
?>
<div style="">	
	<table id="lista_pedidos_internos">
		<thead>
			<th>id</th>		
			<th>Almac&eacute;n</th>		
			<th>Fecha</th> 		
		</thead>  	 
		<tbody>
			<?php foreach($this->pedidos as $pedido ){
			//	echo '<tr><td>'.$pedido['id'].'</td><td>'.$pedido['nombreAlmacen'].'</td> <td>'.$pedido['fecha'].'</td></tr>';
			}
			?>		
		</tbody>
	</table>
</div>
</div>