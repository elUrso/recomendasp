var request = require('sync-request');
let time = () => {
	var date = new Date();
	return String(date.getHours()) + ':'  + String(date.getMinutes())
}

function twitSampa() {
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

	init = () => {
		//get free
		let a;
		a = getPost('http://143.107.45.126:30134/collector/resources/data?&capabilities[]=slots_monitoring');
		let id = a.resources.map((res) => res.uuid);
		console.log(id);
		let free = a.resources.map((res) => {
			let len = res.capabilities.slots_monitoring.length;
			return res.capabilities.slots_monitoring[len - 1]['free_slots'];
		})
		console.log(free);
		let d;
		d = getPost('http://143.107.45.126:30134/collector/resources/data?&capabilities[]=open');
		console.log(d);
		let open = d.resources.map((res) => {
			let len = res.capabilities.open.length;
			return res.capabilities.open[len - 1]['status']
		});
		console.log(open);
		let ret = [];
		for(i = 0; i < id.length; i = i + 1) {
			ret[i] = {id: id[i], free: free[i], open: open[i], data: getGet(id[i]).data};
		}
		return ret;
	}

	let data = init()

	console.log(data)

	let sampa = data.filter((station) => {
		if(station.data.city === null) {
			return true;
		} else {
			return false;
		}
	})

	console.log(sampa)

	let twit = sampa.filter((station) => {
		if (station.open === 'true') {
			if (station.free  === 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	})

	let text = time() + " #bikesampa, não há vaga na(s) "
	twit.map((station) => {
		text = text + station.data.description.slice(24).slice(0, 30) + ', ';
	})

	text = text.slice(0,-2) + '.';

	return text;
}

console.log(twitSampa())
/*
Bike data model {
	id: '9896b9ab-ff44-4d1d-8053-826724a78f77',
    free: 5,
    open: 'true',
    data:
     { id: 44047,
       uri: null,
       created_at: '2017-11-10T19:45:26.926Z',
       updated_at: '2017-11-10T19:45:26.926Z',
       lat: -23.930828,
       lon: -46.346232,
       status: 'active',
       collect_interval: null,
       description: 'bike station located in Praça Ruy de Lugo Viña',
       uuid: '9896b9ab-ff44-4d1d-8053-826724a78f77',
       city: 'Santos',
       neighborhood: 'Saboó',
       state: 'São Paulo',
       postal_code: '11085-030',
       country: 'Brazil',
       capabilities: [Array] } }
 }
*/
