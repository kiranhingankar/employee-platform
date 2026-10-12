
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import time
from threading import Lock

START_TIME = time.time()
REQUEST_COUNT = 0
REQUEST_LOCK = Lock()


class EmployeeHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global REQUEST_COUNT

        with REQUEST_LOCK:
            REQUEST_COUNT += 1
            count = REQUEST_COUNT

        if self.path == "/":
            response = {
                "service": "employee-platform",
                "status": "running"
            }

        elif self.path == "/health":
            response = {"status": "healthy"}

        elif self.path == "/employees":
            response = {
                "employees": [
                    {
                        "id": 1,
                        "name": "Employee-1",
                        "department": "DevOps"
                    },
                    {
                        "id": 2,
                        "name": "Employee-2",
                        "department": "Engineering"
                    }
                ]
            }

        elif self.path == "/metrics":
            uptime = time.time() - START_TIME

            metrics = (
                "# HELP employee_platform_requests_total "
                "Total HTTP requests\n"
                "# TYPE employee_platform_requests_total counter\n"
                f"employee_platform_requests_total {count}\n"
                "# HELP employee_platform_uptime_seconds "
                "Application uptime in seconds\n"
                "# TYPE employee_platform_uptime_seconds gauge\n"
                f"employee_platform_uptime_seconds {uptime:.2f}\n"
            )

            body = metrics.encode("utf-8")
            self.send_response(200)
            self.send_header(
                "Content-Type",
                "text/plain; version=0.0.4; charset=utf-8"
            )
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        else:
            self.send_response(404)
            self.end_headers()
            return

        body = json.dumps(response).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


server = HTTPServer(("0.0.0.0", 8080), EmployeeHandler)

print("Employee Platform running on port 8080")
server.serve_forever()