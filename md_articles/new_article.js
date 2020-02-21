const process = require('process')
const fs = require('fs')

if (process.argv.length != 4) {
	console.log('用法: node test.js <标题> <分类>')
	process.exit()
}

const title = process.argv[2]
const category = process.argv[3]
const date = new Date()

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
