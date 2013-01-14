<?php
if ( !isset($_SESSION['isLoged'])|| $_SESSION['isLoged']!=true ){
	header ('Location: /admin/user/login'); exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="us">
<head>
	<meta charset="utf-8">
	<title><?php echo NOMBRE_APL; ?></title>
	<!--jQuery References-->
	<!--link href="/js/jquery-ui-1.9.2.custom/css/flick/jquery-ui-1.9.2.custom.css" rel="stylesheet"-->	
	<script src="/js/libs/jquery-1.8.3.js"></script>
	<script src="/js/libs/jquery-ui-1.9.2.custom/jquery-ui-1.9.2.custom.js"></script>  
	<!--Theme-->
	<!--link href="http://cdn.wijmo.com/themes/rocket/jquery-wijmo.css" rel="stylesheet" type="text/css"  /-->
	<link href="/css/themes/<?php echo TEMA; ?>/jquery-wijmo.css" rel="stylesheet" type="text/css" title="rocket-jqueryui" />
	<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/blitzer/jquery-ui.css" rel="stylesheet" type="text/css" title="rocket-jqueryui" />
	
	<link href="/css/mods/rocket/mods.css" rel="stylesheet" type="text/css" />		
	<!--link href="/css/themes/cobalt/jquery-wijmo.css" rel="stylesheet" type="text/css" title="rocket-jqueryui" /-->		
	
	<!--Wijmo Widgets CSS-->	
	<link href="/js/libs/Wijmo.2.3.2/Wijmo-Complete/css/jquery.wijmo-complete.2.3.2.css" rel="stylesheet" type="text/css" />
	<link href="/js/libs/Wijmo.2.3.2/Wijmo-Open/css/jquery.wijmo-open.2.3.2.css" rel="stylesheet" type="text/css" />			
	<!--link href="/css/themes/blitzer/jquery-ui-1.9.2.custom.css" rel="stylesheet"-->	
	<!--Wijmo Widgets JavaScript-->
	<script src="/js/libs/Wijmo.2.3.2/Wijmo-Complete/js/jquery.wijmo-complete.all.2.3.2.min.js" type="text/javascript"></script>
	<script src="/js/libs/Wijmo.2.3.2/Wijmo-Open/js/jquery.wijmo-open.all.2.3.2.min.js" type="text/javascript"></script>		
	<!-- Gritter -->
	<link href="/js/libs/Gritter-master/css/jquery.gritter.css" rel="stylesheet" type="text/css" />
	<script src="/js/libs/Gritter-master/js/jquery.gritter.min.js" type="text/javascript"></script>
	
	<link href="/css/admin/estilos_wijmo.css" rel="stylesheet" type="text/css" />
	<script src="/js/admin/funciones.js" type="text/javascript"></script>
	<script src="/js/admin/TabManager.js" type="text/javascript"></script>
	
	<script type="text/javascript">		
		$(function () {			
			$.extend($.gritter.options, { 
				position: 'bottom-right', // defaults to 'top-right' but can be 'bottom-left', 'bottom-right', 'top-left', 'top-right' 
				fade_in_speed: 'medium', // how fast notifications fade in (string or int)
				fade_out_speed: 2000, // how fast the notices fade out
				time: 6000 // hang on the screen for...
			});
			
			TabManager.init('#tabs');
			
			ajustarTab(); //Ajusta la altura al tamaño en relacion al tamaño de la pantalla
			iniciarLinkTabs(); //A los objetos con atributo linkTab=true,  se les agrega comportamiento ajax para abrir tabs.
			
			//TabManager.add('/welcome');
			TabManager.add('/admin/general/welcome');

			$(window).resize(function() {
			  ajustarTab();
			});
			
			$('.user_widget a').mouseenter(function(){
				$(this).addClass('ui-state-hover');
			});			
			$('.user_widget a').mouseleave(function(){
				$(this).removeClass('ui-state-hover');
			});
			
			$('.header').mouseenter(function(){
				$(this).addClass('ui-state-hover');
			});			
			$('.header').mouseleave(function(){
				$(this).removeClass('ui-state-hover');
			});
			
			
			$("#splitter").wijsplitter({ orientation: "horizontal" });
			
			 $(".accesos_directos").wijcarousel({
                display: 12,
                step: 4,
                orientation: "horizontal"
            });
			
		});
		
	</script>
	<style type="text/css">
		
		@media only screen and (max-width: 999px) {	  } /* rules that only apply for canvases narrower than 1000px */
		@media only screen and (device-width: 768px) and (orientation: landscape) {} /* rules for iPad in landscape orientation */
		@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {}/* iPhone, Android rules here */		
		.link{
			cursor:pointer;
		}
		.ui-tabs .ui-tabs-nav{
			/* border-bottom:0; */
		}
		.ui-tabs .ui-tabs-hide {
			display: none !important;
		}
		
		
		
		.main_header{
			display: inline-block;
			width: 100%;
			border: 0;
		}
	</style>
	
</head>
<body style="padding:0; margin:0;">	
	<div id="splitter">
		<div class="main_header">
			<div style="padding:0px 0 0px 0px; float:left;">
				
				<div class="header ui-state-default" style="text-align:center;padding-left: 13px;
padding-right: 15px;
margin-left: -4px;
border-bottom-right-radius: 10px;"><a href="/index"><h2 style="margin:8px;"><?php echo NOMBRE_APL; ?><a></h2></div>			
			</div>	
					
			<div class="user_widget" >
				<a class ="left ui-state-default" href="/admin/user/perfil" tablink="true">Perfil</a>
				<a class ="right ui-state-default" href="/admin/user/logout" tablink="false">Salir</a>
			</div>						
			
			<div class="accesos_directos">				
				<ul>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/card-id.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/productos/listar" tablink="true" width="60px" src="/images/supermono/tag.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					<li>						
						<img href="/admin/pedidoi/lista_de_pedidos" tablink="true" width="60px" src="/images/supermono/paste.png" /><label style='padding-left:10px;'>Productos</label></img>
					</li>
					
				</ul>
			</div>
		</div>
		<div id="tabs">
			 <ul>			
			</ul>		
		</div>	
	</div>
	
	

	 
</body>
</html>

