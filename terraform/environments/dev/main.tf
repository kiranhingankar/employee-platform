resource "aws_s3_bucket" "employee_platform" {
  bucket_prefix = "employee-platform-dev-"

  tags = {
    Project = "employee-platform"
    Environment = "dev"
    ManageBy = "manual-change"
  }
}