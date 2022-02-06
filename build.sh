echo 'make sure you have jq installed and run docker login before running'

package_version=$(jq -r .version package.json)

docker build --secret id=github,src="$HOME"/.npmrc . \
  -t dialectlab/monitoring-service:"$package_version" \
  -t dialectlab/monitoring-service:latest

docker push dialectlab/monitoring-service:"$package_version"
docker push dialectlab/monitoring-service:latest