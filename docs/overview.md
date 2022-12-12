# Overiew

**Work in Progress!**

GAIA helps manage the lifecycle of terraform deployments stored in AWS CodeCommit.

### Key Features 

- 🧹 terraform linting
- 🐛 static code analysis
- 🗺️ terraform plan capture
- 📊 terraform state visualization
- ✅ terraform apply capture
- 📍 user action tracking


### Vocabulary 

- **Projects** - reference to an AWS CodeCommit repo and where in the repo terraform should be running.

- **Jobs** - staged execution of the given project via terraform.