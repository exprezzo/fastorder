<?php
require '../mvc_core/modelo/Modelo_PDO.php';
static class Auth{
	function isLoged(){	
		return false;
	}
	
	function login($params){
		
	}
	
	function fblogin($params){
		
	}
	
	function getLogedUser(){
	
	}
	
	
	
	function rol(){
	}
	
	function getUserData($params){
		$mod = Auth::getModel();		
		return array(
			'success'=>false,
			'msg' => 'Nombre de usuario o contraseña incorrecta'			
		)
	}
	
	function getModel(){
		return new Modelo_PDO();
	}
	
	function logout(){
		//limpia la sesion
	}
	
	function signup(){
	
	}
}
?>