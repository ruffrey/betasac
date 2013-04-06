var SUCCESS = '<div class="alert alert-success notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>',
	FAIL = '<div class="alert notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>';

function crapstash(t, m) {
	return t.replace(/\{\{message\}\}/g,m);
}

function ApiCall(path) {
	var cb = arguments[1] || false;
	$.ajax({
		type: 'get',
		url: path,
		success: function(data) {
			if(data.success==false && data.errors && data.errors instanceof Array)
			{
				$.each(data.errors, function(i, val){
					$('div#notification_area').append(
						crapstash(FAIL, val)
					);
				});
				return;
			}
			else if(data.success==false && data.errors)
			{
				$('div#notification_area').append(
					crapstash(FAIL, data.errors)
				);
				return;
			}
			else if(data.success==false && data.message)
			{
				$('div#notification_area').append(
					crapstash(FAIL, data.errors)
				);
				return;
			}
			
			else if(data.success==false)
			{
				$('div#notification_area').append(
					crapstash(FAIL, 'Something broke, somewhere.')
				);
				return;
			}
			
			
			if(!cb)
			{
				$('div#notification_area').append(
					crapstash(SUCCESS, data.message || 'Ok')
				);
				return;
			}
			cb(data);
		},
		error: function(jqx, st, rtxt) {
			$('div#notification_area').append(
				crapstash(FAIL, rtxt)
			);
		}
	});
}


//
// init
//
$(function(){
	
	$(document).ajaxStart(function(){
		$('div#ajaxLoader').show();
	}).ajaxStop(function(){
		$('div#ajaxLoader').hide();
	}).ajaxError(function(){
		$('div#ajaxLoader').hide();
	});
	
});
