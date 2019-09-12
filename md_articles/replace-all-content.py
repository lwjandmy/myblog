import os

old_str = '';
new_str = '';

def redata(path):
	data = open(path, encoding='utf8').read()
	new_data = data.replace(old_str, new_str)
	open(path, 'w', encoding='utf8').write(new_data)
	print(path)

if __name__ == '__main__':
	old_str = input('old string: (example: ```shell)\n');
	new_str = input('new string: (example: ```bash)\n');

	for path in os.listdir():
		if path.endswith('.md'):
			redata(path)