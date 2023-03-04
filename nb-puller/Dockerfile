# syntax=docker/dockerfile:1
FROM python:3.11-bullseye
WORKDIR /app
RUN --mount=type=cache,target=/var/apt/cache \
    wget https://r.mariadb.com/downloads/mariadb_repo_setup \
    && echo "ad125f01bada12a1ba2f9986a21c59d2cccbe8d584e7f55079ecbeb7f43a4da4  mariadb_repo_setup" \
    | sha256sum -c - \
    && bash ./mariadb_repo_setup --mariadb-server-version="mariadb-10.6" \
    && apt-get update -yqq && apt-get install libmariadb3 libmariadb-dev -yqq 

RUN mkdir -p /root/.ssh/ && echo ' \
Host github.com\n\
    StrictHostKeyChecking no \n\
    UserKnownHostsFile=/dev/null \n\
    IdentitiesOnly yes \n\
    IdentityFile /git-keys/id_ed25519 \n\
' > /root/.ssh/config && cat /root/.ssh/config

COPY requirements.txt .
RUN --mount=type=cache,target=/.pip-cache \
    pip install --upgrade pip && \
    pip install -v --cache-dir /.pip-cache -r requirements.txt
COPY pull-notebooks.py .
ENV CMD_STRING "python pull-notebooks.py"
ENV SLEEP_TIME 5
ENTRYPOINT ["./docker-entrypoint.sh"]
