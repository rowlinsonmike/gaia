# Overiew

**Work in Progress! Proceed at your own risk in production.**

GAIA helps manage the lifecycle of terraform deployments stored in AWS CodeCommit.

An output of a hackathon with a number of goals in mind.

- static code analysis
- review of terraform plan
- auditability
- simplicity 


> Vocabulary 

- Projects - point to an AWS CodeCommit repo and specify where in the repo terraform should be running.

- Jobs - a staged execution of the given project via terraform.

