# Kubernetes Microservices Exercise: Stress Web Application

## Summary

In this exercise, we try and simulate a real life task of packaging 2 services: frontend web UI, and a backend api that needs to handle loads.

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

## Part 2: Packaging the Frontend Service

After reading and understanding the code of the front-end service, you will need to package it in a Docker container. Please follow the steps below when creating your Dockerfile:

- Use the `node:18` as the base image
- Set the working directory inside the container to `/usr/src/app`
- Copy the package.json and package-lock.json files to the working directory
- Install the Node.js dependencies using the following command:

```bash
npm install
```

- Copy the application source code into the container
- Set the default command to run the application - ["npm", "start"]

## Part 3: Publishing the Services to DockerHub

Now that you have created the Dockerfiles for the services, you need to publish them to DockerHub. You will need to create a DockerHub account if you don't have one.

- Build the Docker images for the services using the following commands:

```bash
docker build -t <dockerhub-username>/stress-frontend:latest frontend/
docker build -t <dockerhub-username>/stress-backend:latest backend/
```

- login to DockerHub using the following command:

```bash
docker login
```

- Push the Docker images to DockerHub using the following commands:

```bash
docker push <dockerhub-username>/stress-frontend:latest
docker push <dockerhub-username>/stress-backend:latest
```

## Part 4: Deploying the application to Kubernetes using static manifests

Now that you have published the Docker images to DockerHub, you need to deploy the application to a Kubernetes cluster.

We will use static manifests to deploy the application.

Create the following Kubernetes manifests:

- A deployment for the backend service
  - Use the image `<dockerhub-username>/stress-backend:latest`
  - Set the resource request to 150m CPU and 128Mi memory
  - Set the resource limit to 200m CPU and 256Mi memory
  - Set the container port to the port the application listens on
  - Pass the enviroment variable PORT with the value use set for the container port
- A service for the backend service
  - Expose the service on a LoadBalancer type
  - Set the targetPort to the port the application listens on
  - Set the port to your desired port(should not be 80 nor 443)
  - Set the selector to match the labels of the backend deployment
- A Deployment for the frontend service
  - Use the image `<dockerhub-username>/stress-frontend:latest`
  - Set the resource request to 150m CPU and 128Mi memory
  - Set the resource limit to 200m CPU and 256Mi memory
  - Set the container port to the port the application listens on
  - Pass the enviroment variable BACKEND_URI with the value of the backend service url
- A service for the frontend service
  - Expose the service on a LoadBalancer type
  - Set the targetPort to the port the application listens on
  - Set the port to port 80
  - Set the selector to match the labels of the frontend deployment
- Configure the HPA for the backend service - for that you need to install the metrics server on the cluster(kubectl apply -f https://raw.githubusercontent.com/yanivomc/seminars/K8S/K8S/advanced/hpa/metricserver/components.yaml)
  - Set the minReplicas to 1
  - Set the maxReplicas to 5
  - Set the targetCPUUtilizationPercentage to 30
  -

## Part 5: Deploying the application to Kubernetes using Helm

## Part 6: Adding Ingress to the application

## Part 7: Adding HPA to the application
