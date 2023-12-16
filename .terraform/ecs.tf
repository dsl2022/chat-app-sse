resource "aws_ecs_cluster" "app_cluster" {
  name = "chat-app-cluster"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "chat-app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name  = "chat-app",
      image = aws_ecr_repository.repository.repository_url,
      portMappings = [
        {
          containerPort = 8080,
          hostPort      = 8080
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "app_service" {
  name            = "chat-app-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.app_subnet_1.id, aws_subnet.app_subnet_2.id]
    security_groups = [aws_security_group.app_sg.id]
    assign_public_ip = "ENABLED"
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "chat-app"
    container_port   = 8080
  }

  desired_count = 1
}
