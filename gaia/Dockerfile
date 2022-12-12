FROM checkmarx/kics:latest as kic_env

FROM python:3.9.0-slim-buster

WORKDIR /app

# install kics
COPY --from=kic_env /app/bin/kics /app/bin/kics
COPY --from=kic_env /app/bin/assets/queries /app/bin/assets/queries
COPY --from=kic_env /app/bin/assets/libraries/* /app/bin/assets/libraries/

ENV PATH="/app/bin:${PATH}"

# os installs 
RUN apt -qq update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq curl unzip wget git < /dev/null > /dev/null

# install gaia
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt --upgrade pip

# install tflint
RUN curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# Install Terraform and Terraform plugins
ARG TERRAFORM_VERSION
RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && mv terraform /usr/bin/terraform

