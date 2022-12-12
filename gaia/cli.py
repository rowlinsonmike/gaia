import typer
from dotenv import load_dotenv
import os
import json 
import subprocess
import os, shutil
import re
from utils.db import db
import secrets

drawiocsv = [
"# label: %step%",
"# style: shape=%shape%;fillColor=%fill%;strokeColor=%stroke%;",
"# namespace: csvimport-",
'# connect: {"from":"refs", "to":"id", "invert":true, "style":"curved=0;endArrow=blockThin;endFill=1;"}',
"# width: auto",
"# height: auto",
"# padding: 15",
"# ignore: id,shape,fill,stroke,refs",
"# nodespacing: 40",
"# levelspacing: 100",
"# edgespacing: 40",
"# layout: horizontalflow",
"## CSV starts under this line",
"id,step,fill,stroke,shape,refs"
]

app = typer.Typer()


@app.callback()
def callback():
    """
    Gaia
    """

@app.command()
def scan(
    id: str = typer.Option(""),
    project: str = typer.Option(""),
):
  conn = db()
  conn.put_doc(id,"JOB",status="scanning")
  pro = conn.get_doc(project,"PRO")
  repo = pro["repo"]
  output_p = os.path.join("/gaia_data", id)
  repo_d = os.path.join(output_p,'repo')
  pro_p = os.path.join(repo_d, pro["path"]) if pro["path"] else repo_d
  if not os.path.exists(output_p):
    os.mkdir(output_p)
    subprocess.run(['git','clone',f'codecommit://{repo}', repo_d], stdout=subprocess.PIPE)
    #terraform init
    result = subprocess.run(['terraform','init'], cwd=pro_p, stdout=subprocess.PIPE)
  else:
    subprocess.run(['git','pull'],cwd=pro_p, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  #tflint
  result = subprocess.run(['tflint','--format','json', pro_p], stdout=subprocess.PIPE)
  tflint_d = json.loads(result.stdout)
  with open(os.path.join(output_p,'tflint.json'),'w') as f:
    json.dump(tflint_d,f)
  #kics
  result = subprocess.run(['kics','scan','-p', pro_p, '-o', output_p], stdout=subprocess.PIPE)
  #terraform plan
  ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
  plan_output = os.path.join(repo_d,'tf.plan')
  result = subprocess.run(['terraform','plan','-compact-warnings',f'-out={plan_output}'], cwd=pro_p, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  if result.stderr:
    with open(os.path.join(output_p,'terraform_plan.txt'),'w') as f:
      f.write(ansi_escape.sub('', str(result.stderr.decode())))
  else:
    with open(os.path.join(output_p,'terraform_plan.txt'),'w') as f:
      f.write(ansi_escape.sub('', str(result.stdout.decode())))
  #drawio chart
  result = subprocess.run(['terraform','graph'], cwd=pro_p, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  f = open(os.path.join(output_p,'drawiocsv'), 'w') 
  for l in drawiocsv:
    f.write(l + "\n")
  lines = []
  for i in result.stdout.decode().split("\n"):
      if '->' in i and 'root" -> "[root] provider' not in i:
          v = i.strip()
          pat = "\[root\]|\"|\(expand\)|\s"
          v = re.sub(pat,'',i).replace("(close)","").replace("\\","").split('->')
          lines.append(v)
  data = {}
  for s,d in lines:
    d_id = data[d]['id'] if d in data else secrets.token_urlsafe() 
    s_id = data[s]['id'] if s in data else secrets.token_urlsafe() 
    if s not in data:
      data[s] = {"id":s_id,'name':s,'rels':[]}
    if d not in data:
      data[d] = {"id":d_id,'name':d,'rels':[]}
    data[s]['rels'].append(d_id)
  for o in data.values():
    if not len(o["rels"]):
      f.write("{},{},#dae8fc,#6c8ebf,rectangle,\n".format(o["id"],o["name"]))
    else: 
      f.write('{},{},#dae8fc,#6c8ebf,rectangle,"{}"\n'.format(o["id"],o["name"],",".join(o["rels"])))
  f.close()
  conn.put_doc(id,"JOB",status="scanned") 

@app.command()
def apply(
      id: str = typer.Option(""),
      project: str = typer.Option(""),
):
    conn = db()
    conn.put_doc(id,"JOB",status="applying")
    pro = conn.get_doc(project,"PRO")
    output_p = os.path.join("/gaia_data", id)
    repo_d = os.path.join(output_p,'repo')
    pro_p = os.path.join(repo_d, pro["path"]) if pro["path"] else repo_d
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    #apply repo
    result = subprocess.run(['terraform','apply','-auto-approve','tf.plan'], cwd=pro_p, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    if result.stderr:
      with open(os.path.join(output_p,'terraform_apply.txt'),'w') as f:
        f.write(ansi_escape.sub('', str(result.stderr.decode())))
    else:
      with open(os.path.join(output_p,'terraform_apply.txt'),'w') as f:
        f.write(ansi_escape.sub('', str(result.stdout.decode())))
    conn.put_doc(id,"JOB",status="complete") 

@app.command()
def clean(
      id: str = typer.Option(""),
):
  shutil.rmtree(os.path.join('/gaia_data',id))


if __name__ == "__main__":
    load_dotenv()
    app()