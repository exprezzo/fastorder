<script>
	$(function(){
		var tabId="<?php echo $_REQUEST['tabId']; ?>";
		tabId = '#' + tabId;
		this.tabId = tabId;
		
		$('div'+tabId).css('padding','0px 0 0 0');
		$('div'+tabId).css('margin-top','0px');
		$('div'+tabId).css('border','0 1px 1px 1px');

		$('div'+tabId).addClass('ui-widget-content');
		
		
		var tab=$('a[href="'+tabId+'"]');
		tab.html('Bienvenido');
		tab.addClass('welcome');
		
	});
	
</script>
<div style="margin-top:-25px;">
<h1>Bienvenido!</h1>
<br>
<br><br><br><br><br><br><br><br><br><br><br><br><br>
</div>