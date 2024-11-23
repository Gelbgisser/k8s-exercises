# Kubernetes Microservices Exercise: Frontend, Publisher, and Subscriber with RabbitMQ

## Summary

In this exercise, we try and simulate a real life task of packging 2 services: frontend web UI, and a backend api that needs to handle loads.

You are a devops engineer at a startup that is building a microservices-based application. The application consists of the two services.

The R&D lead wants you to package the containers, publish them and then deploy the to a Kubernetes cluster.

This exercise is divided to a few parts, to help you understand the thought process. Each part builds on the previous one, so make sure you complete each part before moving on to the next one.

## Part 1: Packaging the Backend API Service

After reading and understanding the code of the backend service, you will need to package it in a Docker container. Please follow the steps below when creating your Dockerfile:

- Use the `python:3.7-slim` as the base image
- Set these 2 environment variables(Using the ENV command)- these are used to prevent Python from writing pyc files to the container:
  - PYTHONDONTWRITEBYTECODE=1
  - PYTHONUNBUFFERED=1
- run the following command to install the cli for stress utility:

```bash
apt-get update && apt-get install -y --no-install-recommends \
stress \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*
```

- Set the working dir to : `/app`
- Copy the stress_api.py file to the working dir
- Install the required python packages using the following command:

```bash
pip install --no-cache-dir flask flask-cors
```

- Set the default command to run the stress_api.py file - ["python", "stress_api.py"]

## Part 2: Packaging the FrontEnd Service

## Part 3: Publishing the Services to DockerHub

## Part 4: Deploying the application to Kubernetes using static manifests

## Part 5: Deploying the application to Kubernetes using Helm

## Part 6: Adding Ingress to the application

## Part 7: Adding HPA to the application
