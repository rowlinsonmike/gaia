<h1 align="center">
  <br>
  <a href="https://rowlinsonmike.github.io/gaia"><img src="https://raw.githubusercontent.com/rowlinsonmike/gaia/main/docs/assets/logo.svg" alt="GAIA" width="200"></a>
  <br>
  GAIA
  <br>
</h1>

<h4 align="center">Oversee your terraforming</h4>

## Documentation 

Read the docs for installation instructions and walkthrough [here](https://rowlinsonmike.github.io/gaia).

## Overview

GAIA helps manage the lifecycle of terraform deployments stored in AWS CodeCommit.

An output of a hackathon with a number of goals in mind.

- static code analysis
- review of terraform plan
- auditability
- simplicity 


> Vocabulary 

- Projects - reference to an AWS CodeCommit repo and where in the repo terraform should be running.

- Jobs - staged execution of the given project via terraform.

