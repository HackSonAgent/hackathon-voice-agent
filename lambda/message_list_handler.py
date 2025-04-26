import psycopg2

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''


def lambda_handler(event, context):
    try:
        conversation_id = event['params']['path']['conversationId']
        conn = psycopg2.connect(host=DB_HOST,
                                database=DB_NAME,
                                user=DB_USER,
                                password=DB_PASS,
                                port=DB_PORT)
        cursor = conn.cursor()
        query = "SELECT * FROM message WHERE conversation_id = {} ORDER BY created_at DESC".format(
            conversation_id)
        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{
            'id': row[0],
            'username': row[2],
            'content': row[3],
            'createdAt': row[4].isoformat(),
            'updatedAt': row[5].isoformat(),
        } for row in rows]
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        raise e