<?php

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
	<script type="text/javascript" src="/js/libs/jquery.scrolling-parallax.js"></script>
	
	<script type="text/javascript">		
		$(function () {			
			
			 $('.div1').scrollingParallax({ 
				staticSpeed : 2
			});
			$('.div2').scrollingParallax({ 
				staticSpeed : 3
			});
			$('.div3').scrollingParallax({ 
				staticSpeed : 5
			});
			 
			
			$.plax.enable()
		});
		
	</script>
	<style type="text/css">
		.body{
			background-image:url('/images/bg.png');
			background-position:right top;
		}
		
		.contenedor{
			position:relative;
			height:700px;;
		}
		
		
		.div1{
			background-color:black;
			width:400px;
			height:200px;
			opacity:.8;
			border-radius:8px;
			position:absolute;
			left:50%;
			margin-left:-200px;
			top:250px;
		}
		.div2{
			background-color:green;
			width:400px;
			height:200px;
			opacity:.8;
			border-radius:8px;
			position:absolute;
			left:55%;
			margin-left:-200px;
			
			top:300px;
		}
		
		.div3{
			background-color:blue;
			width:400px;
			height:200px;
			opacity:.8;
			border-radius:8px;
			position:absolute;
			left:59%;
			margin-left:-200px;
			top:400px;
		}
	</style>
	
</head>
<body style="padding:0; margin:0;" class="body" bgproperties="fixed">	
	
	
	 <div class="contenedor">
		<div class="div1"></div>
		<div class="div2"></div>
		<div class="div3"></div>
	 </div>
</body>
</html>

