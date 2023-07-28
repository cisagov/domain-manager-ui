#!/usr/bin/env pytest -vs
"""Tests for domain-manager-ui container."""

# Standard Python Libraries
import os
import time

READY_MESSAGE = "Starting nginx"
RELEASE_TAG = os.getenv("RELEASE_TAG")
VERSION_FILE = "src/version.txt"


def test_container_count(dockerc):
    """Verify the test composition and container."""
    # stopped parameter allows non-running containers in results
    assert (
<<<<<<< HEAD
        len(dockerc.containers(stopped=True)) == 1
=======
        len(dockerc.compose.ps(all=True)) == 2
>>>>>>> a9d6c92ea3ca2760e4a18276d06c668058dd3670
    ), "Wrong number of containers were started."


def test_wait_for_ready(main_container):
    """Wait for container to be ready."""
    TIMEOUT = 10
    for i in range(TIMEOUT):
        if READY_MESSAGE in main_container.logs():
            break
        time.sleep(1)
    else:
        raise Exception(
            f"Container does not seem ready.  "
            f'Expected "{READY_MESSAGE}" in the log within {TIMEOUT} seconds.'
        )


<<<<<<< HEAD
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
=======
def test_wait_for_exits(dockerc, main_container, version_container):
    """Wait for containers to exit."""
    assert (
        dockerc.wait(main_container.id) == 0
    ), "Container service (main) did not exit cleanly"
    assert (
        dockerc.wait(version_container.id) == 0
    ), "Container service (version) did not exit cleanly"
>>>>>>> a9d6c92ea3ca2760e4a18276d06c668058dd3670

    # After container is ready, give it some time and make sure
    # it's still running.
    time.sleep(10)

<<<<<<< HEAD
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
=======
def test_output(dockerc, main_container):
    """Verify the container had the correct output."""
    # make sure container exited if running test isolated
    dockerc.wait(main_container.id)
    log_output = main_container.logs()
    assert SECRET_QUOTE in log_output, "Secret not found in log output."
>>>>>>> a9d6c92ea3ca2760e4a18276d06c668058dd3670

    # Assert version output is in the logs.
    assert (
<<<<<<< HEAD
        f"Running Domain Manager version {project_version}" in log_output
=======
        RELEASE_TAG == f"v{project_version}"
    ), "RELEASE_TAG does not match the project version"


def test_log_version(dockerc, version_container):
    """Verify the container outputs the correct version to the logs."""
    # make sure container exited if running test isolated
    dockerc.wait(version_container.id)
    log_output = version_container.logs().strip()
    pkg_vars = {}
    with open(VERSION_FILE) as f:
        exec(f.read(), pkg_vars)  # nosec
    project_version = pkg_vars["__version__"]
    assert (
        log_output == project_version
>>>>>>> a9d6c92ea3ca2760e4a18276d06c668058dd3670
    ), f"Container version output to log does not match project version file {VERSION_FILE}"

    # Assert release Version Label
    if RELEASE_TAG:
        assert (
            RELEASE_TAG == f"v{project_version}"
        ), "RELEASE_TAG does not match the project version"

    # Assert container version label matches
    assert (
<<<<<<< HEAD
        main_container.labels["org.opencontainers.image.version"] == project_version
=======
        version_container.config.labels["org.opencontainers.image.version"]
        == project_version
>>>>>>> a9d6c92ea3ca2760e4a18276d06c668058dd3670
    ), "Dockerfile version label does not match project version"
