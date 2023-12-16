resource "aws_lb" "app_lb" {
  name               = "chat-app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app_sg.id]
  subnets            = [aws_subnet.app_subnet_1.id, aws_subnet.app_subnet_2.id]

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "app_tg" {
  name     = "chat-app-target-group"
  port     = 8080
  protocol = "HTTP"
  target_type = "ip"
  vpc_id   = aws_vpc.chat_app_vpc.id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200"
  }
}

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
