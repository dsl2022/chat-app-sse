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
  task_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name  = "chat-app",
      image = aws_ecr_repository.repository.repository_url,
      secrets = [{
        name = "NODE_ENV"
        valueFrom = "arn:aws:secretsmanager:us-east-1:212612999379:secret:prod/chat-app-sse/node-env-7RysqU"
      },
      {
        name = "BASE_MOCK_API_URL"
        valueFrom = "arn:aws:secretsmanager:us-east-1:212612999379:secret:prod/chat-app-sse/base_mock_api_url-0P60di"
      },
       {
        name = "API_ENDPOINTS_CONFIG_PATH"
        valueFrom = "arn:aws:secretsmanager:us-east-1:212612999379:secret:prod/chat-app-sse/api-endpoint-config-path-7gdscp"
      },
      {
        name = "OPENAI_API_KEY"
        valueFrom = "arn:aws:secretsmanager:us-east-1:212612999379:secret:prod/chat-app-sse/openai-key-JQrNWO"
      }
      ]
      portMappings = [
        {
          containerPort = 8080,
          hostPort      = 8080
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = "us-east-1" # Replace with your AWS region
          awslogs-stream-prefix = "ecs"
        }
      },
      
    }
  ])
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/chat-app" # You can choose a different name if preferred
}

resource "aws_ecs_service" "app_service" {
  name            = "chat-app-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets = [aws_subnet.app_subnet_1.id, aws_subnet.app_subnet_2.id]
    security_groups = [aws_security_group.app_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "chat-app"
    container_port   = 8080
  }

  desired_count = 1
}
