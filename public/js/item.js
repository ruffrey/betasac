function report(v, itemid) {
	$.ajax({
		type: 'post',
		url: '/api/item/report/'+itemid,
		success: ApiSuccess,
		dataType: 'json',
		data: {
			text: v
		}
	});
}

function loadcomments(itemid, $div) {
	ApiCall('/comment/'+itemid, function(data){
		if(!data.comments.length)
		{
			return $div.empty().text('None yet.');
		}
		console.log(data.comments);
		var s = '';
		for(var x=0; x<data.comments.length; x++)
		{
			data.comments[x].date = (new Date(data.comments[x].date))
				.toFormat('YYYY-MM-DD H24-MI:SS');
			s+= crapstash2(COMMENT, data.comments[x]);
		}
		$div.empty().append(s);
	});
}


