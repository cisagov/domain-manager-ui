# Domain Manager Client #

[![GitHub Build Status](https://github.com/cisagov/domain-manager-ui/workflows/build/badge.svg)](https://github.com/cisagov/domain-manager-ui/actions/workflows/build.yml)
[![CodeQL](https://github.com/cisagov/domain-manager-ui/workflows/CodeQL/badge.svg)](https://github.com/cisagov/domain-manager-ui/actions/workflows/codeql-analysis.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/cisagov/domain-manager-ui/badge.svg)](https://snyk.io/test/github/cisagov/domain-manager-ui)

## Docker Image ##

[![Docker Pulls](https://img.shields.io/docker/pulls/cisagov/domain-manager-ui)](https://hub.docker.com/r/cisagov/domain-manager-ui)
[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/cisagov/domain-manager-ui)](https://hub.docker.com/r/cisagov/domain-manager-ui)
[![Platforms](https://img.shields.io/badge/platforms-amd64%20%7C%20arm%2Fv6%20%7C%20arm%2Fv7%20%7C%20arm64%20%7C%20ppc64le%20%7C%20s390x-blue)](https://hub.docker.com/r/cisagov/domain-manager-ui/tags)

This is a Docker skeleton project that can be used to quickly get a
new [cisagov](https://github.com/cisagov) GitHub Docker project
started.  This skeleton project contains [licensing
information](LICENSE), as well as [pre-commit hooks](https://pre-commit.com)
and [GitHub Actions](https://github.com/features/actions) configurations
appropriate for Docker containers and the major languages that we use.

## Running ##

### Running with Docker ###

To run the `cisagov/domain-manager-ui` image via Docker:

```console
docker run cisagov/domain-manager-ui:1.0.0
```

### Running with Docker Compose ###

1. Create a `docker-compose.yml` file similar to the one below to use [Docker Compose](https://docs.docker.com/compose/).

    ```yaml
    ---
    version: "3.7"

    services:
      ui:
        image: cisagov/domain-manager-ui:1.0.0
        volumes:
          - type: bind
            source: <your_log_dir>
            target: /var/log
        environment:
          - ECHO_MESSAGE="Hello from docker-compose"
        ports:
          - target: 8080
            published: 8080
            protocol: tcp
    ```

1. Start the container and detach:

    ```console
    docker-compose up --detach
    ```

## Updating your container ##

### Docker Compose ###

1. Pull the new image from Docker Hub:

    ```console
    docker-compose pull
    ```

1. Recreate the running container by following the [previous instructions](#running-with-docker-compose):

    ```console
    docker-compose up --detach
    ```

### Docker ###

1. Stop the running container:

    ```console
    docker stop <container_id>
    ```

1. Pull the new image:

    ```console
    docker pull cisagov/domain-manager-ui:1.0.0
    ```

1. Recreate and run the container by following the [previous instructions](#running-with-docker).

## Image tags ##

The images of this container are tagged with [semantic
versions](https://semver.org) of the underlying domain-manager-ui project that they
containerize.  It is recommended that most users use a version tag (e.g.
`:1.0.0`).

| Image:tag | Description |
|-----------|-------------|
|`cisagov/domain-manager-ui:1.0.0`| An exact release version. |
|`cisagov/domain-manager-ui:1.0`| The most recent release matching the major and minor version numbers. |
|`cisagov/domain-manager-ui:1`| The most recent release matching the major version number. |
|`cisagov/domain-manager-ui:edge` | The most recent image built from a merge into the `develop` branch of this repository. |
|`cisagov/domain-manager-ui:nightly` | A nightly build of the `develop` branch of this repository. |
|`cisagov/domain-manager-ui:latest`| The most recent release image pushed to a container registry.  Pulling an image using the `:latest` tag [should be avoided.](https://vsupalov.com/docker-latest-tag/) |

See the [tags tab](https://hub.docker.com/r/cisagov/domain-manager-ui/tags) on Docker
Hub for a list of all the supported tags.

## Ports ##

The following ports are exposed by this container:

| Port | Purpose        |
|------|----------------|
| 80 | The http listener for nginx. |

The [Docker composition](docker-compose.yml) publishes the
exposed port at 4200.

## Environment variables ##

### Required ###

There are no required environment variables.

| Name  | Purpose | Default |
|-------|---------|---------|
| `API_URL` | The url for the api. | `http://localhost:5000` |

## Building from source ##

Build the image locally using this git repository as the [build context](https://docs.docker.com/engine/reference/commandline/build/#git-repositories):

```console
docker build \
  --build-arg VERSION=1.0.0 \
  --tag cisagov/domain-manager-ui:1.0.0 \
  https://github.com/cisagov/domain-manager-ui.git#develop
```

## Cross-platform builds ##

To create images that are compatible with other platforms, you can use the
[`buildx`](https://docs.docker.com/buildx/working-with-buildx/) feature of
Docker:

1. Copy the project to your machine using the `Code` button above
   or the command line:

    ```console
    git clone https://github.com/cisagov/domain-manager-ui.git
    cd domain-manager-ui
    ```

1. Create the `Dockerfile-x` file with `buildx` platform support:

    ```console
    ./buildx-dockerfile.sh
    ```

1. Build the image using `buildx`:

    ```console
    docker buildx build \
      --file Dockerfile-x \
      --platform linux/amd64 \
      --build-arg VERSION=1.0.0 \
      --output type=docker \
      --tag cisagov/domain-manager-ui:1.0.0 .
    ```
