import libsql_client.dbapi2 as dbapi2
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("TURSO_DATABASE_URL")
token = os.getenv("TURSO_AUTH_TOKEN")

print(f"Connecting to {url}...")
try:
    conn = dbapi2.connect(url, auth_token=token)
    print("Connected.")
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    print(f"Result: {cursor.fetchone()}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
