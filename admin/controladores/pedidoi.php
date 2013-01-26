<?php
require_once '../admin/modelos/pedido_model.php';
require_once '../admin/modelos/almacen_model.php';
require_once '../admin/modelos/articulo_model.php';
require_once '../admin/modelos/um_model.php';
class Pedidoi extends Controlador{
	function eliminar(){
		$modObj= $this->getModel();
		$params=array();
		
		if ( !isset($_POST['id']) ){
			$id=$_POST['datos'];
		}else{
			$id=$_POST['id'];
		}
		$params['id']=$id;
		
		$res=$modObj->borrar($params);
		
		
		echo json_encode($res);
		exit;
		//return $respuesta;
	}
	function guardarArticulo(){
		$datos=$_REQUEST['datos'];				
		$mod=new PedidoProductoTmpModel();		
		$res = $mod->guardar($datos);		
		echo json_encode($res);
	}
	function getModel(){		
		if ( !isset($this->modObj) ){						
			$this->modObj = new PedidoModel();	
		}	
		return $this->modObj;
	}
	
	
	function verPedido(){		
		$idPedido=empty($_REQUEST['id'])? 0 : $_REQUEST['id'];		
		$pedido=$this->getPedido($idPedido);		
	}
	function getListaArticulos(){
		$mod=new PedidoProductoTmpModel();
		$fk_tmp=$_REQUEST['fk_tmp'];
		$paging=$_REQUEST['paging'];
		$params=array(	//Se traducen al lenguaje sql
			'limit'=>$pageSize=intval($paging['pageSize']),
			'start'=>intval($paging['pageIndex'])*$pageSize
		);
		$params['fk_tmp']=$fk_tmp;		
		$mod->indexTabla=1;
		$res=$mod->paginar($params);
		echo json_encode( $res );				
	}	
	function getArticulos(){
		$mod=new ArticuloModel();		
		// $paging=$_GET['paging'];
		// $start=intval($paging['pageIndex'])*9;		
		$start=0;		
		$res=$mod->paginar($start,90);				
		
		$respuesta=array(	
			'rows'=>$res['datos'],
			'totalRows'=> $res['total']
		);
		echo json_encode($respuesta);	
	}
	function getUnidadesMedida(){
		$mod=new UMModel();		
		// $paging=$_GET['paging'];
		// $start=intval($paging['pageIndex'])*9;		
		$start=0;		
		$res=$mod->paginar($start,90);				
		
		$respuesta=array(	
			'rows'=>$res['datos'],
			'totalRows'=> $res['total']
		);
		echo json_encode($respuesta);	
	}
	function nuevo(){
		 $mod=$this->getModel();
		 $mod->indexTabla=1;
		 $pedido=$mod->nuevo();
		 
		 $vista=$this->getVista();
		 $vista->pedido =$pedido['datos'];
		 $vista->mostrar('pedidoi/nuevo');
	}	
	
	function getPedido($id = null){
		if ($id==null){
			$idPedido=$_REQUEST['pedidoId'];
			$mostrar=true;
		}else{
			$idPedido=$id;
			$mostrar=false;
		}
		$mod=$this->getModel();
		
		$pedido = $mod->editar( $idPedido );
		
		$vista=$this->getVista();
		$vista->pedido=$pedido;
		if ($mostrar==true){
			$vista->mostrar('pedidoi/nuevo');
		}else{
			return $vista;
		}
	}
	
	function verPedidos(){
		$mod=$this->getModel();
		$res=$mod->paginar(array());
		
		$vista=$this->getVista();
		$vista->pedidos=$res['datos'];
		$vista->total=$res['total'];
		
		$vista->mostrar('pedidoi/lista_de_pedidos');
	}
	function pedidos(){
		return $this->lista_de_pedidos();
	}
	function lista_de_pedidos(){
		return $this->verPedidos();		
	}
	
	function paginar(){
		$mod=$this->getModel();
		
		$fechai=DateTime::createFromFormat ( 'd/m/Y' ,$_GET['fechai']);
		$fechaf=DateTime::createFromFormat ( 'd/m/Y' ,$_GET['fechaf']);
		//print_r($fechai);
		
		$paging=$_GET['paging']; //Datos de paginacion enviados por el componente js
		$params=array(	//Se traducen al lenguaje sql
			'pageSize'=>$pageSize=intval($paging['pageSize']),
			'start'=>intval($paging['pageIndex'])*$pageSize,
			'fechai'=>$fechai->format('Y-m-d').' 00:00:00',
			'fechaf'=>$fechaf->format('Y-m-d').' 23:59:59'
		);
		
		$res=$mod->paginar($params);				
				
		$respuesta=array(	
			'rows'=>$res['datos'],			
			'totalRows'=> $res['total']			
		);
		echo json_encode($respuesta);
	}
	
	function getAlmacenes(){
	
	
		$mod=new AlmacenModel();		
		// $paging=$_GET['paging'];
		// $start=intval($paging['pageIndex'])*9;		
		$start=0;		
		$res=$mod->paginar($start,9);				
		
		$respuesta=array(	
			'rows'=>$res['datos'],
			'totalRows'=> $res['total']
		);
		echo json_encode($respuesta);		
	}
	function guardar(){
		$pedido= $_POST['pedido'];
		
		if ( empty($_POST['pedido']) ){
			$res=array(
				'success'=>false,
				'msg'=>'No se recibieron datos para almacenar'
			);
			echo json_encode($res); exit;
		}
		if ( empty($_POST['pedido']['almacen']) ){
			$res=array(
				'success'=>false,
				'msg'=>'Debe seleccionar un almac&eacute;n de origen'
			);
			echo json_encode($res); exit;
		}
		
		$fecha = DateTime::createFromFormat('d/m/Y', $pedido['fecha']);
		$pedido['fecha']= $fecha->format('Y-m-d H:i:s');
		
		$model=$this->getModel();		
		$res = $model->guardar($pedido);
		$pk=$res['datos']['id'];
		
		$pedido=$model->editar($pk);
		$res['datos']=$pedido;
		echo json_encode($res);
	}
	function cerrar(){
		$fk_tmp	=$_POST['id'];
		$mod	=$this->getModel();
		return $mod->cerrar($fk_tmp);
	}
}
?>