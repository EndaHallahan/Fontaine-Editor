
export default function openFileExplorer(accept, callback) {
	const input = document.createElement('input');
	input.type = 'file';

	input.onchange = e => {
	   	const files = e.target.files; 
	   	callback(files);
	}

	input.click();
}