
resource "aws_api_gateway_rest_api" "db_rest_api" {
  name = "ServerlessHelloWorld"
}

resource "aws_api_gateway_authorizer" "demo" {
  name                   = "demo"
  rest_api_id            = aws_api_gateway_rest_api.db_rest_api.id
  authorizer_uri         = aws_lambda_function.db_connection.invoke_arn
  authorizer_credentials = aws_iam_role.lambda_exec.arn
  type                   = "COGNITO_USER_POOLS"
  provider_arns          = ["arn:aws:cognito-idp:ap-southeast-2:022031460013:userpool/ap-southeast-2_rMmsZN3Xl"]
}


output "base_url" {
  value = aws_api_gateway_deployment.db_connection.invoke_url
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.db_connection.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.db_rest_api.execution_arn}/*/*"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  parent_id   = aws_api_gateway_rest_api.db_rest_api.root_resource_id
  path_part   = "{proxy+}"
}

module "example_cors" {
  source  = "mewa/apigateway-cors/aws"
  version = "2.0.1"

  api      = aws_api_gateway_rest_api.db_rest_api.id
  resource = aws_api_gateway_resource.proxy.id

  methods = ["GET", "POST", "OPTIONS", "ANY", "PATCH", "DELETE"]
}

module "example_cors2" {
  source  = "mewa/apigateway-cors/aws"
  version = "2.0.1"

  api      = aws_api_gateway_rest_api.db_rest_api.id
  resource = aws_api_gateway_resource.proxy.parent_id

  methods = ["GET", "POST", "OPTIONS", "ANY", "PATCH", "DELETE"]
}
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.db_rest_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.demo.id
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.db_connection.invoke_arn
}
///
///

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.db_rest_api.id
  resource_id   = aws_api_gateway_rest_api.db_rest_api.root_resource_id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.demo.id

}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.db_connection.invoke_arn
}

resource "aws_api_gateway_deployment" "db_connection" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  stage_name  = "test"
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = 200

  response_models = {
    "application/json" = "Empty"
  }

}


resource "aws_api_gateway_integration_response" "my_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.db_rest_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code
}

