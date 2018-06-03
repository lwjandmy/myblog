const marked = require('./marked')
const co = require('./co')
const Promise = require('./bluebird-release/bluebird')
const fs = Promise.promisifyAll(require('fs'))

co(function* () {
  // 过滤出生成的文件, 并删除
  yield (yield fs.readdirAsync('articles'))
    .filter(file_path =>
      file_path.match(/^\+\.\+/) // 开头是+.+
      && file_path.match(/\+\.\+\.html$/) // 结尾是+.+.html
    )
    .map(file_path => fs.unlinkAsync('articles/' + file_path))

  // 生成md对应的html
  yield (yield fs.readdirAsync('md_articles'))
    .filter(file_path =>
      file_path.match(/^\+\.\+/) // 开头是+.+
      && file_path.match(/\+\.\+\.md$/) // 结尾是+.+.md
    )
    .map(file_path => {
      return co (function* () {
        const in_file_path = 'md_articles/' + file_path;
        const out_file_path = 'articles/' + file_path.replace('\.md', '\.html');
        let file_data = yield fs.readFileAsync(in_file_path, 'utf8');
        
        // 从file_data获取文章标题
        const title = file_data.split('\r\n')[0].substring(2);
        
        // md -> html
        file_data = marked(file_data);
        
        // 读取模板
        let template_beforemd = yield fs.readFileAsync('md_articles/template_before_markdown.html', 'utf8');
        const template_aftermd = yield fs.readFileAsync('md_articles/template_after_markdown.html', 'utf8');
        
        // 将标题应用到template_beforemd
        template_beforemd = template_beforemd.replace('\[\[\[template_begin\[\[\[title\]\]\]template_end\]\]\]', title);
      
        // 加入模板内容
        file_data = template_beforemd + file_data + template_aftermd;
        
        // 写入文件
        yield fs.appendFileAsync(out_file_path, file_data);
        
      })
    })

})

