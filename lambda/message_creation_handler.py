from datetime import datetime
import psycopg2
import boto3
import uuid
import numpy as np

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''

# Bedrock
AWS_REGION = "us-west-2"  # e.g., 'us-east-1', 'us-west-2', etc.
AGENT_ID = "H4I1KUGNCW"  # Replace with your Agent's ID
AGENT_ALIAS_ID = "XJ83BFUVST"  # Replace with your Agent's Alias ID (often TSTALIASID for draft)

# Polly
VOICE_ID = 'Zhiyu'  # Mandarin Chinese female voice
OUTPUT_FORMAT = 'pcm'  # raw audio format
SAMPLE_RATE = 16000  # 16kHz

# S3
BUCKET_NAME = "voice-agent-file"

# ---- INIT CLIENT ----
polly = boto3.client('polly', region_name=AWS_REGION)
s3 = boto3.client('s3', region_name=AWS_REGION)

try:
    bedrock_agent_runtime_client = boto3.client('bedrock-agent-runtime',
                                                region_name=AWS_REGION)
except Exception as e:
    raise e


def gen_voice(text):

    # ---- CALL POLLY ----
    response = polly.synthesize_speech(Text=text,
                                       OutputFormat=OUTPUT_FORMAT,
                                       VoiceId=VOICE_ID,
                                       SampleRate=str(SAMPLE_RATE))

    # ---- UPLOAD TO S3 ----
    audio_stream = response['AudioStream']
    filename = f"{uuid.uuid4()}.wav"
    s3.upload_fileobj(Fileobj=audio_stream, Bucket=BUCKET_NAME, Key=filename)

    # ---- GENERATE PUBLIC URL ----
    return f"https://d18bgxx0d319kq.cloudfront.net/{filename}"


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

        # Retrieve all history
        query = "SELECT * FROM message WHERE conversation_id = {} ORDER BY created_at ASC".format(
            conversation_id)
        cursor.execute(query)
        rows = cursor.fetchall()
        content_with_prompt = ''
        for row in rows:
            username = row[2]
            text = row[3]
            content_with_prompt += '{}: {}\n'.format(username, text)
        content_with_prompt += 'A001: content'

        # Invoke bedrock
        answer = invoke_rag_flow(content_with_prompt)
        print("Answer:", answer)
        # answer = '# 推薦產品清單\n\n## 1. 眼睛保健產品\n- **商品名稱**: 東森專利葉黃素滋養倍效膠囊\n- **售價**: 市價9900元（5盒），優惠方案18盒只要8910元（買9送9，平均一盒495元）\n- **主要功效**:\n  * 修復視神經、增強夜視功能\n  * 保濕眼球、舒緩乾澀\n  * 預防青光眼、白內障和黃斑部病變\n  * 抗藍光、抗紫外線保護\n- **特色成分**: 四國專利Lutemax®葉黃素、高濃度綠蜂膠、小分子玻尿酸\n- **適用人群**: 3C使用者、銀髮族、眼睛疲勞者、眼睛手術後保養\n\n## 2. 體重管理產品\n- **商品名稱**: 東森完美動能極孅果膠\n- **售價**: 市價1980元/盒（10包），優惠方案五盒只要1980元（買一送四）\n- **主要功效**:\n  * 增加飽足感，控制食慾\n  * 促進腸道蠕動，改善便秘\n  * 調控血糖吸收，減少脂肪囤積\n  * 可作為代餐（每包僅約78.3大卡）\n- **特色成分**: 魔芋萃取物、菊苣纖維、日本栗子種皮萃取物\n- **適用人群**: 想瘦身/控制體重者、便秘者、三餐不定時的上班族\n\n## 3. 美容養顏產品\n- 暫無詳細產品資料提供\n\n## 4. 護膚SPA服務\n- 暫無詳細服務資料提供\n\n您對哪項推薦產品有興趣？我可以提供更多相關資訊。'
        voice = gen_voice(answer)
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
            "voice": voice,
            "createdAt": now.isoformat()
        }
        result = [human_message, ai_message]
        return result
    except Exception as e:
        raise e