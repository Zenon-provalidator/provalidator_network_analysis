const geoip = require('geoip-lite')
const fetch = require('sync-fetch')
const converter = require('json-2-csv')
require('dotenv').config()


//get location from ip
const getLocation = function(ip){
	let loc = geoip.lookup(ip)
	let res = ""
	try{
		res = loc.country + "|" + loc.region
	}catch(err){
//		console.log(ip)
//		console.error(err)
	}
	return res
}

// network
let json = fetch(process.env.RPC_URL+'/net_info').json()
let resultJson = []

for(let i=0; i<json.result.peers.length; i++){
	
	let j = { 
		"moniker" : json.result.peers[i].node_info.moniker, 
		"ip" : json.result.peers[i].remote_ip, 
		"country" : "",
		"region" : ""
	}
	let geo = getLocation(json.result.peers[i].remote_ip).split("|")
	j.country = geo[0]
	j.region = geo[1]
	
	resultJson.push(j)		
}

// convert JSON array to CSV string
converter.json2csv(resultJson, (err, csv) => {
    if (err) {
        throw err;
    }
    console.log(csv)
})


