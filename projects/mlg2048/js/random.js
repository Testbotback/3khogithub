export function uniform() {
	return Math.random() * 2 - 1;
}

export function bool(bias=0.5) {
	return Math.random() > bias;
}

export function inv() {
	return bool() ? 1 : -1;
}

export function pick(array) {
	return array[Math.round(Math.random() * array.length - 0.5)];
}
