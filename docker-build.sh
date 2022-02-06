package_version=$(jq -r .version package.json)

docker build --platform linux/amd64 --secret id=github,src="$HOME"/.npmrc . \
  -t dialectlab/monitoring-service:"$package_version" \
  -t dialectlab/monitoring-service:latest