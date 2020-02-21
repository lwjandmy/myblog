var fs = require('fs');

process.stdin.setEncoding('utf8');

var on_stdin = null;
process.stdin.on('readable', function () {
	var s = process.stdin.read();
	if (s == null)
		return;
	on_stdin(s);
});

console.log('文章名:');
on_stdin = function (str) {
	var title = str.replace(/\s+$/, '');
	
	console.log('文章分类:');
	on_stdin = function (str) {
		var category = str.replace(/\s+$/, '');

		console.log('创建时间:(格式:2016-01-01 02:03:04, 为空则设置当前时间)');
		on_stdin = function (str) {
			var ctime = str.replace(/\s+$/, '');
			var date = new Date();
			
			if (ctime.length != 0)
			{
				datematch = ctime.match(/(\d{4})\-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
				date.setFullYear(datematch[1]);
				date.setMonth(datematch[2] - 1);
				date.setDate(datematch[3]);
				date.setHours(datematch[4]);
				date.setMinutes(datematch[5]);
				date.setSeconds(datematch[6]);
			}
			
			// 把1位的数字前面加上0
			var int2Date = function (i) {
				var s = '' + i;
				if (s.length == 1)
					s = '0' + s;
				return s;
			};
			
			var createtime = '' + date.getFullYear() + int2Date(date.getMonth() + 1) + int2Date(date.getDate()) + '一' + int2Date(date.getHours()) + int2Date(date.getMinutes()) + int2Date(date.getSeconds());
			var lastmodifiedtime = createtime;
			
			var filename = '+.+category+.+' + category + '+.+title+.+' + title + '+.+createtime+.+' + createtime + '+.+lastmodifiedtime+.+' + lastmodifiedtime + '+.+.md';
			
			template_content = fs.readFileSync('template.md', 'utf8');
			
			// 文章标题应用到模板
			template_content = template_content.replace(/\[\[\[template_begin\[\[\[title\]\]\]template_end\]\]\]/g, title);
			
			fs.appendFileSync(filename, template_content);
			console.log(filename);
			
			process.exit();
			
		};
		

	};
};
