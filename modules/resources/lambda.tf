resource "aws_iam_role" "lambda_exec" {
  name               = "function-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "function_lambda_policy" {
  role       = aws_iam_role.lambda_exec.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "db_connection" {
  function_name = "db_connection"
  role          = aws_iam_role.lambda_exec.arn

  s3_key    = aws_s3_object.lambda_db_connection.key
  s3_bucket = aws_s3_bucket.lambda_bucket.id

  handler = "index.handler"
  runtime = "nodejs16.x"

  source_code_hash = data.archive_file.lambda_dbconnect.output_base64sha256

  environment {
    variables = {
      DB_ENDPOINT = var.db_input_endpoint
    }
  }
}

variable "db_input_endpoint" {
  type = string
}

output "success" {
  value = "db enpoint is ${var.db_input_endpoint}"
}
