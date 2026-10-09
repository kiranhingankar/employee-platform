output "vpc_id" {
  description = "Employee platform VPC ID"
  value       = aws_vpc.employee_platform.id
}

output "vpc_cidr" {
  description = "Employee platform VPC CIDR"
  value       = aws_vpc.employee_platform.cidr_block
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value = [
    aws_subnet.public_az2.id,
    aws_subnet.public_az2.id
  ]
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value = [
    aws_subnet.private_az1.id,
    aws_subnet.private_az2.id
  ]
}

output "security_group_id" {
  description = "Employee platform security group ID"
  value       = aws_security_group.employee_platform.id
}
