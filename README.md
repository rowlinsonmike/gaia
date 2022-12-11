<h1 align="center">
  <br>
  <a href="https://rowlinsonmike.github.io/gaia"><img src="https://raw.githubusercontent.com/rowlinsonmike/gaia/main/docs/assets/logo.svg" alt="GAIA" width="200"></a>
  <br>
  GAIA
  <br>
</h1>

<h4 align="center">Oversee your terraforming</h4>

## Documentation 

Read the docs [here](https://rowlinsonmike.github.io/gaia)

## How It Works

1. Clones your terraform repos on CodeCommit.
2. Uses [kics](https://github.com/Checkmarx/kics) to analyze your terraform.
3. Presents terrafrom plan and analysis data to you via a web app.
4. Runs terraform apply if approved via the web app

## Install

> Prerequisites

Make sure you have credentials for the AWS Account where your CodeCommit repos are. 
GAIA makes use of [git-remote-codecommit](https://github.com/aws/git-remote-codecommit) for this. An Instance Profile attached to the EC2 instance will work as well.

> Deployment

1) Clone the repo

2) create an .env file in the root of the directory with the following content

```
SECRET_KEY=SOMELONGSTRINGSHOULDGOHERE12345
```

3) From the root of the directory execute docker-compose
```bash
docker-compose -f prod-docker-compose.yml up d
```