import json
import boto3
from pprint import pprint

bedrock_runtime = boto3.client( 'bedrock-runtime', region_name='us-west-2')
# client = boto3.client(service_name="bedrock", region_name="us-west-2")
# response = client.list_foundation_models()
# pprint(response)
prompt = "Write a one sentence summary of Taipei City."
arguments = {
    # 'modelId': "arn:aws:bedrock:us-west-2::foundation-model/meta.llama3-3-70b-instruct-v1:0",
    # 'modelId': 'meta.llama3-3-70b-instruct-v1:0',
    "modelId": "amazon.titan-text-lite-v1",
    "contentType": "application/json",
    "accept": "*/*",
    "body": json.dumps({"inputText": prompt})
}
response = bedrock_runtime. invoke_model(**arguments)
response_body = json.loads(response.get('body').read())
print(response_body)