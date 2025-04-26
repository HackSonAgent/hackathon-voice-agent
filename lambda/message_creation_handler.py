from datetime import datetime
import psycopg2
import boto3

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''

AWS_REGION = "us-west-2"  # e.g., 'us-east-1', 'us-west-2', etc.
AGENT_ID = "H4I1KUGNCW"  # Replace with your Agent's ID
AGENT_ALIAS_ID = "XJ83BFUVST"  # Replace with your Agent's Alias ID (often TSTALIASID for draft)

try:
    bedrock_agent_runtime_client = boto3.client('bedrock-agent-runtime',
                                                region_name=AWS_REGION)
except Exception as e:
    raise e


def parse_flow_opt(event):
    node_name = event['nodeName']
    return event['content']['document'] if 'FlowOutputNode_2' else ''


def invoke_rag_flow(prompt):

    try:
        # Invoke the agent
        response = bedrock_agent_runtime_client.invoke_flow(
            flowIdentifier=AGENT_ID,
            flowAliasIdentifier=AGENT_ALIAS_ID,
            inputs=[
                {
                    'content': {
                        'document': prompt
                    },
                    "nodeName": "FlowInputNode",
                    "nodeOutputName": "document"
                },
            ],
            enableTrace=
            False  # Set to True to get detailed trace information (optional)
        )

        # Handle the streaming response
        completion = ""
        response_stream = response.get('responseStream')

        if not response_stream:
            print("Error: No completion stream found in the response.")
            return None

        print("Agent Response:")
        for event in response_stream:
            if 'chunk' in event:
                data = event['chunk']['bytes']
                chunk_text = data.decode('utf-8')
                print(chunk_text, end="")  # Print chunks as they arrive
                completion += chunk_text
            elif 'trace' in event:
                # You can process trace information here if enableTrace=True
                # print(json.dumps(event['trace'], indent=2))
                pass
            elif 'attribution' in event:
                # You can process citation/attribution information here if available
                # print("\n\n-----Attribution-----")
                # print(json.dumps(event['attribution'], indent=2))
                pass
            elif 'flowOutputEvent' in event:
                completion += parse_flow_opt(event['flowOutputEvent'])
            else:
                print(f"\nWarning: Received unknown event type: {event}")

        print("\n--- End of Agent Response ---")
        return completion  # Return the full concatenated response

    except boto3.exceptions.Boto3Error as e:
        print(f"AWS API Error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def lambda_handler(event, context):

    content = event.get("content")
    conversation_id = event.get("conversationId")
    try:

        now = datetime.utcnow()
        conn = psycopg2.connect(host=DB_HOST,
                                database=DB_NAME,
                                user=DB_USER,
                                password=DB_PASS,
                                port=DB_PORT)
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO message (conversation_id, username, content, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
        cursor.execute(insert_query,
                       (conversation_id, 'A001', content, now, now))
        human_msg_id = cursor.fetchone()[0]

        # Invoke bedrock
        answer = invoke_rag_flow(content)
        cursor.execute(insert_query,
                       (conversation_id, '0000', answer, now, now))
        ai_msg_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        human_message = {
            "id": human_msg_id,
            "username": "A001",
            "content": content,
            "voice": None,
            "createdAt": now.isoformat()
        }
        ai_message = {
            "id": ai_msg_id,
            "username": "0000",
            "content": answer,
            "voice": "https://example.com/audio/voice-message-12345.mp3",
            "createdAt": now.isoformat()
        }
        result = [human_message, ai_message]
        return result
    except Exception as e:
        raise e


print(
    lambda_handler(
        {
            'content':
            '保健:   可推薦商品類別: 強化靈活關節, 眼睛保健, 腸胃保健   是否有高健康意識: 是  基本類別:   居住縣市: 台北市文山區   年齡區間: 60-69   性別: 女   星座: 天蠍座   會員年資分組: 10年以上-15年以下   會員等級: B級會員  寵物:   寵物類型: 狗   有無養寵物: 有  旅遊:   旅遊國家偏好: 日韓, 歐美   有無旅遊偏好: 有  生活:   有無生活用品偏好: 有  美容:   有無美容偏好: 有   美妝保養類型偏好: 護膚SPA  食品:   是否曾買過素食: 是   有無食品偏好: 有',
            'conversationId': 1
        }, None))
