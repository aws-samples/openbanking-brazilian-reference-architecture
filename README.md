# Open Banking Brazil

# Overview

This repo intends to demonstrate how an environment with the Open Banking mock API's can work in AWS using mTLS.
*** 

# Prerequisites:

- [awscli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

- [Pre configured AWS credentials](https://docs.aws.amazon.com/amazonswf/latest/developerguide/RubyFlowOptions.html)

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- [cdk](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

- [Docker](https://docs.docker.com/get-docker/)

## How to deploy

Make sure Docker is running. During the deploy we will use Docker to create the container that will be used to run NGINX. 

After Docker is running, execute the following commands: 

```
git clone <REPO_URL>

cd <REPO_NAME>/

npm install

cdk bootstrap

cdk synth

cdk deploy
```

This will clone this repo, then install all packages required. CDK will then bootstrap a deploy environment in your account. You will then synthetize a cloudformation template and finally deploy it. The end result will be the following architecture: 

TODO
![arquitetura](https://gph.is/g/4DnjOvv)

# How to test

There are two options for tests:

- Postman
- Terminal

## Postman

Follow these steps to prepare your setup: 

- [Create Workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/creating-workspaces/)

- [Create Environment](https://learning.postman.com/docs/sending-requests/variables/)

Set the following env variables:

| Key   |      Value      |
|----------|:-------------:|
| host | YOUR-NLB-DNS |
| version | v1 |

- [Import json File](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)


***The configuration file location*** `stub/proxy/client/OpenBankingBrazil.postman_collection.json`

- [Configure the certificates](https://learning.postman.com/docs/sending-requests/certificates/)
 

***Use the following: client.crt, client.key. The host is your NLB DNS.***

Finally, you run any of the requests you should be able to see the response as following:

![image](postman.png)


## Terminal
To test the mTLS connection, use terminal to run the following commands:

```
cd stub/proxy/client/ssl
HOST='YOUR-NLB-DNS-HERE'
VERSION='v1'
```

There are the following paths available for tests:

$HOST/discovery/$VERSION/status

$HOST/discovery/$VERSION/outstage

$HOST/channels/$VERSION/branches

$HOST/channels/$VERSION/electronic-channels

$HOST/channels/$VERSION/phone-channels

$HOST/channels/$VERSION/banking-agents

$HOST/products-services/$VERSION/personal-accounts

$HOST/products-services/$VERSION/business-accounts

$HOST/products-services/$VERSION/personal-loans

$HOST/products-services/$VERSION/business-loans

$HOST/products-services/$VERSION/personal-financings

$HOST/products-services/$VERSION/personal-invoice-financings

$HOST/products-services/$VERSION/personal-credit-cards

$HOST/products-services/$VERSION/business-credit-cards

$HOST/admin/$VERSION/metrics


To test any of these paths, run the following command: 

`curl --key client.key --cert client.crt -k COMMAND`

For example:

````
★  ssl [docs] ♡  curl --key client.key --cert client.crt -k $HOST/channels/$VERSION/electronic-channels

{
  "data": {
    "brand": {
      "name": "Organização A",
      "companies": [
        {
          "name": "Empresa A1",
          "cnpjNumber": "45086338000178",
          "urlComplementaryList": "https://empresaa1.com/branches-banking",
          "channels": [
            {
              "identification": {
                "type": "INTERNET_BANKING",
                "additionalInfo": "NA",
                "url": "https://empresaa1.com/internet-banking"
              },
              "service": {
                "codes": [
                  "ABERTURA_CONTA",
                  "RECEBIMENTOS_PAGAMENTOS_TRANSFERENCIAS_ELETRONICAS",
                  "OPERACOES_CREDITO",
                  "CARTAO_CREDITO",
                  "OPERACOES_CAMBIO",
                  "INVESTIMENTOS",
                  "SEGUROS",
                  "OUTROS"
                ],
                "additionalInfo": "Previdência Complementar"
              }
            }
          ]
        }
      ]
    }
  },
  "links": {
    "self": "https://api.banco.com.br/open-banking/channels/v1/electronic-channels",
    "first": "https://api.banco.com.br/open-banking/channels/v1/electronic-channels",
    "prev": "null",
    "next": "null",
    "last": "https://api.banco.com.br/open-banking/channels/v1/electronic-channels"
  },
  "meta": {
    "totalRecords": 1,
    "totalPages": 1
  }
}
````

# Cleaning UP

Run the following command:

`cdk destroy`
