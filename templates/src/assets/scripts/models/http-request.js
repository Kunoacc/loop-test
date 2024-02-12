export async function call (
	url,
	method = 'POST',
	data = false,
	convertDataToJSON = true,
	headers = {},
) {
	const options = {
		method,
	};
	if (method === 'POST' && data !== false) {
		if (convertDataToJSON) {
			options.body = JSON.stringify(data);
			options.headers = {
				'Content-Type': 'application/json',
			};
		} else {
			options.body = data;
		}
	}

	options.headers = {
		...options.headers,
		...headers,
	};

	try {
		const response = await fetch(url, options);
		const res = await response.json();
		return res;
	} catch (e) {
		console.error(e);
		return { error: e.message };
	}
}
