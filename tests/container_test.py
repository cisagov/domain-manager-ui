#!/usr/bin/env pytest -vs
"""Tests for domain-manager-ui container."""

# Standard Python Libraries
import os
import time

<<<<<<< HEAD
READY_MESSAGE = "Starting nginx"
=======
# Third-Party Libraries
import pytest

ENV_VAR = "ECHO_MESSAGE"
ENV_VAR_VAL = "Hello World from docker compose!"
READY_MESSAGE = "This is a debug message"
SECRET_QUOTE = (
    "There are no secrets better kept than the secrets everybody guesses."  # nosec
)
>>>>>>> 9cea64da4a1379cdde3c509a09fc548f0da8b034
RELEASE_TAG = os.getenv("RELEASE_TAG")
VERSION_FILE = "src/version.txt"


def test_container_count(dockerc):
    """Verify the test composition and container."""
    # stopped parameter allows non-running containers in results
    assert (
        len(dockerc.containers(stopped=True)) == 1
    ), "Wrong number of containers were started."


def test_wait_for_ready(main_container):
    """Wait for container to be ready."""
    TIMEOUT = 10
    for i in range(TIMEOUT):
        if READY_MESSAGE in main_container.logs().decode("utf-8"):
            break
        time.sleep(1)
    else:
        raise Exception(
            f"Container does not seem ready.  "
            f'Expected "{READY_MESSAGE}" in the log within {TIMEOUT} seconds.'
        )


def test_container(main_container):
    """Test container runs, has correct logs and has correct version."""
    # At the moment, the entrypoint takes a while, current working
    # this to be shorter, so hence the longer timeout.
    TIMEOUT = 360
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

    # Make sure the container is not exiting.
    assert main_container.is_running is True, "Docker container is not running."
    assert main_container.is_restarting is False, "Docker container is restarting."
    assert main_container.exit_code == 0, "Docker container exited."

    # Get project version
    pkg_vars = {}
    with open(VERSION_FILE) as f:
        exec(f.read(), pkg_vars)  # nosec
    project_version = pkg_vars["__version__"]

    # Get log output
    log_output = main_container.logs().decode("utf-8")

    # Assert version output is in the logs.
    assert (
        f"Running Domain Manager version {project_version}" in log_output
    ), f"Container version output to log does not match project version file {VERSION_FILE}"

    # Assert release Version Label
    if RELEASE_TAG:
        assert (
            RELEASE_TAG == f"v{project_version}"
        ), "RELEASE_TAG does not match the project version"

    # Assert container version label matches
    assert (
        main_container.labels["org.opencontainers.image.version"] == project_version
    ), "Dockerfile version label does not match project version"
