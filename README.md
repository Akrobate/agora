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

### Generate documentation

Documentation is in open api 3 specification format and can be found in /documentation/open-api-specification

#### Documentation is written in splitted format

* agora-api.yaml is the main file and contains all inclusions
* ./paths contains routes verbs definitions


#### Generate documenation

* First you'll need to aggregate splitted documentation to single yaml file

```bash
npm run build-doc
```

* Second you(ll need to generate the readable html file

```bash
npm run build-html
```

* Both steps can be run with command

```bash
npm run generate-html-doc
```

### TODO

## Feature

* *15/07/22* Implement contact list (with tag mecanic)
* *15/07/22* Implement interface to transform guest account to real account

## Frontend

* *27/05/22* Create login element to include in LoginPage
* *17/06/22* Implementer le nombre de jours restants avant finalisation campagne
* *08/07/22* Mot de passe oublié frontend
* *13/07/22* Tableau de bord, propositions de campagnes a participer ne doit pas montrer les terminées
* *13/07/22* Ajouter les résultats des campagnes terminés sur le tableau de bord

## Backend

* *07/07/22* Update documentation for user password update

## Latent tasks

* *15/07/22* Process language translations refactor
