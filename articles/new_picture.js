var fs = require('fs');
var crypto = require('crypto');
var sha1 = crypto.createHash('sha1');

process.stdin.setEncoding('utf8');

var on_stdin = null;
process.stdin.on('readable', function () {
	var s = process.stdin.read();
	if (s == null)
		return;
	on_stdin(s);
});

console.log('图片文件路径:');
on_stdin = function (str) {
	var picture_path = str.replace(/\s+$/, '');
	var path_suffix = picture_path.match(/\.([^\.]+)$/)[1];
	picture_data = fs.readFileSync(picture_path);
	sha1.update(picture_data);
	var new_picture_path = 'pictures/' + sha1.digest('hex') + '.' + path_suffix;
	console.log(new_picture_path);
	fs.writeFileSync(new_picture_path, picture_data);
	process.exit();
};