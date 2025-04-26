import psycopg2

DB_HOST = ''
DB_PORT = 5432
DB_NAME = ''
DB_USER = ''
DB_PASS = ''


def lambda_handler(event, context):

    try:
        conn = psycopg2.connect(host=DB_HOST,
                                database=DB_NAME,
                                user=DB_USER,
                                password=DB_PASS,
                                port=DB_PORT)
        cursor = conn.cursor()
        query = "SELECT * FROM conversation ORDER BY created_at DESC"
        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{
            'id': row[0],
            'name': row[1],
            'createdAt': row[2].isoformat(),
            'updatedAt': row[3].isoformat(),
        } for row in rows]
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {'message': str(e)}
