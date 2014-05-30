// This is a proof of concept
// Bad practices chosen for clarity and small code size purposes

function load(path) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, false);
	xhr.send();
	return xhr.responseText;
}

var openpgpSource = localStorage.getItem('openpgpSource');

if (openpgpSource === null) {
	console.log('OpenPGP not found in localStorage. Fetching from server, this is where TOFU happens.');
	openpgpSource = load('openpgp.min.js');
	// Save it for the future
	localStorage.setItem('openpgpSource', openpgpSource)
}

var signingKey = localStorage.getItem('signingKey');

if (signingKey === null) {
	console.log('Signing public key not found in localStorage. Fetching from server, this is where TOFU happens.');
	signingKey = load('petrosagg.asc');
	// Save it for the future
	localStorage.setItem('signingKey', signingKey)
}

console.log('Loading OpenPGP library');
eval(openpgpSource);

console.log('Loading signing public key');
signingKey = openpgp.key.readArmored(signingKey);

function secureEval(path) {
	console.log('RUN:', path);
	console.log('--> Fetching code');
	var src = load(path);
	var cleartext = openpgp.cleartext.readArmored(src);

	console.log('--> Verifying GPG signature');
	var result = openpgp.verifyClearSignedMessage(signingKey.keys, cleartext);

	if (result.signatures[0] && result.signatures[0].valid) {
		console.log('--> Valid signature');
		eval(cleartext.text);
	} else {
		console.log('--> Bad signature! NSA... stahp it!');
	}
}

secureEval('signed_scripts/app.js.asc');
secureEval('signed_scripts/app_malformed.js.asc');
