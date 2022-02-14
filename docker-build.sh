package_version=$(jq -r .version package.json)

docker build --platform linux/amd64 \
  -t dialectlab/monitoring-service:"$package_version" \
  -t dialectlab/monitoring-service:latest .