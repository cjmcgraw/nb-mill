import itertools as i
import subprocess
import argparse
import pathlib
import logging
import sys
import os

import mariadb
import git
import elasticsearch

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
)

log = logging.getLogger(__file__)

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

        repo = git.Repo.clone_from(
            remote_repo_url,
            local_repo_path,
        )

    repo = git.Repo(local_repo_path)
    log.info("pulling changes from repo")
    repo.remote().pull()
    log.info("successfully pulled changes")

    ignore_path = local_repo_path.joinpath("notebook_server/notebooks")
    for notebook in local_repo_path.glob("**/*.ipynb"):
        _, author, *_ = list(i.dropwhile(lambda x: x != 'notebooks', notebook.parts))
        print(author, notebook)

        repo.blame(notebook)



