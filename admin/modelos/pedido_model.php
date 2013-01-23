<?php
include '../'.$_PETICION->modulo.'/modelos/pedido_producto_model.php';
class PedidoModel extends Modelo_PDO{
	var $tabla='pedidos';
	var $tablas=array('tmp_pedidos','pedidos');
	var $ids=array('IdTmp','id');
	var $indexTabla=0;
	function editar($id){
		$this->indexTabla=1;
		$pedido=$this->getPedido($id);
		// echo 'Pedido';
		// print_r($pedido);
		// $this->indexTabla=0;
		// $pedido = $this->guardar($pedido);
		// echo 'Tmp Pedido';
		// print_r($pedido);
		
		return $pedido;
	}
	function guardarArticulo($params){		
		$artMod= new PedidoProductoModel();
		$artMod->indexTabla = $this->indexTabla;
		return $artMod->guardar($params);
	}
	function nuevo(){
		$params=array(
			'id'=>0
		);
		
		$params=array();
		$params['id']=0;
		$params['almacen']=1;
		$params['fecha']=date('Y-m-d H:i:s');				
		
		//$fecha = DateTime::createFromFormat('d/m/Y', $strFecha);
		//$strFecha= $fecha->format('Y-m-d H:i:s');
		
		return $this->guardar( $params );				
	}
	function getArticulos($params){
		$artMod= new PedidoProductoModel();
		$artMod->indexTabla = $this->indexTabla;
		return $artMod->paginar($params);
	}
	
	function getPedido($idPedido){
		
		$id=$idPedido;
				
		$sql = 'SELECT ped.*,alm.nombre as nombreAlmacen FROM '.$this->tablas[$this->indexTabla].' ped
		LEFT JOIN almacenes alm ON alm.id = ped.fk_almacen
		WHERE ped.'.$this->ids[$this->indexTabla].'=:id';		
		
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
	
	function paginar($params){
		
		$start=empty($params['start'])? 0 : intval($params['start']);
		$pageSize=empty($params['pageSize'])? 9 : intval($params['pageSize']);
		$f1=empty($params['fechai'])? '1000-01-01' : $params['fechai'];
		$f2=empty($params['fechaf'])? '2040-01-01' : $params['fechaf'];
		
		$sql='select COUNT(ped.id) as total FROM pedidos ped where fecha between :f1 and :f2';
		
		$model=$this;
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$sth->bindValue(":f1",$f1,PDO::PARAM_STR);
		$sth->bindValue(":f2",$f2,PDO::PARAM_STR);
		$datos=$model->execute($sth);
		
		$total=$datos['datos'][0]['total'];
		
		$sql='select ped.*,DATE_FORMAT(fecha,"%d/%m/%Y %H:%i:%s" ) as fecha, alm.nombre as nombreAlmacen FROM pedidos ped
		LEFT JOIN almacenes alm ON alm.id = ped.fk_almacen 
		WHERE fecha between :f1 and :f2
		ORDER BY ped.fecha DESC LIMIT :start,:limit';		
		$con=$model->getConexion();
		$sth=$con->prepare($sql);
		$sth->bindValue(':start',$start, PDO::PARAM_INT);		
		$sth->bindValue(':limit',$pageSize, PDO::PARAM_INT);
		$sth->bindValue(":f1",$f1,PDO::PARAM_STR);
		$sth->bindValue(":f2",$f2,PDO::PARAM_STR);		
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
	//	echo $strFecha; exit;
		//$fecha = DateTime::createFromFormat('d/m/Y', $strFecha);
		//$strFecha= $fecha->format('Y-m-d H:i:s');
		if ( empty($id) ){
			//           CREAR
			$sql='INSERT INTO '.$this->tablas[$this->indexTabla].' SET fk_almacen=:fk_almacen , fecha= :fecha';
			$sth = $dbh->prepare($sql);							
			$sth->bindValue(":fk_almacen",$fk_almacen,PDO::PARAM_INT);
			$sth->bindValue(":fecha",$strFecha,PDO::PARAM_STR);
			$msg='Pedido Guardado';							
		}else{
			//	         ACTUALIZAR
			$sql='UPDATE '.$this->tablas[$this->indexTabla].' SET fk_almacen=:fk_almacen, fecha=:fecha WHERE id=:id';
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