<?php
require_once '../mvc_core/i_crud.php';


class Modelo_PDO implements ICrud{								
	
	function getConexion(){		
		global $DB_CONFIG;
		

		if ( !isset($this->db) ){
			try {
				$db = @new PDO('mysql:host='.$DB_CONFIG['DB_SERVER'].';dbname='.$DB_CONFIG{'DB_NAME'}.';charset=UTF8', $DB_CONFIG['DB_USER'], $DB_CONFIG['DB_PASS'],array(
					PDO::ATTR_PERSISTENT => true
				));				
				$this->db=$db;
			} catch (PDOException $e) {
				//print "Error!: " . $e->getMessage() . "<br/>";
				$resp=array(
					'success'=>false,
					'msg'=>"Error al conectarse con la base de datos"
				);
				throw new Exception("Error al conectarse con la base de datos");
			}
		}
		return $this->db;
	}
/*	===============================================================================
		ICrud
	=============================================================================== */	
	var $tabla='modelo_test';
	
	public function contar($filtros=''){
		if (!empty ($filtros) ){
		$filtros=' WHERE '.$filtros;
		}
				
		$sql = 'SELECT COUNT(id ) as total FROM '.$this->tabla.$filtros;		
		
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);				
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			throw new Exception('La informacion buscada no fue encontrada. <br>Consulta:'.$sql.' '.$id); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El identificador está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0]['total'];			
	}
	
	public function ejecutar($sql){
		$con = $this->getConexion();
		$sth = $con->prepare($sql);						
		return $this->execute($sth);		
	}
	function execute($sth){
		$exito = $sth->execute();
		// Manejar error				
		if ($exito!==true){
			$error=$sth->errorInfo();
			$resp=array(
				'success'=>false,
				'msg'=>$error[2]
			);
			return $resp; 
		}
		$res = $sth->fetchAll(PDO::FETCH_ASSOC);
		return array(
			'success'=>true,			
			'datos' =>$res
		);	
	}
	function obtener($params){
		
		$id=$params['id'];
				
		$sql = 'SELECT * FROM '.$this->tabla.' WHERE id=:id';		
		
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id);		
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			//throw new Exception(); //TODO: agregar numero de error, crear una exception MiEscepcion
			return array();
		}
		
		if ( sizeof($modelos) > 1 ){
			throw new Exception("El identificador está duplicado"); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
		
		return $modelos[0];			
	}
	
	function guardar( $params ){
		$dbh=$this->getConexion();
		
		$id=$params['id'];
		$nombre=$params['nombre'];
		
		if ( empty($id) ){
			//           CREAR
			$sql='INSERT INTO '.$this->tabla.' SET nombre= :nombre , fecha_de_creacion= now()';
			$sth = $dbh->prepare($sql);							
			$sth->bindValue(":nombre",$nombre,PDO::PARAM_STR);					
		}else{
			//	         ACTUALIZAR
			$sql='UPDATE '.$this->tabla.' SET nombre= :nombre WHERE i
			d= :id, fecha_de_actualizacion=now()';
			$sth = $dbh->prepare($sql);							
			$sth->bindValue(":id",$id,PDO::PARAM_INT);			
			$sth->bindValue(":nombre",$nombre,PDO::PARAM_STR);
		}
			
		$exito = $sth->execute();
		
		if (!$exito){
			//Logger->logear   		PENDIENTE: LOGEAR
		}
		
		return $exito;
	}	
		
	function borrar( $params ){
		if ( empty($params['id']) ){
			throw new Exeption("Es necesario el parámetro 'id'");
		};		
		$id=$params['id'];
		$sql = 'DELETE FROM '.$this->tabla.' WHERE id=:id';		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id,PDO::PARAM_INT);
		
		$exito = $sth->execute();					
		
		return $exito;	
	}
	
	function paginar($params){
		$con = $this->getConexion();
		
		$sql = 'SELECT COUNT(*) as total FROM '.$this->tabla;
		$sth = $con->query($sql); // Simple, but has several drawbacks		
		$tot = $sth->fetchAll(PDO::FETCH_ASSOC);
		$total = $tot[0]['total'];
		
		$limit=$params['limit'];
		$start=$params['start'];		
		$sql = 'SELECT * FROM '.$this->tabla.' limit 0,:limit';
		
		$sth = $con->prepare($sql);
		$sth->bindValue(':limit',$limit,PDO::PARAM_INT);
		//$sth->bindValue(':start',$start,PDO::PARAM_STR);
		$exito = $sth->execute();

		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);				
		if ( !$exito ){
			throw new Exception("Error listando: ".$sql); //TODO: agregar numero de error, crear una exception MiEscepcion
		}
							
		return array(
			'success'=>true,
			'total'=>$total,
			'datos'=>$modelos
		);
	}
	
	function crearFiltrosOr($texto, $campos){
		$texto=trim($texto);
		if ($texto=='') return '';
		$pieces = explode(" ", $texto);
		$or='';
		foreach($pieces as $palabra){
			foreach($campos as $campo){
				$or.=' OR '.$campo.' like "%'.$palabra.'%"';
			}
		}
		$or = substr($or, 4);
		return $or;
	}
/*  ===============================================================================
		fin de ICrud
	=============================================================================== */
		
}
?>