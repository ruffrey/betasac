var SUCCESS = '<div class="alert alert-success notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>',

	FAIL = '<div class="alert notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>',
	
	page_nav_indicator = {
		'item/create': 'post',
		account: 'community',
		item: 'apps',
		index: 'apps',
		login: 'log'
	};

function setPageNav() {
	var path=location.pathname.substring(1).toLowerCase(),
		$el;
	!path && ($el = $('.nav li.nav_apps a'));
	if(page_nav_indicator[path])
	{
		$el = $('.nav li.nav_'+page_nav_indicator[path]+' a');
	}
	else if(page_nav_indicator[path.split('/')[0]]){
		$el = $('.nav li.nav_'+page_nav_indicator[path.split('/')[0]]+' a');
	}
	
	if($el)
	{
		$el
		.css('text-transform','uppercase')
		.css('borderBottom','3px solid black');
	}
}
// crappy mustache templater
function crapstash(t, m) {
	return t.replace(/\{\{message\}\}/g,m);
}

function ApiSuccess(data) {
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
			crapstash(FAIL, data.message)
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
	
	$('div#notification_area').append(
		crapstash(SUCCESS, data.message || 'Ok')
	);
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
					crapstash(FAIL, data.message)
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
	
	setPageNav();
	
	$(document).on('click', '.item_template', function() {
		window.open('/item/'+$(this).attr('data-id'),'_self');
	});
	
	$(document).ajaxStart(function(){
		$('div#ajaxLoader').show();
	}).ajaxStop(function(){
		$('div#ajaxLoader').hide();
	}).ajaxError(function(){
		$('div#ajaxLoader').hide();
	});
	
});
