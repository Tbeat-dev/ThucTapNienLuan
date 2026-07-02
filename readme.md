# Hướng dẫn deploy cinema-api lên Kubernetes

## Mục tiêu
Hướng dẫn triển khai dịch vụ cinema-api trên môi trường Kubernetes bằng Killercoda, sử dụng NodePort để truy cập Swagger UI và endpoint health check.

## Các bước thực hiện

### 1. Mở phiên làm việc mới
Truy cập https://killercoda.com/kubernetes/scenario/playground, chọn 1 node và nhấn Start. Chờ terminal hiện lên dạng:

```bash
root@controlplane:~$
```

### 2. Kiểm tra cluster đã sẵn sàng chưa
Chạy lệnh sau:

```bash
kubectl get nodes
```

Nếu tất cả node ở trạng thái Ready thì có thể tiếp tục.

### 3. Tạo file deployment.yaml
Copy toàn bộ nội dung dưới đây vào terminal và nhấn Enter:

```bash
cat <<'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cinema-api-service
  namespace: api-governance
  labels:
    app: cinema-api-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cinema-api-service
  template:
    metadata:
      labels:
        app: cinema-api-service
        backstage.io/kubernetes-id: cinema-api-service
    spec:
      securityContext:
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: cinema-api
          image: tbeat/cinema-api:latest
          imagePullPolicy: Always
          ports:
            - name: http
              containerPort: 3000
          env:
            - name: PORT
              value: "3000"
            - name: WRITE_SWAGGER_FILE
              value: "false"
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 15
            periodSeconds: 20
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 250m
              memory: 256Mi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 1000
---
apiVersion: v1
kind: Service
metadata:
  name: cinema-api-service
  namespace: api-governance
spec:
  type: NodePort
  selector:
    app: cinema-api-service
  ports:
    - name: http
      port: 3000
      targetPort: 3000
EOF
```

### 4. Tạo namespace và triển khai
Chạy các lệnh sau:

```bash
kubectl create namespace api-governance
kubectl apply -f deployment.yaml
```

### 5. Theo dõi pod đang khởi động

```bash
kubectl get pods -n api-governance -w
```

Đợi cho cả 2 pod có trạng thái:
- READY: 1/1
- STATUS: Running
- RESTARTS: 0

Nhấn Ctrl+C khi đã ổn định.

### 6. Lấy NodePort
Chạy lệnh:

```bash
kubectl get svc -n api-governance
```

Ghi lại số sau dấu `:` trong cột PORT(S). Ví dụ: `3000:3XXXX/TCP` thì NodePort là `3XXXX`.

> Lưu ý: NodePort sẽ thay đổi mỗi lần deploy lại, nên cần lấy lại mỗi phiên mới.

### 7. Mở Traffic Port Accessor để xem Swagger UI
Thực hiện các bước sau:
1. Bấm icon 3 gạch ngang (☰) ở góc trên phải giao diện Killercoda.
2. Chọn Traffic/Ports.
3. Trong ô Custom Ports, nhập đúng số NodePort vừa lấy ở bước 6.
4. Nhấn Access.

Sau khi mở trang mới, thêm đường dẫn sau vào cuối URL:
- `/api-docs` để xem Swagger UI
- `/health` để kiểm tra endpoint nhanh

## Ghi chú quan trọng
- Không cần dùng `kubectl port-forward` nữa vì NodePort đã tự lắng nghe trên mọi interface và tương thích trực tiếp với Traffic Port Accessor.
- Nếu muốn kiểm tra nhanh bằng terminal, chạy:

```bash
curl http://localhost:<NodePort>/health
```

- Toàn bộ quy trình này chỉ mất khoảng 2–3 phút mỗi lần, nên có thể lặp lại dễ dàng khi demo hoặc phiên cũ hết hạn.
- Image luôn được kéo bản mới nhất từ Docker Hub nhờ `imagePullPolicy: Always`. Nếu bạn cập nhật code và push mới, chỉ cần chạy lại đúng 7 bước trên là service sẽ tự động dùng bản mới nhất.