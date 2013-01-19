<?php
class UserModel extends Modelo_PDO{
	var $tabla='system_users';	
	
	function login($username, $pass){
		//si el username es un email, se busca por email y pass
		//si no, se busca por username y pass
		
		if ( filter_var($username, FILTER_VALIDATE_EMAIL) ) {
			$sql = 'SELECT * FROM '.$this->tabla.' WHERE email=:username and :pass=AES_DECRYPT(pass, "'.PASS_AES.'")';
		}else{
			$sql = 'SELECT * FROM '.$this->tabla.' WHERE nick=:username and :pass=AES_DECRYPT(pass, "'.PASS_AES.'")';
		}									
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':username',$username, PDO::PARAM_STR);
		$sth->bindValue(':pass',$pass, PDO::PARAM_STR);
		
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array('success'=>false);
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El usuario está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		$this->registrarEnSesion($modelos[0]);
		$_SESSION['logoutUrl'] = '/users/logout';		
		return array(
			'success'=>true,
			'datos'=>$modelos[0]
		);		
	}
	function buscarCoincidencias($username, $email ){
		$respuesta = array();
		$respuesta['success']=false;
		
		$respuesta['coincidencias']=array();
		
		$resp=$this->findByEmail( $email );
		if ( !empty($resp) ){
			$respuesta['success']=true;
			$respuesta['coincidencias']['email'] = true;
		}
		
		$resp=$this->findByNick( $username );
		if ( !empty($resp) ){
			$respuesta['success']=true;
			$respuesta['coincidencias']['nick'] = true;
		}
		
		return $respuesta;
	}
	
	
	function registrarEnSesion($userInfo){
		$_SESSION['isLoged']=true;
		$_SESSION['userInfo']=$userInfo;

	}
	
	function logout(){
		unset($_SESSION['isLoged']);
		unset($_SESSION['userInfo']);	
		unset($_SESSION['logoutUrl']);		
	}
	function registrar($nick, $email, $pass,$nombre){
		$dbh=$this->getConexion();
		
		$sql='INSERT INTO system_users SET nick=:nick , pass=AES_ENCRYPT(:pass, "'.PASS_AES.'"), name=:name,email=:email';
		$sth = $dbh->prepare($sql);		
		
		$sth->bindValue(':nick', $nick,  PDO::PARAM_STR);							
		$sth->bindValue(':pass', $pass,  PDO::PARAM_STR);
		$sth->bindValue(':email', $email, PDO::PARAM_STR);
		$sth->bindValue(':name', $nombre, PDO::PARAM_STR);
			
		$exito = $sth->execute();
		
		$resp=array();
		
		if (!$exito){						
			$resp['success']=false;
			$error=$sth->errorInfo();
			$resp['msg']    = $error[2];
		}else{			
			$resp['success']=true;
			$resp['datos']  =$this->findByEmail($email);			
			$this->registrarEnSesion( $resp['datos'] );
			$_SESSION['logoutUrl'] = '/users/logout';		
		}				
		
		return $resp;
		
		/* $respuesta = array();
		$respuesta['success']=false;
		
		$respuesta['coincidencias']=array();
		
		$resp=$this->findByEmail( $email );
		if ( !empty($resp) ){
			$respuesta['success']=true;
			$respuesta['coincidencias']['email'] = true;
		}
		
		$resp=$this->findByNick( $username );
		if ( !empty($resp) ){
			$respuesta['success']=true;
			$respuesta['coincidencias']['nick'] = true;
		}
		
		
		
		return $respuesta; */
	}
	
	function findByEmail($email, $userId=null){
	
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE email=:email';				
		if ($userId){
				$sql.=' AND id !='.$userId;
		}
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':email',$email, PDO::PARAM_STR);
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array();
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El usuario está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0];			
	}
	function findByFbId($fbid){
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE fbid=:fbid';				
				
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':fbid',$fbid, PDO::PARAM_STR);
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array();
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El usuario está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0];			
	}
	function findById($id){
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE id=:id';				
				
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id, PDO::PARAM_INT);
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array();
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El usuario está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0];			
	}
	
	function findByNick($nick, $userId=null){
		
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE nick=:nick';				
		
		if ($userId){
				$sql.=' AND id !='.$userId;
		}		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':nick',$nick, PDO::PARAM_STR);
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array();
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El usuario está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0];			
	}
	
	function actualizarSesion(){		
		 
		$user=$this->findById( $_SESSION['userInfo']['id'] );
		
		$this->registrarEnSesion($user);
	}
	function compruebaPass($id,$pass){
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE id=:id and :pass=AES_DECRYPT(pass, "'.PASS_AES.'")';
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id, PDO::PARAM_INT);
		$sth->bindValue(':pass',$pass, PDO::PARAM_STR);
		
		$exito = $sth->execute();
		$resp=array();
		if (!$exito){			
			//Logger->logear   		PENDIENTE: LOGEAR
			$resp['success']=false;
			$error=$sth->errorInfo();
			$resp['msg']    = $error[2];
		}else{			
			$resp['success']=true;		
		}
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			return array(
				'success'=>false,
				'msg'=>'Wrong password entered'
			);
		}
		
		return $resp;
	}
	
	function updatePass($id,$pass){
		$sql = 'UPDATE '.$this->tabla.' SET pass=AES_ENCRYPT(:pass, "'.PASS_AES.'") WHERE id=:id ';
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id, PDO::PARAM_INT);
		$sth->bindValue(':pass',$pass, PDO::PARAM_STR);
		
		$exito = $sth->execute();
		$resp=array();
		if (!$exito){			
			//Logger->logear   		PENDIENTE: LOGEAR
			$resp['success']=false;
			$error=$sth->errorInfo();
			$resp['msg']    = $error[2];
		}else{			
			$resp['success']=true;		
		}
		
		return array(
			'success'=>true
		);
		
	}
	
	function registrarFb($nick, $name, $email, $fbid){		
	
	
	function getEstadisticas(){
	
	}
	
	
	
		$dbh=$this->getConexion();
		
		$sql='INSERT INTO system_users SET nick=:nick , email=:email, fbid=:fbid, name=:name';
		$sth = $dbh->prepare($sql);		
		
		$sth->bindValue(':nick', $nick,  PDO::PARAM_STR);							
		$sth->bindValue(':email', $email,  PDO::PARAM_STR);
		$sth->bindValue(':fbid', $fbid, PDO::PARAM_STR);
		$sth->bindValue(':name', $name, PDO::PARAM_STR);
			
		$exito = $sth->execute();
		
		$resp=array();
		
		if (!$exito){			
			//Logger->logear   		PENDIENTE: LOGEAR
			$resp['success']=false;
			$error=$sth->errorInfo();
			$resp['msg']    = $error[2];
		}else{
			
			$resp['success']=true;
			$resp['datos']  =$this->findByEmail($email);
			
			$this->registrarEnSesion( $resp['datos'] );
		}
		
		return $resp;
	}
}
?>