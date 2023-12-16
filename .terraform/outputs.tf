output "aws_ecr_repo_url" {
  value = aws_ecr_repository.repository.repository_url
}

output "aws_ecr_repo_arn" {
  value = aws_ecr_repository.repository.arn
}

output "alb_dns_name" {
  value = aws_lb.app_lb.dns_name
}