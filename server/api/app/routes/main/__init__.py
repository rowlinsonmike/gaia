from flask import Blueprint
from flask import jsonify,request,current_app
import secrets
import os
import json
from datetime import datetime
import flask_praetorian
import traceback
import secrets

def current_user():
    return flask_praetorian.current_user().username

def created_by():
    return {"created_by":current_user()}

def main(guard):
    bp = Blueprint('main', __name__)
    @bp.route('/users', methods=['GET'])
    @flask_praetorian.auth_required
    def get_users():
        try:
            users = list(filter(lambda x: x["username"] != 'gaia',current_app.extensions["dynamo"].table.query(f":USR")))
            
            return jsonify(users=users),200
        except:
            return jsonify(error="unable to get users"),400
    @bp.route('/users/<id>', methods=['DELETE'])
    @flask_praetorian.auth_required
    def delete_user(id):
        try:
            current_app.extensions["dynamo"].table.delete(f"{id}:USR")
            return jsonify(id=id),200
        except:
            return jsonify(error="unable to delete user"),400
    @bp.route('/users', methods=['POST'])
    @flask_praetorian.auth_required
    def add_user():
        req = request.get_json(force=True)
        username = req.get('username', "")
        first = req.get('first', "")
        last = req.get('last', "")
        if username == 'gaia':
            return jsonify(error="gaia reserved"),400
        password = req.get('password', "") 
        id = req.get('id', secrets.token_urlsafe()) 
        current_app.extensions["dynamo"].table.load(f"{id}:USR",username=username,first=first,last=last,password=guard.hash_password(password),data=id,**created_by())
        return jsonify(id=id),200
    @bp.route('/users/reset', methods=['POST'])
    @flask_praetorian.auth_required
    def reset_pw():
        try:
            user = flask_praetorian.current_user()
            req = request.get_json(force=True)
            pw = req.get('password', "")
            user_id = user.unique_id
            current_app.extensions["dynamo"].table.update(f"{user_id}:USR",password=guard.hash_password(pw))
            return jsonify(success=True),200
        except:
            traceback.print_exc()
            return jsonify(error="Error resetting password"),401
    @bp.route('/login',methods=['POST'])
    def login():
        req = request.get_json(force=True)
        username = req.get('username', None)
        password = req.get('password', None) 
        user = guard.authenticate(username, password)
        custom_claims = {'first':user.first,'last':user.last}
        ret = {"access_token": guard.encode_jwt_token(user,**custom_claims)}
        return ret, 200
    @bp.route('/project',methods=['POST'])
    @flask_praetorian.auth_required
    def create_project():
        req = request.get_json(force=True)
        name = req["name"]
        repo = req["repo"]
        path = req["path"]
        now = datetime.now()
        date = now.strftime("%Y-%m-%d %H:%M:%S")
        id = secrets.token_urlsafe()
        current_app.extensions["dynamo"].table.update(f"{id}:PRO",data=id, date=date,name=name,repo=repo,path=path,**created_by())
        return jsonify(id=id),200
    @bp.route('/project/<id>',methods=['GET'])
    @flask_praetorian.auth_required
    def get_project(id):
        project = current_app.extensions["dynamo"].table.query(f"{id}:PRO")[0]
        jobs = current_app.extensions["dynamo"].table.query(f":JOB:{id}")
        return jsonify(project=project,jobs=jobs),200
    @bp.route('/project/<id>',methods=['DELETE'])
    @flask_praetorian.auth_required
    def delete_project(id):
        project = current_app.extensions["dynamo"].table.delete(f"{id}:PRO")
        return jsonify(success=True),200
    @bp.route('/project',methods=['GET'])
    @flask_praetorian.auth_required
    def list_projects():
        pros = current_app.extensions["dynamo"].table.query(f":PRO")
        return jsonify(projects=pros),200
    @bp.route('/scan/<pro>',methods=['POST'])
    @flask_praetorian.auth_required
    def scan(pro):
        req = request.get_json(force=True)
        name = req["name"]        
        now = datetime.now()
        create = now.strftime("%Y-%m-%d %H:%M:%S")
        id = secrets.token_urlsafe()
        current_app.extensions["dynamo"].table.update(f"{id}:JOB",create=create,name=name,data=pro, status="queued",**created_by())
        job = current_app.extensions["queue"].enqueue(
            "gaia.start_scan",
            job_timeout="1h",
            kwargs={'id': id, 'pro':pro}
        )
        return jsonify(id=id), 200
    @bp.route('/rescan/<pro>/<id>',methods=['POST'])
    @flask_praetorian.auth_required
    def rescan(pro,id):
        current_app.extensions["dynamo"].table.update(f"{id}:JOB",status="queued")
        job = current_app.extensions["queue"].enqueue(
            "gaia.start_scan",
            job_timeout="1h",
            kwargs={'id': id, 'pro':pro}
        )
        return jsonify(id=id), 200
    @bp.route('/job',methods=['POST'])
    @flask_praetorian.auth_required
    def run_job():
        """
        """
        id = request.args.get("id")
        job_d = current_app.extensions["dynamo"].table.query(f"{id}:JOB")[0]
        job_d["status"] = "queued"
        current_app.extensions["dynamo"].table.update(f"{id}:JOB", status="queued",applied_by=current_user())
        job = current_app.extensions["queue"].enqueue(
            "gaia.start_apply",
            job_timeout="1h",
            kwargs={'id': id, 'pro':job_d["data"]}
        )
        return jsonify(**job_d),200
    @bp.route('/job',methods=['DELETE'])
    @flask_praetorian.auth_required
    def delete_job():
        id = request.args.get("id")
        current_app.extensions["dynamo"].table.delete(f"{id}:JOB")
        job = current_app.extensions["queue"].enqueue(
            "gaia.cleanup_job",
            job_timeout="1h",
            kwargs={'id': id}
        )
        return jsonify(id=id),200
    @bp.route('/job',methods=['GET'])
    def job():
        """
        """
        id = request.args.get("id")
        job_d = current_app.extensions["dynamo"].table.query(f"{id}:JOB")[0]
        output_p = os.path.join("/gaia_data", id)
        # if job_d["status"] != "complete" or not os.path.isdir(output_p):
        #     return jsonify(**job_d),200
        try:
            with open(os.path.join(output_p,"drawiocsv")) as f:
                graph=f.read()
        except: 
            graph = None
        try:
            with open(os.path.join(output_p,"tflint.json")) as f:
                tflint = json.load(f)
        except: 
            tflint = None
        try:
            with open(os.path.join(output_p,"results.json")) as f:
                kics_d = json.load(f)
        except: 
            kics_d = None
        try:
            with open(os.path.join(output_p,"terraform_plan.txt")) as f:
                plan=f.read()
        except:
            plan = None
        try:
            with open(os.path.join(output_p,"terraform_apply.txt")) as f:
                apply=f.read()
        except:
            apply = None
        return jsonify(**job_d,graph=graph,tflint=tflint,kics=kics_d,plan=plan,apply=apply),200
    return bp
