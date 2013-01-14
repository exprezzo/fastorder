<?php
class  Vista{		
	var $errores=array();
	var $valores=array();
	
	//TOD: Documentar estas dos funciones.
	function mostrarError($campo){
		if ( !empty($this->errores[$campo]) ){
			echo $this->errores[$campo];
		}
	} 
	
	function mostrarValor($campo){
		if ( !empty($this->valores[$campo]) ){
			echo $this->valores[$campo];
		}
	}
	
	/* Busca dentro  la carpeta vistas, 
		accion				.php	DEFAULT
		controlador/accion 	.php	DEFAULT	
		ruta/a/vista     	.php	custom
		
	*/   
	function mostrar($vista=''){
		global $_PETICION;
		if ( empty($vista) ){
			$controlador=$_PETICION->controlador;
			$controlador.= !empty($_PETICION->controlador)?  '/' : '';
			$vista=$controlador.$_PETICION->accion;
		}
		$rutaVista=$_PETICION->basePath.'vistas/'.$vista.'.php';		
		$vista_existe = ( file_exists($rutaVista) ) ? true : false;
		
		if ($vista_existe) {
			$this->antesdeMostrar($vista);
			require_once($rutaVista); 
			$this->despuesdeMostrar($vista);
			$success=true;
			$msg='accion render ejecutada con éxito';			
		}else{					
			$success=false;
			$msg='No existe la vista: '.$rutaVista;
			echo $msg;
			//header("HTTP/1.0 404".$msg);
		}
				
		return array(
			'success'=>$success,
			'msg'=>$msg
		);
	}
			
	function antesdeMostrar($accion){
	
	}
	
	function despuesdeMostrar($accion){
		
	}
	
	function render($controlador = '', $accion = ''){	
		return $this->mostrar();
	} 
	
	function setRutaContenido($rutaContenido){
		$this->rutaContenido=$rutaContenido;
	}
}
/**/
?>
