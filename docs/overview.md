# Overiew

**Work in Progress!**

GAIA helps manage the lifecycle of terraform deployments stored in AWS CodeCommit.

### Key Features 

- π terraform version selection
- π§Ή terraform linting
- π static code analysis
- πΊοΈ terraform plan capture
- π terraform state visualization
- β terraform apply capture
- π user action tracking


### Vocabulary 

- **Projects** - reference to an AWS CodeCommit repo and where in the repo terraform should be running.

- **Jobs** - staged execution of the given project via terraform.