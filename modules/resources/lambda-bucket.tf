resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = "danielg-serverless-2022-v2"
  force_destroy = true
}

data "archive_file" "lambda_dbconnect" {
  type = "zip"

  source_dir  = "${path.module}/lambda-fn/dist"
  output_path = "${path.module}/lambda-fn.zip"
}

resource "aws_s3_object" "lambda_db_connection" {

  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "lambda-fn.zip"
  source = data.archive_file.lambda_dbconnect.output_path

  source_hash = filemd5(data.archive_file.lambda_dbconnect.output_path)
}

resource "aws_s3_bucket_public_access_block" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

