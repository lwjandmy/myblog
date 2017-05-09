# encoding: utf-8
import os
import shutil
import pipes

old_keyword = '一.一'
new_keyword = '.....'


def path_rename(path):
	new_path = path.replace(old_keyword, new_keyword)
	os.replace(path, new_path)
	print(path)



if __name__ == '__main__':
	old_keyword = input('input old keyword: (example: 一.一)\n')
	new_keyword = input('input new keyword: (example: .....)\n')
	
	for path in os.listdir():
		if path.endswith('.md') and path.startswith(old_keyword):
			path_rename(path)