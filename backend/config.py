import os
from dotenv import load_dotenv

import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
print("DATABASE_URL:", DATABASE_URL)