# FAQ

#### Can I use GAIA if my terraform requires user input at the command line? 

No

#### Can I use GAIA for any repos not in AWS CodeCommit? 

No

#### Why doesn't the "Copy Graph" button work?

You need to either be running GAIA from localhost or over HTTPS. More on this [here](https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined). Easy way get HTTPS would be to put GAIA behind an AWS ALB.
