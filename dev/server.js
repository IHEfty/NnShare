const express = require('express')
const path = require('path')
const os = require('os');
const dns = require('dns');
const qrcode = require('qrcode-terminal');

const app = express()
const port = process.env.PORT || 5600;

let loc = "../"

app.use('/scripts', express.static(path.resolve(__dirname, loc, 'scripts')))
app.use('/styles', express.static(path.resolve(__dirname, loc, 'styles')))


app.get('/*', function(req, res){
    res.sendFile(path.resolve(__dirname, loc, 'index.html'))
})

// 192.168.16.100

app.listen(port, '0.0.0.0', function(){
    console.log(`http://localhost:${port}`)
	getPublicIPAddress((err, ip) => {
		if (err) {
			console.error('Error:', err);
		} 
		else {
			let url = `http://${ip}:${port}`
			console.log(url);
			qrcode.generate(url, { small: true }, (qrCodeASCII) => {
				console.log(qrCodeASCII);
			});
		}
	});
})


function getPublicIPAddress(callback) {
	const interfaces = os.networkInterfaces();
	let ipAddress = '';
	
	for (const interfaceName in interfaces) {
		interfaces[interfaceName].forEach((iface) => {
			if (iface.family === 'IPv4' && !iface.internal) {
				ipAddress = iface.address;
			}
		});
	}
	
	if (!ipAddress) {
		callback('No public IP address found.');
		return;
	}
	
	dns.lookup(ipAddress, (err, hostname) => {
		if (err) {
			callback(err);
			} else {
			callback(null, ipAddress);
		}
	});
}
