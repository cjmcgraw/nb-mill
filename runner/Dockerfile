# syntax=docker/dockerfile:1
FROM python:3.10
WORKDIR /runner
COPY requirements.txt .
RUN --mount=type=cache,target=/pip_cache \
    pip install --cache-dir=/pip_cache -r requirements.txt
COPY do_work.py .

ENV CMD_STRING "python do_work.py"
COPY docker-entrypoint.sh .
ENTRYPOINT ["./docker-entrypoint.sh"]
