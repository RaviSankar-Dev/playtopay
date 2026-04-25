import libsql_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("TURSO_DATABASE_URL")
token = os.getenv("TURSO_AUTH_TOKEN")

print(f"Connecting to {url}...")
try:
    client = libsql_client.create_client(url=url, auth_token=token)
    print("Client created.")
    res = client.execute("SELECT 1")
    print(f"Result: {res.rows}")
    client.close()
except Exception as e:
    print(f"Error: {e}")
