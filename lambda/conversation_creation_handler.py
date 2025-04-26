from datetime import datetime
import psycopg2

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''


def lambda_handler(event, context):

    try:
        now = datetime.utcnow()
        conn = psycopg2.connect(host=DB_HOST,
                                database=DB_NAME,
                                user=DB_USER,
                                password=DB_PASS,
                                port=DB_PORT)
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO conversation (name, created_at, updated_at)
            VALUES (%s, %s, %s)
            RETURNING id
        """
        cursor.execute(insert_query, ("新對話", now, now))
        new_convo_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()

        result = {
            "id": new_convo_id,
            "name": "新對話",
            "createdAt": now.isoformat(),
            "updatedAt": now.isoformat()
        }
        return result
    except Exception as e:
        raise e
