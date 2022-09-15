terraform {
  backend "s3" {
    bucket         = "shopping-app-backend"
    key            = "terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "shopping-app-backend"
  }
}
