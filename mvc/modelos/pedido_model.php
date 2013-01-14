<?php
class PedidoModel extends Modelo_PDO{
	var $tabla='pedidos';
	function getArticulos($idPedido){
		$id=$idPedido;
				
		$sql = 'SELECT pedprod.*,prod.nombre as nombreProducto FROM pedidos_productos pedprod
		LEFT JOIN productos prod ON pedprod.fk_producto = prod.id
		WHERE pedprod.fk_pedido=:id';		
		
		$con = $this->getConexion();
		$sth = $con->prepare($sql);		
		$sth->bindValue(':id',$id);		
		$sth->execute();
		$modelos = $sth->fetchAll(PDO::FETCH_ASSOC);
		
		if ( empty($modelos) ){
			//throw new Exception(); //TODO: agregar numero de error, crear una exception MiEscepcion
			return array();
		}
		
		
		return $modelos;	
	}
	
	function getPedido($idPedido){
		
		$id=$idPedido;
				
		$sql = 'SELECT ped.*,alm.nombre as nombreAlmacen FROM pedidos ped
		LEFT JOIN almacenes alm ON alm.id = ped.fk_almacen
		WHERE ped.id=:id';		
		
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
		$articulos=$this->getArticulos( $id );
		$modelos[0]['articulos']=$articulos;
		return $modelos[0];	
	}
	
	function paginar($start=0, $pageSize=9){
		$sql='select COUNT(ped.id) as total FROM pedidos ped';
		$model=$this;
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$datos=$model->execute($sth);
		
		$total=$datos['datos'][0]['total'];
		
		$sql='select ped.*,DATE_FORMAT(fecha,"%d/%m/%Y %H:%i:%s" ) as fecha, alm.nombre as nombreAlmacen FROM pedidos ped
		LEFT JOIN almacenes alm ON alm.id = ped.fk_almacen ORDER BY ped.fecha DESC LIMIT :start,:limit';		
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$sth->bindValue(':start',$start, PDO::PARAM_INT);		
		$sth->bindValue(':limit',$pageSize, PDO::PARAM_INT);		
		$datos=$model->execute($sth);
		
		return array(
			'total'=>$total,
			'datos'=>$datos['datos']
		);
	}
	function guardar($params){
		$dbh=$this->getConexion();
		
		$id			=$params['id'];
		$fk_almacen	=$params['almacen'];
		$strFecha	=$params['fecha'];
		$fecha = DateTime::createFromFormat('d/m/Y', $strFecha);
		$strFecha= $fecha->format('Y-m-d H:i:s');
		if ( empty($id) ){
			//           CREAR
			$sql='INSERT INTO '.$this->tabla.' SET fk_almacen=:fk_almacen , fecha= :fecha';
			$sth = $dbh->prepare($sql);							
			$sth->bindValue(":fk_almacen",$fk_almacen,PDO::PARAM_INT);
			$sth->bindValue(":fecha",$strFecha,PDO::PARAM_STR);
			$msg='Pedido Guardado';							
		}else{
			//	         ACTUALIZAR
			$sql='UPDATE '.$this->tabla.' SET fk_almacen=:fk_almacen, fecha=:fecha WHERE id=:id';
			$sth = $dbh->prepare($sql);							
			$sth->bindValue(":id",$id,PDO::PARAM_INT);			
			$sth->bindValue(":fk_almacen",$fk_almacen,PDO::PARAM_INT);
			$sth->bindValue(":fecha",$strFecha,PDO::PARAM_STR);			
			$msg='Pedido Actualizado';		
		}
			
		$exito = $sth->execute();
		
		
		
		if (!$exito){
			//Logger->logear   		PENDIENTE: LOGEAR
			$resp['success']=false;
			$error=$sth->errorInfo();
			$msg    = $error[2];
			$pedido=$params;
		}else{
			if ( empty($id) ) $id=$dbh->lastInsertId();
			$pedido=$this->getPedido($id);
		}
		
		return array(
			'success'=>$exito,
			'msg'=>$msg,
			'datos'=>$pedido
		);
		
	}
}
?>