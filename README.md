# Xplor - Registry Service
This service is responsible for creating, storing, deleting the Verifiable Credentials using Sunbird RC layer. The registry service interacts with Sunbird RC as to do VC related operations.

## Table of Contents

- [Working Demo](#working-demo)
- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Running tests](#running-tests)
- [Service Modules](#service-modules)
- [Configurations](#configurations)
- [Deployment](#deployment)
- [Contributing](#contributing)

## API Documentation
To view the Swagger API Docs for the service, you can start the service and hit
```{BASE_URL}/api/v1/```. This will open the proper API Documentation of this service.

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
