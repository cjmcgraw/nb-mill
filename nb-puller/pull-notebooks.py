import itertools as i
import datetime as dt
import subprocess
import argparse
import pathlib
import logging
import sys
import os

from pydantic import BaseModel
import requests
import mariadb
import git
import elasticsearch

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
)

log = logging.getLogger(__file__)


class Notebook(BaseModel):
    path: pathlib.Path
    authors: set[str]
    updated: dt.datetime
    last_commit: str


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument("--notebook-repository", default='git@github.com:cjmcgraw/atg-nbmilll-notebooks.git')
    p.add_argument("--local-path", default="/notebook-repo")
    args, _ = p.parse_known_args()
    log.info(f"starting process with args={args}")

    remote_repo_url = args.notebook_repository
    local_repo_path = pathlib.Path(args.local_path)

    if not local_repo_path.exists():
        log.warning(f"no existing repo found. Cloning repo remote={remote_repo_url}")

        git.Repo.clone_from(
            remote_repo_url,
            local_repo_path,
        )

    repo = git.Repo(local_repo_path)
    log.info("pulling changes from repo")
    repo.remote().pull()
    log.info("successfully pulled changes")

    notebooks_dir = local_repo_path.joinpath('notebook_server', 'notebooks')
    for notebook_path in notebooks_dir.glob("**/*.ipynb"):
        path = str(notebook_path).replace(str(notebooks_dir), '').lstrip('/')
        commits = list(repo.iter_commits(rev='HEAD', paths=[notebook_path]))
        last_commit = next(iter(commits), None)

        notebook = Notebook(
            path=notebook_path,
            authors=set(c.author.name for c in commits),
            updated=last_commit.committed_datetime,
            last_commit=last_commit.hexsha,
        )

        url = f"http://nb-server:8001/notebooks/{path}"

        with notebook.path.open('rb') as f:
            log.info(f"sending to url={url}")
            resp = requests.post(url=url, files=dict(file=f))
        log.info(f"post responded http_code={resp.status_code}")
        resp.raise_for_status()





