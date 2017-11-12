const express = require('express');
const app = express();
var request = require('sync-request');
let time = () => {
	var date = new Date();
	return String(date.getHours()) + ':'  + String(date.getMinutes())
}

app.get('/manha', (req, res) => res.send(twitIt('Bom dia', 'manhã')));
app.get('/tarde', (req, res) => res.send(twitIt('Boa tarde', 'tarde')));
app.get('/noite', (req, res) => res.send(twitIt('Boa noite', 'noite')));
app.get('/madrugada', (req, res) => res.send(twitIt('Boa madrugada', 'madrugada')));
app.get('/alerta', (req, res) => res.send('#AlertaEmSampa. Cuidado galera, nos bairros Butantã e Pinheiros a velocidade do vento está bem alta. Pode ser perigoso! 😱 '));



function twitClima() {
	getPost = (url) => {
		let res;
		res = request('POST', url);
		return JSON.parse(res.getBody('utf8'));
	}

	getGet2 = (url) => {
		let res;
		res = request('get', url);
		return JSON.parse(res.getBody('utf8'));
	}

	let a = getPost('http://143.107.45.126:30134/collector/resources/data?&capabilities[]=weather');
	let i = 0;
	let sum = 0;
	let hum = 0;
	a.resources.map((s) => {
		let len = s.capabilities.weather.length
		i = i + 1;
		hum = hum + (s.capabilities.weather[len - 1].humidity);
		sum = sum + (s.capabilities.weather[len - 1].thermal_sensation);
	})
	console.log(i);
	console.log(sum);
	console.log((sum/i - 32)*(5/9));
	return [(sum/i - 32)*(5/9), hum/i];
}

function twitIt(frase, periodo) {
	[c, h] = twitClima()
	let text = time() +
		" #TempoEmSampa. " + frase +", a sensação desta " + periodo + " é de " +
		String(Math.floor(c*100)/100) + 'C com a humidade de ' + String(Math.floor(h*100)/100) + '%.'
	if(h < 30) {
		text = text + ' Tempo muito seco, não esqueça de beber bastante água.'
	}
	if(c < 15) {
		text = text + ' Se sair de casa, não esqueça seu casaco'
	}
	return text;
}

app.listen(3001, () => console.log('Example app listening on port 3001!'))


// 9, 15, 21, 3
