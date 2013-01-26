<?php
require_once '../admin/modelos/user_model.php';
class User extends Controlador{
	var $validarCaptcha=true;
	
	function logout(){		
		$model=$this->getModel();
		$model->logout();
		header ('Location: /index.php');
	}
			
	/*
		emailDisponible: Revisa si el email proporcionado estÃ¡ disponible para registrarse. (emailDisponible)		
		si el atributo $email es nulo, asumimos que se trata de una peticion ajax, asi que la respuesta sera un JSON
		si el atributo $email no es nulo, la funcion responde true, false.
	*/
	function emailDisponible( $email = null){
	
		if ( $email != null ){
			$imprimir=false;
		}else{
			$imprimir=true;
			$email=$_POST['email'];
		}
		
		$userMod=$this->getModel();		
		$user=$userMod->findByEmail($email);
		
		$unico=false;
		if ( empty($user) ){
			$unico=true;
		}
		
		$resp= array(
			'success'=>true,
			'data'=>array(
				'unico'=>$unico
			)
		);
		if ( $imprimir ){
			echo json_encode($resp);
		}else{
			return $imprimir;
		}		
	}
			
	/*
		login: inicia la sesion del usuario		
		Para el caso de redireccionaniemto desde el mismo sistema ¿Puedo saber desde que pagina llege hasta aqui?
	*/
		
	function login($username=null, $pass=null){				
		if (  isset($_SESSION['isLoged']) && $_SESSION['isLoged']===true ){			
			header('Location: /admin/general/index');					
		}
		
		if ($_SERVER['REQUEST_METHOD']!='POST'){
			return $this->mostrarVista();
		}
		
		//cuando la peticion es POST, llegamos aca				
		//Primero se revisan los datos recibidos				
		if ($username == null && $pass==null){
			$imprimir=true;
			$username = isset($_POST['username'])? $_POST['username'] : '';
			$pass = isset($_POST['pass'])? $_POST['pass'] : ''; 
		}else{
			$imprimir=false;
		}
		
		$errores=array();		
		if ( empty($username) ){
			$errores['username']='This field is required';
		}
		
		if ( empty($pass) ){
			$errores['pass']='This field is required';			
		}
		
		$params=array(
			'username'=>$username
		);
		
		if (!empty($errores) ){
			//Si hay erroores, devolver la misma pagina mostrando los errores de validaciÃ³n
			$vista= $this->getVista();
			global $_PETICION;
			$vista->errores=$errores;
			
			$vista->valores=$params;			
			return $vista->mostrar();
		}
		
		$mod=$this->getModel();
		$resp = $mod->login($username, $pass);
		
		if ($resp['success']==true){
			header('Location: /admin/general/index');			
			exit;
		}else{
			$vista = $this->getVista();
			global $_PETICION;
			$errores=array('pass'=>'Nombre de usuario y/o contrase&ntilde;a incorrecta');
			$vista->errores=$errores;
			$vista->valores=$params;
			return $vista->mostrar();
		}
	}			
	
	function getModel(){		
		if ( !isset($this->modObj) ){						
			$this->modObj = new UserModel();	
		}	
		return $this->modObj;
	}	
	function changepass(){
		if ( empty($_POST['old']) ){
			$errores['old']='This field is required';			
		}		
		$oldPass=$_POST['old'];
		
		if ( empty($_POST['nuevo']) || empty($_POST['retype']) ){
			$errores['new']='This fields are required';			
		}
		$new=$_POST['nuevo'];
		$retype=$_POST['retype'];
		
		if (!empty($errores)){		
			echo json_encode(array(
				'success'=>false,
				'errors'=>$errores
			));
			exit;
		}
		//comprueba que los pass coincidan
		if ( $new != $_POST['retype'] ){
			$errores['new']='Passwords did not match';
			echo json_encode(array(
				'success'=>false,
				'errors'=>$errores
			));
			exit;
		}
		
		//comprueba que la contraseña sea la misma que la de la base de datos
		$mod=$this->getModel();		
		$id=$_SESSION['userInfo']['id'];
		$pass=$oldPass;
		$comprobado=$mod->compruebaPass($id,$pass);
		if (!$comprobado['success'] ){
			$errores['old']=$comprobado['msg'];
			echo json_encode(array(
				'success'=>false,
				'errors'=>$errores
			));
			exit;
		}
		$pass=$new;
		$res=$mod->updatePass($id,$pass);
		if ($res['success']){
			echo json_encode(array(
					'success'=>true,
					'msg'=>'Password has been changed.'
			));
		}else{
			echo json_encode(array(
				'success'=>false,
				'msg'=>$res['msg']
			));
		
		}		
	}
	
	function forgot(){


		$vista = $this->getVista();

		if(isset($_GET['hash']) && isset($_GET['email'])) {
			$valores = array();
			$userMod = $this->getModel();
			$model = $userMod->findByEmail($_GET['email']);



			if ($_SERVER['REQUEST_METHOD']=='POST') {
				$userMod = $this->getModel();
				$user = $userMod->findByEmail($_GET['email']);

				$sql='UPDATE system_users SET
				pass=AES_ENCRYPT("'.$_POST['new_password'].'", '.PASS_AES.') WHERE id = '.$user['id'];

				$con = $userMod->getConexion();
				$sth = $con->prepare($sql);
				$res = $sth->execute();

				$valores['reset_succesfull'] = true;
				$valores['reset'] = true;
				$vista->valores = $valores;
				return $vista->mostrar();
			}

			if(empty($model)) {
				$valores['404'] = true;
				$vista->valores = $valores;
				return $vista->mostrar();
			} else {

				if(md5($model["request"]) != $_GET['hash']){
					$valores['404'] = true;
				$vista->valores = $valores;
					$vista->valores = $valores;
					return $vista->mostrar();
				} else {
					$valores['reset'] = true;
					$vista->valores = $valores;
					return $vista->mostrar();
				}

			}



		} else {

			if ($_SERVER['REQUEST_METHOD']=='POST') {
					if ( isset($this->validarCaptcha)  )
						if ($this->validarCaptcha){
							$privatekey = "6LeCftgSAAAAAI5vbS6R6YS3_bPMXzxexs3HJoh0";
							$resp = recaptcha_check_answer ($privatekey,
													$_SERVER["REMOTE_ADDR"],
													$_POST["recaptcha_challenge_field"],
													$_POST["recaptcha_response_field"]);
							if (!$resp->is_valid) {
								$res=array();
								global $user_w_msg;
								$res['captcha_error']=$user_w_msg['CAPTCHA_INCORRECTO']; //'The reCAPTCHA wasn\'t entered correctly. Go back and try it again.';			
								echo json_encode($res);exit;
							 }
							 
						}
						
					$data = $_POST;
					
					$userMod = $this->getModel();
					$user = $userMod->findByEmail($data['email']);
					if ( empty($user) ){
						$user = $userMod->findByNick($data['email']);
					}
					$result = array();

					if(empty($user)){
						$result['error'] = "Sorry, we can't found the user with the email " . $data['email'] .", please check and try again";
					} else {



						$requested_time = time();

						$sql='UPDATE system_users SET
								request=:request WHERE id = '.$user['id'];

						$update_user = $this->getModel();
						$con = $update_user->getConexion();
						$sth = $con->prepare($sql);
						$sth->bindValue(':request', $requested_time, PDO::PARAM_STR);
						$res = $sth->execute();

						$url_hashed = "http://".$_SERVER['SERVER_NAME']."/reset.php?hash=".md5($requested_time)."&email=".$user["email"];
						ob_start();						
						/*$message = <<<MSG
								Hi {$user["name"]},<br /><br />

								You recently asked to reset your Memez password.<br /><br />

								<a href="{$url_hashed}">Click here to change your password.</a><br /><br />

								Didn't request this change?<br />
								If you didn't request a new password, let us know immediately.
MSG;
						*/
						require_once '../mvc/vistas/auth/email.php';
						$message = ob_get_contents();
						 ob_end_clean();
						$to = $user["email"];
						$from = "noreply@memez.com";
						$subject = 'You requested a new Memez password? ';

						$headers  = "From: $from\r\n";
						$headers .= "Content-type: text/html\r\n";
						$headers .= "MIME-Version: 1.0\r\n";
						$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
						$x = mail($to, $subject, $message, $headers);

						$result['success'] = "Ok, We sent a email to your email account with a link to reset your password";
					}

					echo json_encode($result);
			} else {

				return $vista->mostrar();
			}

		}
	}		
	
}
?>