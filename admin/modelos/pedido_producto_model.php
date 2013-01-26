<?php

class PedidoProductoModel extends Modelo_PDO{
	var $tablas=array('tmp_pedidos_productos','pedidos_productos');
	var $ids=array('IdTmp','id');
	var $indexTabla=0;
	function getTabla(){
		
	}
	function guardar($params){
		$dbh=$this->getConexion();
		
		$id			=empty($params[ $this->ids[$this->indexTabla] ] )? 0 : $params[ $this->ids[$this->indexTabla] ];
		$fk_pedido	=$params['fk_pedido'];
		$fk_articulo	=$params['fk_articulo'];
		$fk_um	=$params['fk_um'];
		$cantidad	=$params['cantidad'];
		
		if ( empty($id) ){
			//           CREAR			
			$sql='INSERT INTO '.$this->tablas[$this->indexTabla].' SET fk_articulo=:fk_articulo, fk_um= :fk_um, cantidad=:cantidad, fk_pedido=:fk_pedido';						
			$sth = $dbh->prepare($sql);
			$sth->bindValue(":fk_articulo", $fk_articulo, PDO::PARAM_INT);
			$sth->bindValue(":fk_um", $fk_um,PDO::PARAM_INT);
			$sth->bindValue(":cantidad", $cantidad,PDO::PARAM_INT);
			$sth->bindValue(":fk_pedido", $fk_pedido,PDO::PARAM_INT);			
			$msg='Pedido Guardado';							
		}else{
			//	         ACTUALIZAR
			$sql='UPDATE '.$this->tablas[$this->indexTabla].' SET fk_articulo=:fk_articulo, fk_um= :fk_um, cantidad=:cantidad WHERE '.$this->ids[$this->indexTabla].'=:id';			
			$sth = $dbh->prepare($sql);										
			$sth->bindValue(":fk_articulo", $fk_articulo, PDO::PARAM_INT);
			$sth->bindValue(":fk_um", $fk_um,PDO::PARAM_INT);			
			$sth->bindValue(":cantidad", $cantidad,PDO::PARAM_INT);
			$sth->bindValue(":id",$id,PDO::PARAM_INT);
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
			// if ( empty($id) ) $id=$dbh->lastInsertId();
			// $pedido=$this->getPedido($id);
		}
		
		return array(
			'success'=>$exito,
			'msg'=>$msg
			// 'datos'=>$pedido
		);		
		
		return $res;
	}
	
	
	function paginar($params){
		
		$start=$params['start'];
		$pageSize=$params['limit'];
		$fk_pedido=$params['fk_pedido'];
		
		//, $pageSize=9,$idPedido
		
		$sql='select COUNT(pedprod.id) as total FROM '.$this->tablas[$this->indexTabla].' pedprod
		LEFT JOIN productos prod ON pedprod.fk_articulo = prod.id
		LEFT JOIN um um ON um.id = pedprod.fk_um
		WHERE pedprod.fk_pedido=:fk_pedido';		
		
		$model=$this;
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$sth->bindValue(':fk_pedido',$fk_pedido, PDO::PARAM_INT);
		$datos=$model->execute($sth);
		
		$total=$datos['datos'][0]['total'];
		
		$sql = 'SELECT pedprod.*,prod.nombre as nombre,um.abrev as um FROM '.$this->tablas[$this->indexTabla].' pedprod
		LEFT JOIN productos prod ON pedprod.fk_articulo = prod.id
		LEFT JOIN um um ON um.id = pedprod.fk_um
		WHERE pedprod.fk_pedido=:fk_pedido limit :start,:limit';		
				
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		 $sth->bindValue(':start',intval($start), PDO::PARAM_INT);
		 $sth->bindValue(':limit',intval($pageSize), PDO::PARAM_INT);
		$sth->bindValue(':fk_pedido',$fk_pedido, PDO::PARAM_INT);
		$datos=$model->execute($sth);
		
		return array(
			'totalRows'=>$total,
			'rows'=>$datos['datos']
		);
	}
	
}
?>