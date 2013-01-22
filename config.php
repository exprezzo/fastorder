<?php
//$APP_URL='http://'.$_SERVER['SERVER_NAME']; 

$DB_CONFIG=array(
	'DB_SERVER'	=>'localhost',
	'DB_NAME'	=>'fastt',
	'DB_USER'	=>'root',
	'DB_PASS'	=>''
);

// Configuracion del ssitio
define ("NOMBRE_APL",'LA MONA');
define ("PASS_AES",'faztA3s');

define ("TEMA",'rocket');

$_TEMAS=array();

$_TEMAS['artic']="http://cdn.wijmo.com/themes/arctic/jquery-wijmo.css";
$_TEMAS['midnight']="http://cdn.wijmo.com/themes/midnight/jquery-wijmo.css";
$_TEMAS['aristo']="http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css";
$_TEMAS['rocket']="http://cdn.wijmo.com/themes/rocket/jquery-wijmo.css";
$_TEMAS['cobalt']="http://cdn.wijmo.com/themes/cobalt/jquery-wijmo.css";
$_TEMAS['sterling']="http://cdn.wijmo.com/themes/sterling/jquery-wijmo.css";
$_TEMAS['blacktie']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/black-tie/jquery-ui.css";
$_TEMAS['blitzer']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/blitzer/jquery-ui.css";
$_TEMAS['cupertino']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/cupertino/jquery-ui.css";
$_TEMAS['dark-hive']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/dark-hive/jquery-ui.css";
$_TEMAS['dot-luv']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/dot-luv/jquery-ui.css";
$_TEMAS['eggplant']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/eggplant/jquery-ui.css";
$_TEMAS['excite-bike']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/excite-bike/jquery-ui.css";
$_TEMAS['flick']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/flick/jquery-ui.css";
$_TEMAS['hot-sneaks']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/hot-sneaks/jquery-ui.css";
$_TEMAS['humanity']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/humanity/jquery-ui.css";
$_TEMAS['le-frog']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/le-frog/jquery-ui.css";
$_TEMAS['mint-choc']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/mint-choc/jquery-ui.css";
$_TEMAS['vader']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/vader/jquery-ui.css";
$_TEMAS['ui-lightness']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/ui-lightness/jquery-ui.css";
$_TEMAS['ui-darkness']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/ui-darkness/jquery-ui.css";
$_TEMAS['trontastic']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/trontastic/jquery-ui.css";
$_TEMAS['swanky-purse']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/swanky-purse/jquery-ui.css";
$_TEMAS['sunny']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/sunny/jquery-ui.css";
$_TEMAS['start']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/start/jquery-ui.css";
$_TEMAS['south-street']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/south-street/jquery-ui.css";
$_TEMAS['smoothness']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/smoothness/jquery-ui.css";
$_TEMAS['redmond']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/redmond/jquery-ui.css";
$_TEMAS['pepper-grinder']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/pepper-grinder/jquery-ui.css";
$_TEMAS['overcast']="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/overcast/jquery-ui.css";

/*
Temas disponibles:   (la intencion es agregar todos los temas de jqureyui y de wijmo, pero no queremos ser dependientes de sus servicios web)

flick

ui-lightness

*/


define ("PATH_MVC",'../mvc/');
define ("DEFAULT_CONTROLLER",'general');
// CONFIGURA LA RUTA DEL NUCLEO
define ("PATH_NUCLEO",'../mvc_core/');
?>