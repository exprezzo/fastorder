var ListaVuelos=function(){
}
ListaVuelos.prototype.init=function(){
	$("#tabla_vuelos").wijgrid();		
	var me=this;
	$("#tabla_vuelos").wijgrid({ selectionChanged: function (e, args) { 					
		var item=args.addedCells.item(0);
		var row=item.row();
		var data=row.data;			
		me.selected=data;			
		console.log(me.selected);
	} });
	
	$('#btnContinuar').click(function(){
		var numVuelo=me.selected[1];
		var numPasajeros = $("#numPasajeros").val();
		//alert("Ha seleccionado el vuelo "+ numVuelo + " Ahora debe reservar para " + numPasajeros + " pasajeros");
		$("#registrar input[name='numPasajeros']").val(numPasajeros);
		$("#registrar input[name='numVuelo']").val(numVuelo);
		$("#registrar").submit();
		return false;
	});
}