<?php
require_once '../admin/modelos/reservacion_model.php';
class Reservaciones extends Controlador{
	function getModel(){		
		if ( !isset($this->modObj) ){						
			$this->modObj = new ReservacionModel();	
		}
		return $this->modObj;
	}	
	
	
	
	function paginar(){

		

		$mod=$this->getModel();
		
		$paging=$_GET['paging'];
		$pageSize=intval($paging['pageSize']);
		$start=intval($paging['pageIndex'])*$pageSize;
		
		$res=$mod->paginar($start,$pageSize);
		
		
		echo json_encode($res); exit;
	}
	
	
}
?>