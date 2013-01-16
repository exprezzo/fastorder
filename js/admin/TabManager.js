var tab_counter = 1; 
var TabManager={
	init:function(target){
		$tabs = $(target).wijtabs({
		   tabTemplate: '<li><a  href="#{href}">#{label}</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>'
		});
		this.tabs=$tabs;
		// addTab button: opens the Add tab dialog box		
		$('#tabs span.ui-icon-close').live('click', function () {
			var index = $('li', $tabs).index($(this).parent());
			$tabs.wijtabs('remove', index);
		});
		
		
		this.refresLayout();
	},
	refresLayout:function(){
		
		$('#tabs').height(screen.height);
	},
	add:function(url,titulo,id){
		id = id || 0;
		var tabId = 'tabs-' + tab_counter;
		
		var objId = url+'?id='+id;
		objId = objId.toLowerCase();
		if ( this.seleccionarTab(objId) == true)
			return true;
		tab_counter++;
		
		$tabs.wijtabs('add','#'+ tabId, 'Nuevo Tab');	//Los agrego antes de la peticion ajax.
		$('#'+ tabId ).attr('objId',objId);	
		
		$.ajax({
			type: "POST",
			url: url,
			data: { tabId:tabId, pedidoId:id }
		}).done(function( response ) {			
			$('#'+ tabId ).html(response);				
			$tabs.wijtabs('select',tabId);			
		});
	},
	seleccionarTab:function(objId){
		var tabListaPedidos = $('#tabs > div[objId="'+objId+'"]'); //role="tabPanel",
		if (tabListaPedidos.length == 0){
			return false;
		}else if (tabListaPedidos.length > 0){ //Seleccionar el tab											
			var tabs = $('#tabs > div[role="tabpanel"]');
			$.each(tabs, function(index, element) {
				var jElement = $(element);
				//si el elemento tiene el atributo  [objId]==objId, seleccionar
				if ( jElement.attr ){
					if ( jElement.attr('objId')==objId ){
						//Ocultar el panel anterior
						var jAnt = $('#tabs > div[aria-hidden="false"]');
						if ( jAnt.attr('objId')==objId) {							
							//Si el tab es el mismo no hacer nada
							return true;
						}
						
						
						jAnt.addClass('ui-tabs-hide');
						jElement.attr('aria-hidden',true);
						//Desmarcar el tab anterior
						var linkAnt = $('#tabs > ul li[aria-selected="true"]');		
						linkAnt.attr('aria-selected',false);
						linkAnt.removeClass('ui-tabs-selected');
						linkAnt.removeClass('ui-state-active');						 
						
						//Marcar el nuevo tab
						var selector='#tabs > ul a[href="#'+jElement.attr('id')+'"]';						
						var activeTab = $(selector).parent();
						activeTab.attr('aria-selected',true);
						activeTab.addClass('ui-tabs-selected');
						activeTab.addClass('ui-state-active');						 					
						//Selecciona el nuevo
						jElement.addClass('ui-tabs-selected');
						jElement.removeClass('ui-tabs-hide');
						jElement.attr('aria-hidden',false);
						
						return true;
					}
				}				
			});	
			return true;
		}
	}
};