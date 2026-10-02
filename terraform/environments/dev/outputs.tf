output "bucket_name" {
  description = "Name of the employee platform development bucket"
  value = aws_s3_bucket.employee_platform.bucket
}