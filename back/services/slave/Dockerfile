FROM condaforge/miniforge3:latest

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt

RUN conda create -n base_env python=3.10
RUN conda run -n base_env python --version
RUN conda run -n base_env /bin/bash -c "conda install pip"
RUN conda run -n base_env /bin/bash -c "pip install -r requirements.txt"

COPY . /usr/src/app

