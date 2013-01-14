<?php
	//  AQUI INICIA EL PROCESO
	session_start();
	require_once '../config.php';		
	require_once 'despachador.php';		
	
	define ("VISTAS_PATH",		 PATH_MVC.'vistas/');
	define ("PATH_CONTROLADORES",PATH_MVC.'controladores/');

	$despachador = new Despachador();
	
	try{		
		$_PETICION=new Peticion(); //Analiza el url

		if ( !empty($_PETICION->modulo) ){
			$rutaControlador='../'.$_PETICION->modulo.'/controladores/'.$_PETICION->controlador.'.php';
			$_PETICION->basePath='../'.$_PETICION->modulo.'/';
		}else{
			//carga el controlador del modulo default
			$rutaControlador=PATH_CONTROLADORES.$_PETICION->controlador.'.php';
			$_PETICION->basePath=PATH_MVC;
		}
				
		if ( file_exists($rutaControlador) ){
			require_once ($rutaControlador);
		}else{
			$respuesta=array(
				'success'=>false,
				'msg'	 =>'El controlador '.$_PETICION->controlador.' no existe',
			);				
			header("HTTP/1.0 404 Not Found".'El controlador '.$_PETICION->controlador.' no existe');
		}
				
		$despachador->despacharPeticion($_PETICION);
	}catch(Exception $e){
		//echo 'Ups. <br>';
		echo 'Exception: '.$e->getMessage();
		//echo "El sistema ha sufrido un fallo, consulte con el administrador del sistema";
		//PENDIENTE: registrar la exception   -------		
	}
?>
