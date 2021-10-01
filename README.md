# agora

## Configure Developpment env

### Configuration env

Copy the configuration.default.yml to configuration.test.yml

```bash
cp configuraiton.default.yml configuration.test.yml
```

### Run tests in test envs

```bash
npm install
npm run migrate:test # This command will use configuration.test.yml if file exists
npm run test
npm run cover
npm run lint
```

### Generating privates for JWT

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key


# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

# Preview generated private / public keys
cat jwtRS256.key
cat jwtRS256.key.pub

# Format output string for configuration.yml and env values
cert=$(cat jwtRS256.key)
echo "${cert//$'\n'/\\n}"
```


====================
======= Draft=======
====================

Sorting

1. Start sorting Copy propositions if not exists with random order to results list
2. Update list ranks

SortingElo


