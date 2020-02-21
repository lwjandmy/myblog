## 使用说明

```bash
# 写新文章
cd md_articles
node new_article.js

# 在线编辑markdown:
# articles/live_editor.html

# 添加一个图片, 得到图片的文件名, 用于加入文章中
cd articles
node new_picture.js

# 修改已有文章后, 更新修改时间
cd md_articles
node modify_article.js

# 由md文件生成html文件
node gen_articles.js

# 由所有html文章, 生成article_list.js
node gen_article_list.js

# 自动生成文章列表并上传git
bash ./auto_build_commit_push.sh
```

---

## 日志文件的两种状态

*   md状态

    md文件位于md_articles文件夹下, 直接编辑, markdown格式.
	
*   html状态

    html文件位于articles文件夹下, md文件编辑完成, 运行node gen_articles.js可直接生成html文件
	
---

## 详细文件说明

|文件名| 说明|
|---|---|
|gen_article_list.js|  读取articles目录下所有html文件, 生成article_list.js数据|
|gen_articles.js| 转换 md_articles/*.md -> articles/*.html|
|template_before_markdown.html template_after_markdown.html| 在md转换时, 生成的围绕html结果的开头和结尾的模板文件|
|md_articles/new_article| 建立新日志|
|md_articles/modify_article| 更新日志修改时间|
|md_articles/template.md| 建立日志时用到的模板文件|
|articles/live_editor.html| 在线编辑markdown, 一个辅助网页|
|articles/new_picture.js| 由一个图片, 产生唯一的文件名(sha1), 保存在articles/pictures, 用于在文章中显示|

---

## 补充

所有脚本, 运行时工作目录要在articles下!  不过应该可以由dirpath之类的让代码帮助切换目录, 但因为懒, 没写, 以后用到再写.

所有md文件, 第一行一定要是# xxx格式, gen_articles.js会搜索标题, 应用到template_before_markdown.html模板中.

同理, 上一级目录(根目录)下脚本的运行时工作目录也要是上一级. 原因是文件的搜索按相对路径.


