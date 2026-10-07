from workers import asgi
from server import app

Default = asgi.entrypoint(app)
