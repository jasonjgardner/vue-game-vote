export default {
	game: {
		id: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		}
	}
}

export function validator(obj) {
	return typeof obj === 'object'
		&& obj.hasOwnProperty('id')
		&& obj.hasOwnProperty('text')
		&& typeof obj.id === typeof obj.text === 'string';
}

export function arrayValidator(arr) {
	return Array.isArray(arr) && arr.filter(v => validator(v)).length > 0;
}
