<script>
	$(function(){
		var source=new EventSource("/demo_sse.php");
			source.onmessage=function(event)
			  {
				
					$("#tabs .chatTab").append('<br>'+event.data);
					
			  };
			$("#tabs .chatTab").append("CHAT");
	});
	
</script>
<div class="chatTab" style="height:400px;">

</div>
<textarea></textarea>
<button>Send!</button>