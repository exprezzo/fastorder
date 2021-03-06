<?php
require_once '../mvc_core/vista/vista.php';
require_once 'PHPUnit.php';
class VistaTestcase extends PHPUnit_TestCase{

	function setUp() {
		if (!defined('PATH_NUCLEO') ) define ('PATH_NUCLEO','../mvc_core/');
		if (!defined('VISTAS_PATH') ) define ('VISTAS_PATH','nucleo_test/');
    }
	
	function testRender(){
		ob_start();
		$vista= new Vista();
		
		$respuesta = $vista->render('','index_test');
		ob_end_clean();
		$esperado=array(
			'success'=>true,
			'msg'=>'accion render ejecutada con �xito'
		);
		$this->assertTrue($respuesta['success'] == $esperado['success'] );
	}
	
	/*
	function testValidarParametros(){
		$this->assertTrue( false );
	}*/
}

?>