
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
            request_count = REQUEST_COUNT

        # Prometheus metrics endpoint
        if self.path == "/metrics":
            uptime = time.time() - START_TIME

            response = (
                "# HELP employee_platform_requests_total "
                "Total HTTP requests received\n"
                "# TYPE employee_platform_requests_total counter\n"
                f"employee_platform_requests_total {request_count}\n"
                "# HELP employee_platform_uptime_seconds "
                "Application uptime in seconds\n"
                "# TYPE employee_platform_uptime_seconds gauge\n"
                f"employee_platform_uptime_seconds {uptime:.2f}\n"
            )

            body = response.encode("utf-8")

            self.send_response(200)
            self.send_header(
                "Content-Type",
                "text/plain; version=0.0.4; charset=utf-8"
            )
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        # Application endpoints
        if self.path == "/":
            response = {
                "service": "employee-platform",
                "status": "running"
            }

        elif self.path == "/health":
            response = {
                "status": "healthy"
            }

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

        else:
            response = {
                "error": "Not Found",
                "path": self.path
            }

            body = json.dumps(response).encode("utf-8")
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        body = json.dumps(response).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format_string, *args):
        print(
            f"[{self.log_date_time_string()}] "
            f"{self.client_address[0]} - "
            f"{format_string % args}"
        )


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8080), EmployeeHandler)

    print("Employee Platform running on port 8080")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Employee Platform")
    finally:
        server.server_close()