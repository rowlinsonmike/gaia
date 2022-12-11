# Installation

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