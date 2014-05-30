OpenPGP verified WebApp
========================

## Overview
Using client side crypto usually comes with the problem of trusting the server serving the files. Even if a webapp uses OpenPGP.js to encrypt everything client-side, it is insecure in the event where the server is compromised. The attacker can send an altered version of the webapp including malicius code and this will go undetectable by the user.

This is an attempt to partially solve this problem. Partially because when the user first loads the webapp the same problems mentioned above exist. But after the initial load everything has to be signed by a specific GPG key and there is no way for the server to force a change to the client-side code.

## Applications
The most prominent application of this idea is WebMail providers that want to offer secure, end-to-end encryption to their users and at the same time defend from a malicious attacker or the government wanting to compromise their security in the future. But this isn't the only application requiring end-to-end encryption. Other sites could be file shareing sites like mega.co.nz, chatting application and any privacy preserving app in general.

## How to run
Clone the repo, run `npm install` and then run `node index.js`. Then, navigate to `http://localhost:1337/index.html` and open your dev tools. Notice that after the first load the only requests logged in your console are the clearsigned javascript files. Everything else is always run from the browsers cache.

## How it works
The goal here is to load the minimum code needed to bootstrap the WebApp and save it in the browser cache forever. After this initial load the browser (currently working only in Chrome) never requests these resources again.

This is accomplished using a `manifest.appcache` file to cache `index.html` and `main.js` and appropriate cache headers for `manifest.appcache` itself so that it is cached for as long as we want.

After these files are loaded `main.js` starts, loads the `openpgp.min.js` and the public key that will be trusted on first use (TOFU) and saves them in localStorage for future use. After this point we have everything we need to verify server-side code before we run it.

As a last step, the function `secureEval()` is called which downloads a gpg clearsigned javascript file, verifies its signature and if it is valid it evals it. This starts a chain of trust that can be used to load a whole webapp.

## Other thoughts
In order for this to be a complete solution there has to be a way of detecting that the cache is for some reason empty. In this case the user has to be notified that he's about to trust potentially untrusted code and also offer instructions for a better than TOFU way of verifying the currently downloaded code for advanced users.
