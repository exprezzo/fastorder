<?php

class PedidoProductoTmpModel extends Modelo_PDO{
	var $tabla='tmp_pedidos_productos';	
	var $pk='id_tmp';
	
	function guardar($params){
		$dbh=$this->getConexion();		
		
		$pk			=empty($params[ $this->pk ] )? 0 : $params[ $this->pk ];
				
		$id	=$params['id'];
		$fk_pedido	=$params['fk_pedido'];
		$fk_tmp	=$params['fk_tmp'];
		$fk_articulo	=$params['fk_articulo'];
		$fk_um	=$params['fk_um'];
		$cantidad	=$params['cantidad'];
		
		if ( empty($pk) ){
			//           CREAR			
			$sql='INSERT INTO '.$this->tabla.' SET fk_articulo=:fk_articulo, fk_um= :fk_um, cantidad=:cantidad, fk_pedido=:fk_pedido, id=:id,fk_tmp=:fk_tmp';						
			$sth = $dbh->prepare($sql);
			$sth->bindValue(":fk_articulo", $fk_articulo, PDO::PARAM_INT);
			$sth->bindValue(":fk_um", $fk_um,PDO::PARAM_INT);
			$sth->bindValue(":cantidad", $cantidad,PDO::PARAM_INT);
			$sth->bindValue(":fk_pedido", $fk_pedido,PDO::PARAM_INT);			
			$sth->bindValue(":fk_tmp", $fk_tmp,PDO::PARAM_STR);						
			$sth->bindValue(":id", $id, PDO::PARAM_INT);
			$msg='registro Creado';							
		}else{
			//	         ACTUALIZAR
			$sql='UPDATE '.$this->tabla.' SET fk_articulo=:fk_articulo, fk_um= :fk_um, cantidad=:cantidad,fk_tmp=:fk_tmp WHERE '.$this->pk.'=:pk';			
			$sth = $dbh->prepare($sql);										
			$sth->bindValue(":fk_articulo", $fk_articulo, PDO::PARAM_INT);
			$sth->bindValue(":fk_um", $fk_um,PDO::PARAM_INT);			
			$sth->bindValue(":cantidad", $cantidad,PDO::PARAM_INT);
			$sth->bindValue(":pk",$pk,PDO::PARAM_INT);
			$sth->bindValue(":fk_tmp", $fk_tmp,PDO::PARAM_STR);			
			$msg='registro Actualizado';		
		}
			
		$exito = $sth->execute();
		
		if (!$exito){			
			$resp['success']=false;
			$error=$sth->errorInfo();
			$msg    = $error[2];
			$elemeno=$params;
		}else{
			if ( empty($pk) ) $pk=$dbh->lastInsertId();
			$elemeno=$this->obtener($pk);
		}
		
		return array(
			'success'=>$exito,
			'msg'=>$msg,
			'datos'=>$elemeno
		);		
		
		return $res;
	}
	
	
	
	function paginar($params){
		
		$start=$params['start'];
		$pageSize=$params['limit'];
		$fk_tmp=$params['fk_tmp'];
		
		//, $pageSize=9,$idPedido
		
		$sql='select COUNT(pedprod.id) as total FROM '.$this->tabla.' pedprod
		LEFT JOIN productos prod ON pedprod.fk_articulo = prod.id
		LEFT JOIN um um ON um.id = pedprod.fk_um
		WHERE pedprod.fk_tmp=:fk_tmp';		
		
		$model=$this;
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$sth->bindValue(':fk_tmp',$fk_tmp, PDO::PARAM_INT);
		$datos=$model->execute($sth);
		
		if (!$datos['success']) return $datos;
		
		$total=$datos['datos'][0]['total'];
		
		$sql = 'SELECT pedprod.*,prod.nombre as nombre,um.abrev as um FROM '.$this->tabla.' pedprod
		LEFT JOIN productos prod ON pedprod.fk_articulo = prod.id
		LEFT JOIN um um ON um.id = pedprod.fk_um
		WHERE pedprod.fk_tmp=:fk_tmp limit :start,:limit';		
				
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		 $sth->bindValue(':start',intval($start), PDO::PARAM_INT);
		 $sth->bindValue(':limit',intval($pageSize), PDO::PARAM_INT);
		$sth->bindValue(':fk_tmp',$fk_tmp, PDO::PARAM_INT);
		$datos=$model->execute($sth);
		
		if (!$datos['success']) return $datos;
		
		return array(
			'totalRows'=>$total,
			'rows'=>$datos['datos']
		);
	}
	
}
?>