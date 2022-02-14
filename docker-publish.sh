package_version=$(jq -r .version package.json)

docker push dialectlab/monitoring-service:"$package_version"
docker push dialectlab/monitoring-service:latest