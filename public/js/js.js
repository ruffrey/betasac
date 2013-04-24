var SUCCESS = '<div class="alert alert-success notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>',

	FAIL = '<div class="alert notif"><button type="button" class="close" data-dismiss="alert">&times;</button>{{message}}</div>',
	
	COMMENT = '<div class="comment" data-account_id="{{account_id}}"><span class="comment_date">{{date}}</span><span class="comment_text">{{text}}</span></div>';
	
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
		.css('font-weight','100')
		.css('borderBottom','3px solid black');
	}
}
// crappy mustache templater
function crapstash(t, m) {
	return t.replace(/\{\{message\}\}/g,m);
}

function crapstash2(t, o) {
	var re = new RegExp();
	for(var _o in o)
	{
		re = new RegExp('\\{\\{'+_o+'\\}\\}','gm');
		t=t.replace(re,o[_o]);
	}
	return t;
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

function ApiSuccessWrap(i_cb){
	
	return function(data) {
		ApiSuccess(data);
		i_cb(data);
	};
}

function ApiFail(jqx, st, rtxt) {
	$('div#notification_area').append(
		crapstash(FAIL, rtxt)
	);
}

function ApiCall(path) {
	var cb = arguments[1] || false;
	var api_method = arguments[2] || 'get';
	
	$.ajax({
		type: api_method,
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
		error: ApiFail
	});
}

// Voting
function upvote(itemid) {
	ApiCall('/api/vote/'+itemid+'/1', false, 'post');
}

function downvote(itemid) {
	ApiCall('/api/vote/'+itemid+'/-1', false, 'post');
}

function unvote(itemid) {
	ApiCall('/api/vote/'+itemid+'/0', false, 'post');
}

function getvotes(itemid, callbk) {
	ApiCall('/api/vote/aggregate/'+itemid, callbk);
}

//
// init
//
$(function(){
	
	setPageNav();
	
	$(document).on('click', '.item_template', function() {
		window.open('/item/'+$(this).attr('data-id'),'_self');
	})
	.on('click', '.user_template', function() {
		window.open('/account/'+$(this).attr('data-id'),'_self');
	})
	.on('click', '.comment', function() {
		window.open('/account/'+$(this).attr('data-account_id'),'_self');
	});
	
	
	$(document).ajaxStart(function(){
		$('div#ajaxLoader').show();
	}).ajaxStop(function(){
		$('div#ajaxLoader').hide();
	}).ajaxError(function(){
		$('div#ajaxLoader').hide();
	});
	
});



/* node date utils https://github.com/JerrySievert/node-date-utils */
(function(){function f(e,t){e=String(e);while(e.length<t)e="0"+e;return e}function d(e,t){Date.prototype[e]===undefined&&(Date.prototype[e]=t)}var e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],t=["January","February","March","April","May","June","July","August","September","October","November","December"],n=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],r=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],i={su:0,sun:0,sunday:0,mo:1,mon:1,monday:1,tu:2,tue:2,tuesday:2,we:3,wed:3,wednesday:3,th:4,thu:4,thursday:4,fr:5,fri:5,friday:5,sa:6,sat:6,saturday:6},s=t.concat(e),o=["su","sun","sunday","mo","mon","monday","tu","tue","tuesday","we","wed","wednesday","th","thu","thursday","fr","fri","friday","sa","sat","saturday"],u={jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11},a=[31,28,31,30,31,30,31,31,30,31,30,31],l=function(e){return e.match(/^(\d+)$/)?!0:!1},c=function(e,t,n,r){for(var i=r;i>=n;i--){var s=e.substring(t,t+i);if(s.length<n)return null;if(l(s))return s}return null},h=Date.parse,p=function(e,t){e+="",t+="";var n=0,r=0,i="",u="",a="",f,l,h=new Date,p=h.getYear(),d=h.getMonth()+1,v=1,m=0,g=0,y=0,b="";while(r<t.length){i=t.charAt(r),u="";while(t.charAt(r)===i&&r<t.length)u+=t.charAt(r++);if(u==="yyyy"||u==="yy"||u==="y"){u==="yyyy"&&(f=4,l=4),u==="yy"&&(f=2,l=2),u==="y"&&(f=2,l=4),p=c(e,n,f,l);if(p===null)return NaN;n+=p.length,p.length===2&&(p>70?p=1900+(p-0):p=2e3+(p-0))}else if(u==="MMM"||u==="NNN"){d=0;for(var w=0;w<s.length;w++){var E=s[w];if(e.substring(n,n+E.length).toLowerCase()===E.toLowerCase())if(u==="MMM"||u==="NNN"&&w>11){d=w+1,d>12&&(d-=12),n+=E.length;break}}if(d<1||d>12)return NaN}else if(u==="EE"||u==="E")for(var S=0;S<o.length;S++){var x=o[S];if(e.substring(n,n+x.length).toLowerCase()===x.toLowerCase()){n+=x.length;break}}else if(u==="MM"||u==="M"){d=c(e,n,u.length,2);if(d===null||d<1||d>12)return NaN;n+=d.length}else if(u==="dd"||u==="d"){v=c(e,n,u.length,2);if(v===null||v<1||v>31)return NaN;n+=v.length}else if(u==="hh"||u==="h"){m=c(e,n,u.length,2);if(m===null||m<1||m>12)return NaN;n+=m.length}else if(u==="HH"||u==="H"){m=c(e,n,u.length,2);if(m===null||m<0||m>23)return NaN;n+=m.length}else if(u==="KK"||u==="K"){m=c(e,n,u.length,2);if(m===null||m<0||m>11)return NaN;n+=m.length}else if(u==="kk"||u==="k"){m=c(e,n,u.length,2);if(m===null||m<1||m>24)return NaN;n+=m.length,m--}else if(u==="mm"||u==="m"){g=c(e,n,u.length,2);if(g===null||g<0||g>59)return NaN;n+=g.length}else if(u==="ss"||u==="s"){y=c(e,n,u.length,2);if(y===null||y<0||y>59)return NaN;n+=y.length}else if(u==="a"){if(e.substring(n,n+2).toLowerCase()==="am")b="AM";else{if(e.substring(n,n+2).toLowerCase()!=="pm")return NaN;b="PM"}n+=2}else{if(e.substring(n,n+u.length)!==u)return NaN;n+=u.length}}if(n!==e.length)return NaN;if(d===2)if(p%4===0&&p%100!==0||p%400===0){if(v>29)return NaN}else if(v>28)return NaN;if(d===4||d===6||d===9||d===11)if(v>30)return NaN;m<12&&b==="PM"?m=m-0+12:m>11&&b==="AM"&&(m-=12);var T=new Date(p,d-1,v,m,g,y);return T.getTime()};Date.parse=function(e,t){if(t)return p(e,t);var n=h(e),r=0,i;return isNaN(n)&&(i=/^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(e))&&(i[8]!=="Z"&&(r=+i[10]*60+ +i[11],i[9]==="+"&&(r=0-r)),i[7]=i[7]||"000",n=Date.UTC(+i[1],+i[2]-1,+i[3],+i[4],+i[5]+r,+i[6],+i[7].substr(0,3))),n},Date.today=function(){return(new Date).clearTime()},Date.UTCtoday=function(){return(new Date).clearUTCTime()},Date.tomorrow=function(){return Date.today().add({days:1})},Date.UTCtomorrow=function(){return Date.UTCtoday().add({days:1})},Date.yesterday=function(){return Date.today().add({days:-1})},Date.UTCyesterday=function(){return Date.UTCtoday().add({days:-1})},Date.validateDay=function(e,t,n){var r=new Date(t,n,e);return r.getFullYear()===t&&r.getMonth()===n&&r.getDate()===e},Date.validateYear=function(e){return e>=0&&e<=9999},Date.validateSecond=function(e){return e>=0&&e<60},Date.validateMonth=function(e){return e>=0&&e<12},Date.validateMinute=function(e){return e>=0&&e<60},Date.validateMillisecond=function(e){return e>=0&&e<1e3},Date.validateHour=function(e){return e>=0&&e<24},Date.compare=function(e,t){return e.valueOf()<t.valueOf()?-1:e.valueOf()>t.valueOf()?1:0},Date.equals=function(e,t){return e.valueOf()===t.valueOf()},Date.getDayNumberFromName=function(e){return i[e.toLowerCase()]},Date.getMonthNumberFromName=function(e){return u[e.toLowerCase()]},Date.isLeapYear=function(e){return(new Date(e,1,29)).getDate()===29},Date.getDaysInMonth=function(e,t){return t===1?Date.isLeapYear(e)?29:28:a[t]},d("getMonthAbbr",function(){return e[this.getMonth()]}),d("getMonthName",function(){return t[this.getMonth()]}),d("getUTCOffset",function(){var e=f(Math.abs(this.getTimezoneOffset()/.6),4);return this.getTimezoneOffset()>0&&(e="-"+e),e}),d("toCLFString",function(){return f(this.getDate(),2)+"/"+this.getMonthAbbr()+"/"+this.getFullYear()+":"+f(this.getHours(),2)+":"+f(this.getMinutes(),2)+":"+f(this.getSeconds(),2)+" "+this.getUTCOffset()}),d("toYMD",function(e){return e=typeof e=="undefined"?"-":e,this.getFullYear()+e+f(this.getMonth()+1,2)+e+f(this.getDate(),2)}),d("toDBString",function(){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1,2)+"-"+f(this.getUTCDate(),2)+" "+f(this.getUTCHours(),2)+":"+f(this.getUTCMinutes(),2)+":"+f(this.getUTCSeconds(),2)}),d("clearTime",function(){return this.setHours(0),this.setMinutes(0),this.setSeconds(0),this.setMilliseconds(0),this}),d("clearUTCTime",function(){return this.setUTCHours(0),this.setUTCMinutes(0),this.setUTCSeconds(0),this.setUTCMilliseconds(0),this}),d("add",function(e){return e.milliseconds!==undefined&&this.setMilliseconds(this.getMilliseconds()+e.milliseconds),e.seconds!==undefined&&this.setSeconds(this.getSeconds()+e.seconds),e.minutes!==undefined&&this.setMinutes(this.getMinutes()+e.minutes),e.hours!==undefined&&this.setHours(this.getHours()+e.hours),e.days!==undefined&&this.setDate(this.getDate()+e.days),e.weeks!==undefined&&this.setDate(this.getDate()+e.weeks*7),e.months!==undefined&&this.setMonth(this.getMonth()+e.months),e.years!==undefined&&this.setFullYear(this.getFullYear()+e.years),this}),d("addMilliseconds",function(e){return this.add({milliseconds:e})}),d("addSeconds",function(e){return this.add({seconds:e})}),d("addMinutes",function(e){return this.add({minutes:e})}),d("addHours",function(e){return this.add({hours:e})}),d("addDays",function(e){return this.add({days:e})}),d("addWeeks",function(e){return this.add({days:e*7})}),d("addMonths",function(e){return this.add({months:e})}),d("addYears",function(e){return this.add({years:e})}),d("setTimeToNow",function(){var e=new Date;this.setMilliseconds(e.getMilliseconds()),this.setSeconds(e.getSeconds()),this.setMinutes(e.getMinutes()),this.setHours(e.getHours())}),d("clone",function(){return new Date(this.valueOf())}),d("between",function(e,t){return this.valueOf()>=e.valueOf()&&this.valueOf()<=t.valueOf()}),d("compareTo",function(e){return Date.compare(this,e)}),d("equals",function(e){return Date.equals(this,e)}),d("isAfter",function(e){return e=e?e:new Date,this.compareTo(e)>0}),d("isBefore",function(e){return e=e?e:new Date,this.compareTo(e)<0}),d("getDaysBetween",function(e){return(e.clone().valueOf()-this.valueOf())/864e5|0}),d("getHoursBetween",function(e){return(e.clone().valueOf()-this.valueOf())/36e5|0}),d("getMinutesBetween",function(e){return(e.clone().valueOf()-this.valueOf())/6e4|0}),d("getSecondsBetween",function(e){return(e.clone().valueOf()-this.valueOf())/1e3|0}),d("getMillisecondsBetween",function(e){return e.clone().valueOf()-this.valueOf()|0}),d("getOrdinalNumber",function(){return Math.ceil((this.clone().clearTime()-new Date(this.getFullYear(),0,1))/864e5)+1}),d("toFormat",function(e){return v(e,m(this))}),d("toUTCFormat",function(e){return v(e,g(this))});var v=function(e,t){var n=[e],r,i,s,o=function(e,t){var r=0,i=n.length,s,o,u,a=[];for(;r<i;r++)if(typeof n[r]=="string"){u=n[r].split(e);for(s=0,o=u.length-1;s<o;s++)a.push(u[s]),a.push([t]);a.push(u[o])}else a.push(n[r]);n=a};for(r in t)o(r,t[r]);s="";for(r=0,i=n.length;r<i;r++)s+=typeof n[r]=="string"?n[r]:n[r][0];return n.join("")},m=function(i){var s=i.getHours()%12?i.getHours()%12:12;return{YYYY:i.getFullYear(),YY:String(i.getFullYear()).slice(-2),MMMM:t[i.getMonth()],MMM:e[i.getMonth()],MM:f(i.getMonth()+1,2),MI:f(i.getMinutes(),2),M:i.getMonth()+1,DDDD:r[i.getDay()],DDD:n[i.getDay()],DD:f(i.getDate(),2),D:i.getDate(),HH24:f(i.getHours(),2),HH:f(s,2),H:s,SS:f(i.getSeconds(),2),PP:i.getHours()>=12?"PM":"AM",P:i.getHours()>=12?"pm":"am",LL:f(i.getMilliseconds(),3)}},g=function(i){var s=i.getUTCHours()%12?i.getUTCHours()%12:12;return{YYYY:i.getUTCFullYear(),YY:String(i.getUTCFullYear()).slice(-2),MMMM:t[i.getUTCMonth()],MMM:e[i.getUTCMonth()],MM:f(i.getUTCMonth()+1,2),MI:f(i.getUTCMinutes(),2),M:i.getUTCMonth()+1,DDDD:r[i.getUTCDay()],DDD:n[i.getUTCDay()],DD:f(i.getUTCDate(),2),D:i.getUTCDate(),HH24:f(i.getUTCHours(),2),HH:f(s,2),H:s,SS:f(i.getUTCSeconds(),2),PP:i.getUTCHours()>=12?"PM":"AM",P:i.getUTCHours()>=12?"pm":"am",LL:f(i.getUTCMilliseconds(),3)}}})();


