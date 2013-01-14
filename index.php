<?php
	/**
	 * Punto de inicio
	 * */
	$a=1;
	if ($a==0){
		echo "El sistema está en mantenimiento, disculpe los inconvenientes.";
		include 'lego_core/manejador_crud.php';
		$manejador = new ManejadorCrud();
		$ligarParametros = $manejador->ligarParametros(array());		
	}else{
		header("Location: /admin/general/index");
	}

?>