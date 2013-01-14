Layout={
	init:function(){
		
		
		this.activarTabLinks();
		
		$(window).resize(function(){
			ajustarTab();
		});
	},
	ajustarTab:function(){
		
	},
	activarTabLinks(parentId){
		if (parentId==undefined)  parentId=='';
		
		var links=$(parentId+' [tablink="true"]');
		$.each(links, function(index, element) {
			var link=$(element);
			if ( !link.attr )  return false;
			var destino=link.attr('href');
			link.attr('href','#');
			
			link.attr('tablink',false);
			link.addClass('link');
			link.click(function(){
				TabManager.add(destino,'Cargando...');
			});
		});
	}
}