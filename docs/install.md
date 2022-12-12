# Installation

### Prerequisites

Make sure you have credentials for the AWS Account where your CodeCommit repos are. 
GAIA makes use of [git-remote-codecommit](https://github.com/aws/git-remote-codecommit) for this. An Instance Profile attached to the EC2 instance will work as well.

### Deployment

1) Clone the repo

2) create an .env file in the root of the directory with the following content:

- SECRET_KEY - used to hash stored values in flask api
- AWS_DEFAULT_REGION - AWS operating region
- TERRAFORM_VERSION - Terraform version to be used by GAIA. The terraform version you include should be available via the following link - `https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip`

**Example .env file**

```
SECRET_KEY=SOMELONGSTRINGSHOULDGOHERE12345
AWS_DEFAULT_REGION=us-east-1
TERRAFORM_VERSION=1.2.3
```

3) From the root of the directory execute docker-compose
```bash
docker-compose -f prod-docker-compose.yml up d
```

4) ** If running on ubuntu server! ** 
From the root of the directory run the following **AFTER** bringing up with the compose file.
More on this [here](https://stackoverflow.com/questions/45850688/unable-to-open-local-dynamodb-database-file-after-power-outage)

```bash
sudo chmod 777 ./docker/dynamodb
```