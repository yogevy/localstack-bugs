# please run npm ci before running this script

export LOCALSTACK_API_KEY=xxxxxx
export DEFAULT_REGION=us-east-1
export AWS_DEFAULT_ACCOUNT=000000000000

if [ "$LOCALSTACK_API_KEY" = "" ]; then
  echo "Please set LOCALSTACK_API_KEY"
  exit 1
fi

echo "***** starting localstack container *****"
docker-compose --project-directory localstack-pro up -d

sleep 10

cdklocal bootstrap aws://000000000000/us-east-1


echo "***** deploy lambda *****"
serverless deploy --stage=local

echo "***** deploy lambda on second time with a change *****"
HANDLER_NAME=handler2 serverless deploy --stage=local
