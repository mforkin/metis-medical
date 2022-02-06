# Metis Medical

Learning Tool for Medical Professionals

## Setup

### ssl
Use letsencrypt for free cert

* run cert bot ON THE SERVER you are hosting your domain
  * flush ip tables: `sudo iptables -t nat -F`
  * `sudo certbot certonly --standalone --dry-run`
    * use dry run to test if it works, remove dry-run to actually do it. If you fail when not dry running then you will be rate limited.
  * reset ip tables: 
    * sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
    * sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
* Create p12
  * `openssl pkcs12 -export -in /etc/letsencrypt/live/YOURDOMAIN/fullchain.pem -inkey /etc/letsencrypt/live/YOURDOMAIN/privkey.pem -out KEYSTORENAME.p12 -name KEYSTOREALIAS`
create jks
*  `/usr/lib/jvm/jdk1.7.0_80/bin/keytool -importkeystore -deststorepass WILDFLY_NEW_STORE_PASS -destkeypass WILDFLY_NEW_KEY_PASS -destkeystore NEW_KEYSTORE_FILE.jks -srckeystore KEYSTORENAME.p12 -srcstoretype PKCS12 -srcstorepass PREVIOUSPASSWORD -alias KEYSTOREALIAS`


## TODO

* Backups
