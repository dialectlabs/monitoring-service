## Installation

```bash
$ yarn
```

```

## Running the app

### generate a new keypair for monitoring monitoring service and fund it

```bash
export your_path=~/projects/dialect
solana-keygen new --outfile ${your_path}/monitoring-service-dev-local-key.json
solana-keygen pubkey ${your_path}/monitoring-service-dev-local-key.json > ${your_path}/monitoring-service-dev-local-key.pub
solana -k ${your_path}/monitoring-service-dev-local-key.json airdrop 300
```
### start server

```
export your_path=~/projects/dialect
PRIVATE_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.json) yarn start:dev
```

### start client

```
export your_path=~/projects/dialect
MONITORING_SERVICE_PUBLIC_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.pub) ts-node test/dialect-clients.ts
```

## Running the app in docker

### build image

1. brew install jq
2. run commands
```bash
./docker-build.sh
```

### run container locally
1. run commands
```bash
export your_path=~/projects/dialect
docker run --name dialectlabs_monitoring-service -e PRIVATE_KEY=$(cat ${your_path}/monitoring-service-dev-local-key.json) dialectlab/monitoring-service:latest 
```

### publish image

1. brew install jq
2. docker login
3. run commands
```bash
docker-publish.sh
```