var fs = require('fs');
var marked = require('./marked');

var clean_articles = function (callback) {
	fs.readdir('articles', function (err, files) {
		files.forEach(function (file_path) {
			if (file_path.match('\.html$') == null || // md结尾
				file_path.match(/^\+\.\+/)  == null || // 首尾都有特殊符号
				file_path.match(/\+\.\+\.html$/)  == null)
			{
				return ;
			}
			try {fs.unlinkSync('articles/' + file_path);} catch (e){}
		});
		callback && callback();
	});
};

var md2html = function (callback) {
	fs.readdir('md_articles', function (err, files) {
		files.forEach(function (file_path) {
			if (file_path.match('\.md$') == null || // md结尾
				file_path.match(/^\+\.\+/)  == null || // 首尾都有特殊符号
				file_path.match(/\+\.\+\.md$/)  == null)
			{
				console.log('ignore ' + file_path);
				return ;
			}
			
			var in_file_path = 'md_articles/' + file_path;
			var out_file_path = 'articles/' + file_path.replace('\.md', '\.html');

			
			file_data = fs.readFileSync(in_file_path, 'utf8');
			
			// 从file_data获取文章标题
			var title = file_data.split('\r\n')[0].substring(2);
			
			// md -> html
			file_data = marked(file_data);
			
			// 读取模板
			template_beforemd = fs.readFileSync('md_articles/template_before_markdown.html', 'utf8');
			template_aftermd = fs.readFileSync('md_articles/template_after_markdown.html', 'utf8');

			// 将标题应用到template_beforemd
			template_beforemd = template_beforemd.replace('\[\[\[template_begin\[\[\[title\]\]\]template_end\]\]\]', title);
			
			// 加入模板内容
			file_data = template_beforemd + file_data + template_aftermd;

			// 写入文件
			try {fs.unlinkSync(out_file_path);} catch (e){}
			fs.appendFileSync(out_file_path, file_data);
			
			// console.log(out_file_path);
			
		});
		callback && callback();
	});
};

clean_articles(md2html);
