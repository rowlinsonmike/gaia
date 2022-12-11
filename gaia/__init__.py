import subprocess

def start_scan(id,pro):
    subprocess.run(['python3','/app/gaia/cli.py','scan','--id',id,'--project',pro], stdout=subprocess.PIPE)
    return id

def start_apply(id,pro):
    subprocess.run(['python3','/app/gaia/cli.py','apply','--id',id,'--project',pro], stdout=subprocess.PIPE)
    return id

def cleanup_job(id):
    subprocess.run(['python3','/app/gaia/cli.py','clean','--id',id], stdout=subprocess.PIPE)
    return id
