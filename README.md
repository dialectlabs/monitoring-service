# Monitoring service

A reference implementation of a service running `@dialectlabs/monitor`.
See https://github.com/dialectlabs/monitor for details on the notifications module.

## Development

### Prerequisites

- Git
- Yarn (<2)
- Nodejs (>=16.10.0 <17)

### Getting started with monitor development in this repo

#### Install dependencies

**npm:**

```shell
npm install
```

**yarn:**

```shell
yarn
```

#### Run a solana validator node with dialect program

Please follow the instructions in https://github.com/dialectlabs/protocol#local-development

### Running locally

#### Step 1. Generate a new keypair for monitoring monitoring service and fund it

```bash
export your_path=~/projects/dialect
solana-keygen new --outfile ${your_path}/monitoring-service-dev-local-key.json
solana-keygen pubkey ${your_path}/monitoring-service-dev-local-key.json > ${your_path}/monitoring-service-dev-local-key.pub
solana -k ${your_path}/monitoring-service-dev-local-key.json airdrop 5
```

#### Step 2. Start server

```shell
export your_path=~/projects/dialect
PRIVATE_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.json) yarn start:dev
```

#### Step 3. Start client

```shell
export your_path=~/projects/dialect
MONITORING_SERVICE_PUBLIC_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.pub) ts-node test/dialect-clients.ts
```

#### Step 4. Look at client logs for notifications

When both client and server are started, server will send notifications to clients

### Containerization

#### Build image (macOS)

```shell
brew install jq
./docker-build.sh
```

#### Run container locally

```shell
export your_path=~/projects/dialect
docker run --name dialectlabs_monitoring-service -e PRIVATE_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.json) dialectlab/monitoring-service:latest 
```

#### Publish image

```shell
brew install jq
docker login
./docker-publish.sh
```