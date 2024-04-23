# Xplor - Registry Service
This service is responsible for creating, storing, deleting the Verifiable Credentials using Sunbird RC layer. The registry service interacts with Sunbird RC to do VC related operations.

## Table of Contents

- [Working Demo](#working-demo)
- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Running tests](#running-tests)
- [Working of Registry](#working-of-registry)
- [API Documentation](#api-documentation)
- [Service Modules](#service-modules)
- [Configurations](#configurations)
- [Deployment](#deployment)
- [Contributing](#contributing)


## Pre-requisites
Below is the list of services you need in order to run this service.
- [Sunbird RC Layer](https://github.com.com/xplor-sunbird) to manage data.
- [Xplor Wallet Layer](https://github.com/xplor-wallet) to push VC to wallet.


## Installation

### Clone or fork this Project

```bash
 git clone REPOSITORY_LINK
```
    
### Setup Environment Variables(.env)
You need to setup the values for the environment variables. Below is the list of required .env variables

```bash
REGISTRY_SERVICE_URL=
SUNBIRD_IDENTITY_SERVICE_URL=
SUNBIRD_VC_SERVICE_URL=
SUNBIRD_SCHEMA_SERVICE_URL=
FILE_STORE_LOCAL_PATH=
WALLET_SERVICE_URL=
```
### Run service using Docker
Make sure you've the latest version of the docker installed in-order to run the application. Run the service with the following command

```bash
 docker compose --build
```

    
## Running Tests

The service has test cases for each module's service functions which you will get triggered on pushing the code to remote. You can run the test with the following command as well:

```bash
  npm test
```
    
## Working of Registry
For defining the working of the registry service, we'll take an example usecase of a 3rd Party Insitution(Issuer) which offers Skill courses like Docker, Redis etc and wants to issue certificates to it's users.

Registry layer talks with Sunbird RC for issuing certificates so we have the following terminonologies for it as follows:

- Did/Id - A Decentralized Identity for each entity that is generared in Sunbird
- Schema - A Schema is the skeleton i.e the structure of a certificate, it contains all the properties of a certificate like the fields the certificate will have and the W3C Context it follows. A Schema also has it's did which is required to issue VC
- Verifiable Credential/certificate - A VC or certificate is a W3C Standard certificate with some properties/fields defining the purpose of it, this certificate can be a Degree, Result, Driving License or anything.
- Template - A Template is a visual representation of a VC. It is a HTML Defined template that contains the design, content & fields for the VC. This can be modified and requires the Schema did for serving the required fields.

Now that we've defined all the terminonologies, we can proceed ahead and see the complete flow of how the institution can issue a certificate to it's students.

### 1. Generate a user did
Each action in Registry service is initiated by a user, and so the user requires it's own did. In this case a teacher will be the user and the institute will generate the teacher's did.

```http
  POST /api/v1/registry/did
```
Request body: 
| Key        | Type     | Description                   |
| :---------- | :------- | :---------------------------- |
| `didDetails`| `object` | Details of the DID issuer. Contains: <br>- `fullName`: Full name of the issuer. <br>- `email`: Email of the issuer. |
| `organization`| `string`| Name of the organization.    |

Response body: 
```
[
    {
        "@context": [
            "https://www.w3.org/ns/did/v1"
        ],
        "id": "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6",
        "alsoKnownAs": [
            "Bhaskar Kaura",
            "bhaskar.kaura@thewitslab.com"
        ],
        "verificationMethod": [
            {
                "id": "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6#key-0",
                "type": "Ed25519VerificationKey2020",
                "@context": "https://w3id.org/security/suites/ed25519-2020/v1",
                "controller": "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6",
                "publicKeyMultibase": "z6MkrgFL6x5LfmZM64eMDh7GjJeWt775jFLXpWWxkHsG4m22"
            }
        ],
        "authentication": [
            "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6#key-0"
        ],
        "assertionMethod": [
            "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6#key-0"
        ]
    }
]
```

The output will return an id key for the vc along with some other details, but we'll take only id in focus.

### 2. Define a schema for VC
Now that we've got user did, it's time to make a schema for the VC. This schema will have all the properties for the VC. Below is a W3C Standard schema for a Skill certificate.
institution has to setup the properties to be shown in the certificate. We'll again focus on the id of the schema that we'll get in the response body below.

```http
  POST /api/v1/registry/credential-schema
```
Request body: 
```
{
   "schema": {
       "type": "https://w3c-ccg.github.io/vc-json-schemas/",
       "version": "1.0.0",
       "name": "Skill Credential",
       "author": "did:WitsInnovationLabs:cb9c22a7-8275-4c25-91cb-82317564ba68",
       "authored": "2024-02-27T09:22:23.064Z",
       "schema": {
           "$id": "Skill-Credential-1.0",
           "$schema": "https://json-schema.org/draft/2019-09/schema",
           "description": "This certificate is skill certificate that reflects that the indiviual has learned this skill.",
           "type": "object",
           "properties": {
               "studentName": {
                   "type": "string"
               },
                "skillName": {
                   "type": "string"
               },
               "issuedDate": {
                 "type": "string"
               },
               "instituteName": {
                 "type": "string"
               }
           },
           "required": [
               "studentName", "skillName", "issuedDate", "instituteName"
           ],
           "additionalProperties": true
       }
   },
   "tags": [
       "skillCertificate", "student-skill-certificate"
   ],
   "status": "DRAFT"
}
```

Response body: 
```
{
    "schema": {
        "type": "https://w3c-ccg.github.io/vc-json-schemas/",
        "id": "did:schema:d4fdb6c5-c422-4ee2-8269-c08eb209e27a",
        "version": "1.0.0",
        "name": "Skill Credential",
        "author": "did:WitsInnovationLabs:cb9c22a7-8275-4c25-91cb-82317564ba68",
        "authored": "2024-02-27T09:22:23.064Z",
        "schema": {
            "$id": "Skill-Credential-1.0",
            "$schema": "https://json-schema.org/draft/2019-09/schema",
            "description": "This certificate is skill certificate that reflects that the indiviual has learned this skill.",
            "type": "object",
            "properties": {
                "studentName": {
                    "type": "string"
                },
                "skillName": {
                    "type": "string"
                },
                "issuedDate": {
                    "type": "string"
                },
                "instituteName": {
                    "type": "string"
                }
            },
            "required": [
                "studentName",
                "skillName",
                "issuedDate",
                "instituteName"
            ],
            "additionalProperties": true
        }
    },
    "tags": [
        "skillCertificate",
        "student-skill-certificate"
    ],
    "status": "DRAFT",
    "createdAt": "2024-04-23T18:02:27.158Z",
    "updatedAt": "2024-04-23T18:02:27.158Z",
    "deletedAt": null,
    "createdBy": null,
    "updatedBy": null
}
```

The output will return an id key for the schema along with some other details like the properties that we entered, but we'll take only id in focus.

### 3. Create a visual template for the certificate
In order to show a visual document of the certificate, the institution has to make a html template of how the certificate will look, this template will contain the schema details as well the schema properties of the certificate. This template will also have a QR Code to verify the VC. The template will return output certificate as pdf file. Institution will enter html template in the below request.

```http
  POST /api/v1/registry/credential-template
```
Request body: 
```
{
    "schemaId": "did:schema:d4fdb6c5-c422-4ee2-8269-c08eb209e27a",
    "schemaVersion": "1.0.0",
    "template": "<html lang='en'> <head> <meta charset='UTF-8' /> <meta http-equiv='X-UA-Compatible' content='IE=edge' /> <meta name='viewport' content='width=device-width, initial-scale=1.0' /> <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script> <link rel='stylesheet' href='style.css' /> <title>Skill Certificate</title> </head> <body> <div style='text-align:center; margin: auto; width: 100%; border: 3px solid black; padding: 10px;'> <div> <img class='logo' src='https://uam-cdn.nextlevel.app/create-company/0b681b94-6984-4313-a218-927919b20045-1692257899' alt='' /><br /><span class='certification'>This Certificate</span><br /><br /><span class='certify'><i>is hereby awarded to</i></span><br /><br /><span class='name'><b>{{studentName}}, student of {{instituteName}}</b></span><br /><br /><span class='certify'><i>for successfully acheiving the</i></span><br /><br /><span class='fs-30 diploma'>hands on skill in Docker on {{issuedDate}}</span><br /><br /><span class='fs-20 thank'>Thank you for demonstrating the type of character and integrity that inspire others</span><br /> <div class='footer'> <div class='qr'>{{instituteName}}</div> <img class='qrcode' src='{{qr}}' height=128></img> </div> </div> </div> </body> <style>*{margin:1px;padding:0;box-sizing:border-box}.outer-border{width:80vw;padding:10px;text-align:center;border:10px solid #252F50;font-family:'Lato', sans-serif;margin:auto}.inner-dotted-border{padding:10px;text-align:center;border:2px solid #252F50}.logo{width:75px}.certification{font-size:50px;font-weight:bold;color:#252F50;font-family:\"Times New Roman\", Times, serif}.certify{font-size:20px;color:#252F50}.diploma{color:#252F50;font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.name{font-size:30px;color:#252F50;border-bottom:1px solid;font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.thank{color:#252F50}.fs-30{font-size:30px}.fs-20{font-size:20px}.footer{display:flex;justify-content:space-between;margin:0 4rem}.date{display:flex;align-self:flex-end}.date>.fs-20{font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.qr{margin-top:1.25rem;display:flex;justify-content:end;margin-left:0.75rem;margin-right:0.75rem}.sign{border-top:1px solid;align-self:flex-end} .qrcode{margin-top:36}</style></html>",
    "type": "certificate"
}
```

Response body: 
```
{
    "template": {
        "templateId": "clvcpbait000in33zq622jwzm",
        "schemaId": "did:schema:d4fdb6c5-c422-4ee2-8269-c08eb209e27a",
        "template": "<html lang='en'> <head> <meta charset='UTF-8' /> <meta http-equiv='X-UA-Compatible' content='IE=edge' /> <meta name='viewport' content='width=device-width, initial-scale=1.0' /> <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script> <link rel='stylesheet' href='style.css' /> <title>Skill Certificate</title> </head> <body> <div style='text-align:center; margin: auto; width: 100%; border: 3px solid black; padding: 10px;'> <div> <img class='logo' src='https://uam-cdn.nextlevel.app/create-company/0b681b94-6984-4313-a218-927919b20045-1692257899' alt='' /><br /><span class='certification'>This Certificate</span><br /><br /><span class='certify'><i>is hereby awarded to</i></span><br /><br /><span class='name'><b>{{studentName}}, student of {{instituteName}}</b></span><br /><br /><span class='certify'><i>for successfully acheiving the</i></span><br /><br /><span class='fs-30 diploma'>hands on skill in Docker on {{issuedDate}}</span><br /><br /><span class='fs-20 thank'>Thank you for demonstrating the type of character and integrity that inspire others</span><br /> <div class='footer'> <div class='qr'>{{instituteName}}</div> <img class='qrcode' src='{{qr}}' height=128></img> </div> </div> </div> </body> <style>*{margin:1px;padding:0;box-sizing:border-box}.outer-border{width:80vw;padding:10px;text-align:center;border:10px solid #252F50;font-family:'Lato', sans-serif;margin:auto}.inner-dotted-border{padding:10px;text-align:center;border:2px solid #252F50}.logo{width:75px}.certification{font-size:50px;font-weight:bold;color:#252F50;font-family:\"Times New Roman\", Times, serif}.certify{font-size:20px;color:#252F50}.diploma{color:#252F50;font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.name{font-size:30px;color:#252F50;border-bottom:1px solid;font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.thank{color:#252F50}.fs-30{font-size:30px}.fs-20{font-size:20px}.footer{display:flex;justify-content:space-between;margin:0 4rem}.date{display:flex;align-self:flex-end}.date>.fs-20{font-family:\"Lucida Handwriting\", \"Comic Sans\", cursive}.qr{margin-top:1.25rem;display:flex;justify-content:end;margin-left:0.75rem;margin-right:0.75rem}.sign{border-top:1px solid;align-self:flex-end} .qrcode{margin-top:36}</style></html>",
        "type": "certificate",
        "createdAt": "2024-04-23T18:10:09.797Z",
        "updatedAt": "2024-04-23T18:10:09.797Z",
        "createdBy": null,
        "updatedBy": null
    },
}
```

The output will return an templateId key for the template that we'll use to render the visual pdf of the certificate.

### 4. Issue the Verifiable Credential/Certificate
Great so far, now it's the time to generate the actual Certificate for the skill. We'll use the teacher's did, schema's did, templateId in this step to issue a VC. We'll also require the details of the student's wallet here so that the institution can push the certificate to the student's wallet. For this, registry communicates with the wallet service. Let's start now.

```http
  POST /api/v1/registry/credentials/issue
```
Request body: 
```
{
    "issuerId": "did:WitsInnovationLabs:cb9c22a7-8275-4c25-91cb-82317564ba68", // This is the issuerId of the issuer who is going to issuee
    "credentialReceiver": {
        "walletId": "wallet_633a3df0-9bdb-4325-8203-972a777cd76a", // Student walletId
        "vcName": "Bhaskar WitsLab Skill Certificate",
        "category": "WitsLab Skill Certificate",
         "tags": [
            "VerifiableCredential",
            "skillCredentials"
        ]
    },
    "credential": {
        "context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            {
                "@context": {
                    "@version": 1.1,
                    "@protected": true,
                    "id": "@id",
                    "type": "@type",
                    "schema": "https://schema.org/",
                    "skillCredentials": {
                        "@id": "did:skillCredentials",
                        "@context": {
                            "@version": 1.1,
                            "@protected": true,
                            "id": "@id",
                            "type": "@type",
                            "studentName": "schema:text",
							"courseName": "schema:text",
              							"instituteName": "schema:text",
                            	"issuedDate": "schema:text"
                        }
                    }
                }
            }
        ],
        "templateId": "clvcpbait000in33zq622jwzm", // The visual template of the certificate 
        "credentialIconUrl": "URL_OF_THE_ICON", // Icon of the Verifiable Credential
        "schemaId": "did:schema:d4fdb6c5-c422-4ee2-8269-c08eb209e27a", // This is the schema id of the credential that is to be issued
        "schemaVersion": "1.0.0", // This is the schema id of the credential that is to be issued
        "expirationDate": "2024-12-31T11:56:27.259Z", // The expiration date of certificate
        "organization": "Wits", // Name of the institute
        "credentialSubject": { // the Data to be shown in the credential, the fields in side this depends on the credentialType
            "id": "did:Wits", // Organization name in id
            "type": "skillCredentials", // The Type of document, This needs to be same as any of the type in the type list below
            "studentName": "Bhaskar Kaura",
            "skillName": "Docker",
            "instituteName": "Wits Lab institute",
            "issuedDate": "23 April, 2024"
        },
        "type": [
            "VerifiableCredential",
            "skillCredentials"
        ],
        "tags": [
            "tag1",
            "tag2",
        ]
    }
}
```

Response body: 
```
{
    "credential": {
        "id": "did:Wits:19bd0a0a-787b-43a3-869d-371e3bd753b6",
        "type": [
            "VerifiableCredential",
            "skillCredentials"
        ],
        "proof": {
            "type": "Ed25519Signature2020",
            "created": "2024-02-08T16:56:14.082Z",
            "proofValue": "eyJhbGciOiJFUzI1NksifQ.IntcInZjXCI6e1wiQGNvbnRleHRcIjpbXCJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MVwiLFwiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjFcIl0sXCJ0eXBlXCI6W1wiVmVyaWZpYWJsZUNyZWRlbnRpYWxcIixcIkluc3VyYW5jZUNyZWRlbnRpYWxcIl0sXCJjcmVkZW50aWFsU3ViamVjdFwiOntcInR5cGVcIjpcIkluc3VyYW5jZUNyZWRlbnRpYWxcIixcImdlbmRlclwiOlwiTWFsZVwiLFwicG9saWN5TmFtZVwiOlwicG9saWN5MVwiLFwicG9saWN5TnVtYmVyXCI6XCIxMjM0NTY3XCIsXCJmdWxsTmFtZVwiOlwiTmFtZVwiLFwiZG9iXCI6XCIwMS0wMS0yMDAwXCIsXCJleHBpcmVzT25cIjpcIjMxLTEyLTIwMjRcIn19LFwib3B0aW9uc1wiOntcImNyZWF0ZWRcIjpcIjIwMjQtMDItMDhUMjI6MTk6MzZaXCIsXCJjcmVkZW50aWFsU3RhdHVzXCI6e1widHlwZVwiOlwiUmV2b2NhdGlvbkxpc3QyMDIwU3RhdHVzXCJ9fSxcInN1YlwiOlwiMS0yNjE5Mzk2Mi1iYjE2LTQ2MGEtYjQ0Ni01YzVmOWNhNDE1YmVcIixcImp0aVwiOlwiZGlkOnJjdzoxOWJkMGEwYS03ODdiLTQzYTMtODY5ZC0zNzFlM2JkNzUzYjZcIixcIm5iZlwiOjE3MDc0MTEzNzQsXCJleHBcIjoxNzM1NjQ2MTg3LFwiaXNzXCI6XCJkaWQ6aW5zdXJhbmNlMTpmNDdlNGQ4NS0zMTgzLTQzYjUtOTA5Zi1iODBkZDA3ZThjYmJcIn0i.HG8jBsH8VWt-qMpgzocfyl1kVZ6FAylG4T5iaEO5vFIUjIihJLdEopKmeeVQATZhvsxXu3dmUPDCh9Ajb1Le2A",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:WitsLab:1c178e06-fa74-44a6-b848-ad1028db3bd6"
        },
        "issuer": "did:WitsLab:b607a382-9c2d-4aa9-be27-dd6c2b1dd103",
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "issuanceDate": "2024-02-08T16:56:14.038Z",
        "expirationDate": "2024-12-31T11:56:27.259Z",
        "credentialSubject": {
        "studentName":"Bhaskar kaura",
            "skillName": "Docker",
        }
    },
    "credentialReceiver": {
        "email": "bhaskar.kaura@thewitslab.com",
        "phone": "+919877253751"
    },
    "credentialSchemaId": "did:schema:d4fdb6c5-c422-4ee2-8269-c08eb209e27a",
    "createdAt": "2024-04-24T16:56:14.084Z",
    "createdBy": "",
    "updatedBy": "",
    "tags": [
        "tags1", "tags2"
    ]
}
```

The Certificate is successfully generated. We've got a id key for the certificate in the response body.

### 5. View the Certificate Output (pdf)
Our Certificate is finally issued, we can now see the pdf/document output of our issued certificate. Here we require the vc id and the templateId for the certificate to render the certificate.

```http
  GET /api/v1/registry/credentials/{VERIFIABLE_CREDENTIAL_ID}
```
Query params: 
| Key        | Type     | example                   |
| :---------- | :------- | :---------------------------- |
| `Accept`| `string` | `application/pdf` | 
| `templateId`| `string` | `clvcpbait000in33zq622jwzm` | 

Response body: 
```
{
The output is a pdf file of the certificate
}
```

The output document will contain all the stored properties/fields of the certificate

### 6. Verify the Certificate
Our Certificate is finally issued, it's the time to verify whether it's real or not. The request will return us a message about the truthfulness of the certificate. This request endpoint will be hit the the verifier or someone viewing the certificate scans the QR code.

```http
  GET /api/v1/registry/credentials/{VERIFIABLE_CREDENTIAL_ID}/verify
```
Path params: 
| Key        | Type     | example                   |
| :---------- | :------- | :---------------------------- |
| `VERIFIABLE_CREDENTIAL_ID`| `string` | `did:Wits:19bd0a0a-787b-43a3-869d-371e3bd753b6` | 

Response body: 
```
{
  success: true,
  message: 'This Verifiable Credential is issued & valid.'
}
```

The Certificate is verified whether it's true or not. The viewer can understand the result the returned message. If the certificate is fake, the success will return false and the message will state that the certificate does the exist.


## API Documentation
To view the Swagger API Docs for the service, you can start the service and hit
```/api/v1/```. This will open the proper API Documentation of this service.


## Service Modules
This service follows Nest Js framework and the code structure for it. Each feature is divided into a separate module, then each module communicates with one another, seamlessly. The services inside Module is divided into CRUD Services - Create Service, Read Service, Update Service, Delete Service, keeping the code shorter and reusable.

### Main
The main module is the heart of the Nest js service and includes the dependencies and configs of the whole service.

### Registry
The registry module is responsible for managing CRUD operations of a VC by communicating with Sunbird RC using HTTP Requests.
``` 
src/registry 
```

## Configuration

System setup revolves around environment variables for ease of configuration. Key points include database settings, authentication parameters, and logging specifics. The `.env.example` file lists all necessary variables.

```bash
REGISTRY_SERVICE_URL=
SUNBIRD_IDENTITY_SERVICE_URL=
SUNBIRD_VC_SERVICE_URL=
SUNBIRD_SCHEMA_SERVICE_URL=
FILE_STORE_LOCAL_PATH=
WALLET_SERVICE_URL=
```

## Deployment

Deploying the Registry service can be achieved through:

- **Docker**: Create a Docker image and launch your service.
- **Kubernetes**: Use Kubernetes for scalable container management.
- **CI/CD**: Automate deployment with CI/CD tools like Jenkins, GitLab CI, or GitHub Actions.

## Contributing

Contributions are welcomed! Please follow these steps to contribute:

#### 1. Fork the project.
#### 2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
#### 3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
#### 4. Push to the branch (`git push origin feature/AmazingFeature`).
#### 5. Open a pull request.

## License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md) for more information.

## Acknowledgments

- Kudos to all contributors and the NestJS community.
- Appreciation for anyone dedicating time to enhance open-source software.
