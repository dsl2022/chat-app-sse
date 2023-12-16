resource "aws_vpc" "chat_app_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "app_subnet_1" {
  vpc_id = aws_vpc.chat_app_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "app_subnet_2" {
  vpc_id = aws_vpc.chat_app_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_security_group" "app_sg" {
  vpc_id = aws_vpc.chat_app_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.chat_app_vpc.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.chat_app_routetable.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table" "chat_app_routetable" {
  vpc_id = aws_vpc.chat_app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "chat_app_route_table"
  }
}


resource "aws_route_table_association" "app_rta_1" {
  subnet_id      = aws_subnet.app_subnet_1.id
  route_table_id = aws_route_table.chat_app_routetable.id
}

resource "aws_route_table_association" "app_rta_2" {
  subnet_id      = aws_subnet.app_subnet_2.id
  route_table_id = aws_route_table.chat_app_routetable.id
}
