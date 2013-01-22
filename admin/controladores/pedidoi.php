<?php
require_once '../admin/modelos/pedido_model.php';
require_once '../admin/modelos/almacen_model.php';
require_once '../admin/modelos/articulo_model.php';
require_once '../admin/modelos/um_model.php';
class Pedidoi extends Controlador{
	function guardarArticulo(){
		$articulo=$_REQUEST['datos'];
		
		$mod=$this->getModel();
		$mod->indexTabla=1;
		$res = $mod->guardarArticulo($articulo);
		
		
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
		$mod=$this->getModel();
		$id=intval( $_REQUEST['id'] );
		
		$params=array();
		$params['fk_pedido']=$id;
		$params['start']=1;
		$params['limit']=900;
		$mod->indexTabla=1;
		$res=$mod->getArticulos($params);
		echo json_encode( $res );
		
		
		// $datos[]=array(
			// 'id'=>5,
			// 'nombre'=>'Papas5',
			// 'fk_articulo'=>5,
			// 'cantidad'=>24,
			// 'um'=>'Kg',
			// 'fk_um'=>21		
		// );
		
		// $res=array(
			// 'datos'=>$datos,
			// 'total'=>1
		// );
		// $respuesta=array(	
			// 'rows'=>$res['datos'],
			// 'totalRows'=> $res['total']
		// );
		// echo json_encode($respuesta);	
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
		 //$pedido['datos']['id'] = $pedido['datos']['IdTmp'];
		 //print_r($pedido);
		 $vista=$this->getVista();
		 $vista->pedido =$pedido['datos'];
		 $vista->mostrar('pedidoi/nuevo');
	}
	// function nuevo(){
		// $vista=$this->getVista();
		// $vista->mostrar('pedidoi/pedidoi');
	// }
	
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
		$model=$this->getModel();
		$res = $model->guardar($pedido);
		echo json_encode($res);
	}
}
?>