docker login
nicipbd

docker pull nicsipbd/superset:new3
docker pull nicsipbd/node:latest
docker pull nicsipbd/node:20.16.0
docker pull nicsipbd/postgres:15
docker pull nicsipbd/nginx:latest
docker pull nicsipbd/superset-websocket:latest
docker pull nicsipbd/redis:7

docker-compose -f docker-compose.yml up --build

for creat build or setup
docker build -t nicsipbd/pragyanlocal:2.0 .
docker login
docker push nicsipbd/pragyanlocal:2.0