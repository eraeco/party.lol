 # party.lol

Official repo of the [Private Party](http://party.lol)!

 ## Cryptography

We use [SEA](https://gun.eco/docs/SEA) which depends upon native WebCrypto in the browser.

WebCrypto has been audited and is the leading industry-standard cryptography library, implemented by all major browsers.

**ECDSA** and **ECDH** keypairs are generated upon installation. You can import your own keys if you would like, but we have no user interface for it yet (coming soon).

 ## Better than Signal, Telegram, etc.

 - Works anywhere on the web.
 - All code is Open Source.
 - Party Mode has no servers.
 - Party Mode makes 0 network calls.
 - Secret Agent mode needs Diffie-Hellman key exchange.
 - "Server" [code](https://github.com/amark/gun) is Open Source.
 - No central server, no proprietary server, you can run your own.
 - "Server" is a decentralized mesh network of peers.
 - Your keys cannot be accessed by any server or peer.
 - PARTY is fully P2P with WebRTC.
 - When WebRTC fails, PARTY uses peers.
 - Peers cannot see encrypted data.

 ## Can websites scrape data after it is decrypted? No.

We popup an IFRAME of the browser extension ontop of the website, and only render the decrypted plaintext at rest in the clear inside of the IFRAME. This prevents websites from scraping your decrypted data since they do not have the same origin (CORS) as the extension.

 ## 100% Privacy - Secret Agent Mode

This is intended to be used on private channels (email, Twitter DMs, Facebook private messages, etc.).

P2P/decentralized Diffie-Hellman key exchange is used. This description is taken from [our friends at dimension](https://www.dimension.im/) who will be releasing maskbook, a competing and compatible alternative to PARTY:

1. Alice generates an **ECDSA/ECDH P-256** keypair.
2. Alice publishes her public key in a post.
3. Bob, a friend of Alice, does the same.
4. Alice's post is encrypted with an **AES-256** key.
5. Alice chooses who can read it, say Bob.
6. Alice Diffie-Hellman mixes Bob’s **ECDH** public key to derive a shared **AES-256** key.
7. Alice encrypts the post's key with Bob's **AES-256** shared key.
8. Alice shares the key with Bob via a [P2P/decentralized network](https://github.com/amark/gun).
9. Bob mixes Alice's **ECDH** public key to derive the shared **AES-256** key.
10. Bob decrypts the post's **AES-256** key with the shared **AES-256** key.
11. Bob decrypts the post with the **AES-256** key.

Please watch our animated 1 minute [Cartoon Cryptography](https://gun.eco/docs/Cartoon-Cryptography) explainer series to understand this better.

 ## 50% Privacy - Party Mode

This is intended to be used on public or quasi-public sites (Reddit, Slack, Facebook groups, etc.).

Anybody with the browser extension can run [Proof-of-Work](https://gun.eco/docs/Cartoon-Cryptography#work) to decrypt a Party Mode post (this does not work for Secret Agent posts).

This makes it hard for mass surveillance and surveillance capitalism to spy on users. Facebook gets 10K+ posts/sec, it would take them about ~1hour to decrypt 1 second worth of data. They might as well mine Bitcoin instead.

But friends and other partiers can decrypt each post with a **PBKDF2 SHA-256** Proof-of-Work derived **AES-256** key in about ~half a second.

 ## Contribute

Need help with a mobile version!

 ## Legal

You agree to the [Terms of Use](https://docs.google.com/document/d/1rw_FR8DE1acqfMaBg20EhocGYdHYcYlSoFbpk9r2Ls0) if you install the extension. This is so we don't get sued.