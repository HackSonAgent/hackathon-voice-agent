import json
import boto3


bedrock_runtime = boto3.client( 'bedrock-runtime', region_name='us-west-2')
prompt = "Write a one sentence summary of Taipei City."
arguments = {
    "modelId": "amazon.titan-text-lite-v1",
    "contentType": "application/json",
    "accept": "*/*",
    "body": json.dumps({"inputText": prompt})
}
response = bedrock_runtime. invoke_model(**arguments)
response_body = json.loads(response.get('body').read())
print(response_body)