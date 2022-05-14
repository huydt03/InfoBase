const {fEventHandle} = require('@drhuy/event-handle');

function InfoBase(id, info) {

	const EVENTS = [
		'onUpdateInfo'
	];

	let handle;

	let self = {id, info, getInfo: function(){}};

	function capitalizeFirstLetter(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function init(){

		handle = fEventHandle(self, EVENTS);

		for(let key in info){
			self[key] = info[key];
			let event_key = `on${capitalizeFirstLetter(key)}Update`;
			handle.add([event_key]);
			Object.defineProperty(self, key, {
				get: function(){ return info[key]; },
				set: function(value){
					if(value != info[key]){
						let old = info[key];
						info[key] = value;
						handle[event_key].fire(self, old, value);
						handle.onUpdateInfo.fire(self);
					}
				}
			})
		}

		Object.defineProperties(self, {
			id: {get: function(){ return id; }},
			info: {get: function(){ return {...info, id}; }}
		})

	}
	init();

	return self;
}

module.exports = InfoBase;
