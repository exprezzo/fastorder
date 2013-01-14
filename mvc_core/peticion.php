<?php
class Peticion{
	function Peticion(){
		// Ruta relativa    http://localhost/lego_mvc/controlador/vista?foo=bar
		//  [PATH_INFO] => /controlador/vista
		
		// Ruta Absoluta    http://lego/controlador/vista?foo=bar 
		//  [PATH_INFO] => /controlador/vista		
		
		//-------------------------------------------------------------------------------
		$arrAppPath = explode('/',$_SERVER['SCRIPT_NAME']) ;		
		//no nos interesa el primero ni los ultimos dos
		$app_path='/';		
		
		$arrCount=sizeof($arrAppPath);
		for( $i=1;  $i<$arrCount-2; $i++ ){		
			$app_path.=''.$arrAppPath[$i].'/';			
		}
		
		if (!defined('APP_PATH') ) define('APP_PATH',$app_path);				
		//-------------------------------------------------------------------------------
		//echo '<pre>'; print_r($_SERVER); echo '<pre>';
		if ( isset($_SERVER['ORIG_PATH_INFO']) ){
			$_SERVER['PATH_INFO'] = $_SERVER['ORIG_PATH_INFO'];
		}
		if ( !isset($_SERVER['PATH_INFO']) ) $_SERVER['PATH_INFO'] = "/home";
		$url=$_SERVER['PATH_INFO'];		
		$xp = explode ( '/', $url);		
		$size=sizeof($xp);
		$modulo='';
		
		switch($size){
			case 1:		//no Escribio nada
				$controlador='pages';
				$accion		='index';
			break;
			case 2:	// solo escribió un parametro  ( la accion )
				$controlador='pages';
				$accion		=$xp[1];
			break;			
			case 3:	// escribió el controlador y la accion
				$controlador=$xp[1];
				$accion		=$xp[2];
			break;
			case 4:	// escribió el modulo, controlador y la accion
				$modulo		=$xp[1];
				$controlador=$xp[2];
				$accion		=$xp[3];				
			break;			
			default:
				//throw new Exception($url. " No reconocida" );
				header("HTTP/1.0 404 ".$url. " No reconocida");
				// escribió algo incomprensible, en este caso deberia lanzar una pagina de error
		}
		
		$this->controlador = $controlador;
		$this->accion 	   = $accion;		
		$this->modulo 	   = $modulo;				
	}
}
?>