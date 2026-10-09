resource "aws_vpc" "employee_platform" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "employee-platform-vpc"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Internet Gateway
# -------------------------

resource "aws_internet_gateway" "employee_platform" {
  vpc_id = aws_vpc.employee_platform.id

  tags = {
    Name        = "employee-platform-igw"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Public Subnet - AZ 1
# -------------------------

resource "aws_subnet" "public_az1" {
  vpc_id                  = aws_vpc.employee_platform.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "employee-platform-public-az1"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Public Subnet - AZ 2
# -------------------------

resource "aws_subnet" "public_az2" {
  vpc_id                  = aws_vpc.employee_platform.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "employee-platform-public-az2"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Private Subnet - AZ 1
# -------------------------

resource "aws_subnet" "private_az1" {
  vpc_id                  = aws_vpc.employee_platform.id
  cidr_block              = "10.0.11.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "employee-platform-private-az1"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Private Subnet - AZ 2
# -------------------------

resource "aws_subnet" "private_az2" {
  vpc_id                  = aws_vpc.employee_platform.id
  cidr_block              = "10.0.12.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "employee-platform-private-az2"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# -------------------------
# Public Route Table
# -------------------------

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.employee_platform.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.employee_platform.id
  }

  tags = {
    Name        = "employee-platform-public-rt"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}


# ----------------------------
# Public Route Associations
# ----------------------------

resource "aws_route_table_association" "public_az1" {
  subnet_id      = aws_subnet.public_az1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_az2" {
  subnet_id      = aws_subnet.public_az2.id
  route_table_id = aws_route_table.public.id
}


# ----------------------------
# Private Route Tables
# ----------------------------

resource "aws_route_table" "private_az1" {
  vpc_id = aws_vpc.employee_platform.id

  tags = {
    Name        = "employee-platform-private-rt-az1"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

resource "aws_route_table" "private_az2" {
  vpc_id = aws_vpc.employee_platform.id

  tags = {
    Name        = "employee-platform-private-rt-az2"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

resource "aws_route_table_association" "private_az1" {
  subnet_id      = aws_subnet.private_az1.id
  route_table_id = aws_route_table.private_az1.id
}

resource "aws_route_table_association" "private_az2" {
  subnet_id      = aws_subnet.private_az2.id
  route_table_id = aws_route_table.private_az2.id
}


# -------------------------
# Security Group
# -------------------------

resource "aws_security_group" "employee_platform" {
  name        = "employee-platform-sg"
  description = "Security group for employee platform infrastructure"
  vpc_id      = aws_vpc.employee_platform.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "employee-platform-sg"
    Project     = "employee-platform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}