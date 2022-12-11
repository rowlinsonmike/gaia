from flask import Flask,request,jsonify
import flask_praetorian
from app.utils import db
import flask_cors
import os
from rq import Queue
from rq.job import Job
import redis
import secrets

def create_app(config):

    guard = flask_praetorian.Praetorian()
    cors = flask_cors.CORS()
    app = Flask(__name__)

    #task queue
    r = redis.Redis(host=os.environ.get("REDIS_HOST"), port=os.environ.get("REDIS_PORT"))
    app.extensions["queue"] = Queue(connection=r)
    app.extensions["fetch_job"] = lambda x: Job.fetch(x,connection=r)
    
    # setup dynamo
    db.Dynamo(app)
    # create dynamo table if not exist
    db.DynamoTable(app).create_table()

    
    #setup user model
    class User():
        is_active = True
        def __init__(self,dynamo_user=[]):
            exists = len(dynamo_user) > 0
            self.username = dynamo_user["username"] if exists else None
            self.hash = dynamo_user["password"] if exists else None
            self.first = dynamo_user["first"] if exists else None
            self.last = dynamo_user["last"] if exists else None
            self.unique_id = dynamo_user["pk"] if exists else None
        @property
        def rolenames(self):
            return []
        @property
        def password(self):
            return self.hash
        @classmethod
        def lookup(cls, username):
            users = app.extensions["dynamo"].table.query(":USR")
            user = next(iter([u for u in users if u["username"] == username]),None)
            return cls(user)
        @classmethod
        def identify(cls, id):
            users = app.extensions["dynamo"].table.query(":USR")
            user = next(iter([u for u in users if u["username"] == id]),None)
            return cls(user)

        @property
        def identity(self):
            return self.username

        def is_valid(self):
            return self.is_active

    #guard setup 
    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
    app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
    app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
    guard.init_app(app, User)

    #create default user
    admin_id = secrets.token_urlsafe()
    users = app.extensions["dynamo"].table.query(":USR")
    user = next(iter([u for u in users if u["username"] == 'gaia']),None)
    if not user:
        app.extensions["dynamo"].table.load(f"{admin_id}:USR",username='gaia',first="gaia", last="admin",password=guard.hash_password("gaiaisawesome!"),data=admin_id)
    
    #routes
    from app.routes.main import main
    app.register_blueprint(main(guard), url_prefix='/api')
    
    # Initializes CORS so that the api_tool can talk to the example app
    cors.init_app(app)

    return app
            
    