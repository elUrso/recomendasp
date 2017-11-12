const express = require('express');
const app = express();
var request = require('sync-request');

app.get('/ar', (req, res) => res.send(twitAr()));

let time = () => {
	var date = new Date();
	return String(date.getHours()) + ':'  + String(date.getMinutes())
}


function twitAr() {
	getPost = (url) => {
		let res;
		res = request('POST', url);
		return JSON.parse(res.getBody('utf8'));
	}

	getGet = (uuid) => {
		let res;
		res = request('get', 'http://143.107.45.126:30134/catalog/resources/' + uuid);
		return JSON.parse(res.getBody('utf8'));
	}

	getGet2 = (url) => {
		let res;
		res = request('get', url);
		return JSON.parse(res.getBody('utf8'));
	}
	let neighbors = ""
	let a = getPost('http://143.107.45.126:30134/collector/resources/data?&capabilities[]=air_quality&start=3');
	a.resources.map((s) => {
		let len = s.capabilities.air_quality.length;
		if(s.capabilities.air_quality[len - 1].air_quality === 'ruim' ||
			s.capabilities.air_quality[len - 1].air_quality === 'muito ruim' ||
			s.capabilities.air_quality[len - 1].air_quality === 'péssima' ) {
			if(getGet(s.uuid).data.neighborhood != null) {
					neighbors = neighbors + ", " + getGet(s.uuid).data.neighborhood;
			}
		}
	})
	let ret = time() +
		" A qualidade do #ArEmSampa está boa."
	if(neighbors != "") {
		ret = ret + " Exceto nos bairro(s) " + neighbors + '.';
	}
	return  ret;
}

app.listen(3002, () => console.log('Example app listening on port 3002!'))


// 9, 15, 21, 3
