# agora


ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub

cert=$(cat jwtRS256.key)
echo "${cert//$'\n'/\\n}"


====================
====================

Sorting

1. Start sorting Copy propositions if not exists with random order to results list
2. Update list ranks

SortingElo
