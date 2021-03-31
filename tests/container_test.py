#!/usr/bin/env pytest -vs
"""Tests for example container."""

# Standard Python Libraries
import time

READY_MESSAGE = "Starting nginx"


def test_container_count(dockerc):
    """Verify the test composition and container."""
    # stopped parameter allows non-running containers in results
    assert (
        len(dockerc.containers(stopped=True)) == 1
    ), "Wrong number of containers were started."


def test_wait_for_ready(main_container):
    """Wait for container to be ready."""
    # At the moment, the entrypoint takes a while, current working
    # this to be shorter, so hence the longer timeout.
    TIMEOUT = 30
    for i in range(TIMEOUT):
        if READY_MESSAGE in main_container.logs().decode("utf-8"):
            break
        time.sleep(1)
    else:
        raise Exception(
            f"Container does not seem ready.  "
            f'Expected "{READY_MESSAGE}" in the log within {TIMEOUT} seconds.'
        )

    # After container is ready, give it some time and make sure
    # it's still running.
    time.sleep(10)
    assert main_container.is_running is True
    assert main_container.is_restarting is False
    assert main_container.exit_code == 0
