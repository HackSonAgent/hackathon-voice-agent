from datetime import datetime
import psycopg2

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''


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
        cursor.execute(insert_query,
                       (conversation_id, '0000', '123', now, now))
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
            "content": '123',
            "voice": "https://example.com/audio/voice-message-12345.mp3",
            "createdAt": now.isoformat()
        }
        result = [human_message, ai_message]
        return result
    except Exception as e:
        raise e
