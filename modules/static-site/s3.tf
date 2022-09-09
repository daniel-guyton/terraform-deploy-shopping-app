resource "aws_s3_bucket" "website_bucket" {
  bucket        = "danielguyton.me"
  acl           = "public-read"
  policy        = data.aws_iam_policy_document.website_policy.json
  force_destroy = true
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

