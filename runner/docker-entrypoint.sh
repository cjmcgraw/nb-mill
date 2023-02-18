#! /usr/bin/env bash


if [[ -z ${CMD_STRING} ]]; then
    echo "MISSING CMD_STRING "
    exit -123
fi

uuid=$(openssl rand -hex 16)
run=''
function log {
    echo "worker=${uuid} run=${run} $@"
}


while true; do
    run=$(openssl rand -hex 16);
    log "doing work"
    date +%s > /tmp/started_work
    CMD="${CMD_STRING} --worker-id ${uuid} --run-id ${run} $@"
    log "running command: $CMD"
    eval $CMD
    result=$?
    if [[ ! $? -eq 0 ]]; then
        log "ERROR:"
        log "ERROR see above this lines for worker=${uuid}"
        log "ERROR: ^^^^^^"
        log " ERROR: unexpected error"
        date +%s >> /tmp/failures
        MAX_ERRORS=${MAX_ERRORS:-1000}
        errored_jobs=$(cat /tmp/failures)
        log "errored jobs: ${errored_jobs}"
        if [[ $errored_jobs -gt ${MAX_ERRORS} ]]; then
            cat /tmp/failures
            log "passed MAX_ERRORS=${MAX_ERRORS}"
            exit ${errored_jobs}
        fi
    else
        date +%s >> /tmp/finished
        MAX_FINISHED_JOBS=${MAX_FINISHED_JOBS:-50}
        finished_jobs=$(cat /tmp/finished | wc -l)
        if [[ $finished_jobs -gt ${MAX_FINISHED_JOBS} ]]; then
            cat /tmp/fininshed
            log "passed MAX_FINISHED_JOBS=${MAX_FINISHED_JOBS}"
            exit ${finished_jobs}
        fi
    fi

    sleep_time=${SLEEP_TIME:-60}
    log "sleeping=${sleep_time}"
    sleep "${sleep_time}"
done
