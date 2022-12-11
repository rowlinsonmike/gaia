import typer
from dotenv import load_dotenv
import os
import json 
import subprocess
import os, shutil
import re
from utils.db import db

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
  #mermaid chart
  graph_f = os.path.join(output_p,'graph.dot')
  result = subprocess.run(['terraform','graph'], cwd=pro_p, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  with open(os.path.join(output_p,'graph.mermaid'),'w') as d:
      lines = []
      for i in result.stdout.decode().split("\n"):
          if '->' in i and 'root" -> "[root] provider' not in i:
              v = i.strip()
              pat = "\[root\]|\"|\(expand\)|\s"
              v = re.sub(pat,'',i).replace('->','-->').replace("(close)","").replace("\\","")
              lines.append(f"{v}\n" )
      lines.append('graph TD\n')
      lines.reverse()
      d.writelines(lines)
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