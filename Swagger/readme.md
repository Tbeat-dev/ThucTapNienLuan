# Cinema API Service

Node.js microservice demo for automatic API documentation and API governance.

## Run locally

```powershell
npm install
npm start
```

Swagger UI:

```text
http://localhost:3000/api-docs
```

If port `3000` is already used:

```powershell
$env:PORT=3100; npm start
```

## Generate OpenAPI document

```powershell
npm run generate:docs
```

The generated OpenAPI file is:

```text
swagger.json
```

## Docker

```bash
docker build -t cinema-api-service:1.0.0 .
docker run --rm -p 3000:3000 cinema-api-service:1.0.0
```

## Minikube deployment

```bash
minikube start
eval $(minikube docker-env)
docker build -t cinema-api-service:1.0.0 .
kubectl apply -f k8s/
kubectl get pods -n api-governance
kubectl port-forward -n api-governance svc/cinema-api-service 3000:80
```

Open:

```text
http://localhost:3000/api-docs
```

## Backstage

Backstage reads `catalog-info.yaml`, which defines:

- `Component`: `cinema-api-service`
- `API`: `cinema-movie-api`
- OpenAPI contract source: `swagger.json`
- Kubernetes annotation: `backstage.io/kubernetes-id`

## Demo evidence for the report

- Swagger UI shows all API endpoints and example requests.
- Backstage catalog shows the `cinema-api-service` component.
- Backstage API docs show the `cinema-movie-api` OpenAPI contract.
- Kubernetes shows two healthy pods with readiness and liveness probes.
- Invalid API requests return documented `400` or `404` responses.
