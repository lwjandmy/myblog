node gen_articles.js
node gen_categoried_article_list.js
git add --all
git commit -m "auto commit at $(date +%y%m%d_%H%M%S)"
GITUSERNAME=lwjandmy ./gitpush.sh $(cat ./gitpassword.txt)
