from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class EmployeeHandler(BaseHTTPRequestHandler):

    def do_GET(self):
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
                    {"id": 1, "name": "Employee-1", "department": "DevOps"},
                    {"id": 2, "name": "Employee-2", "department": "Engineering"}
                ]
            }

        else:
            self.send_response(404)
            self.end_headers()
            return

        body = json.dumps(response).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()

        self.wfile.write(body)


server = HTTPServer(("0.0.0.0", 8080), EmployeeHandlerhfhfhff)

print("Employee Platform running on port 8080")

server.serve_forever()