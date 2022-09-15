resource "null_resource" "install_lambda_node_modules" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOT
      cd ./modules/resources/lambda-fn/
      npm i
      EOT
  }
}


resource "null_resource" "upload_shopping_app" {
  depends_on = [
    module.static_site.aws_s3_bucket
  ]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOT
    git clone https://github.com/daniel-guyton/angular-shopping-app.git ./shopping-app-download
    cd shopping-app-download
    git checkout main
    npm i
    NG_APP_API_GW=${module.resources.base_url} ng build
    aws s3 sync ./dist/shopping-app s3://danielguyton.me
    EOT
  }
}


resource "null_resource" "cleanup_files_after_upload" {
  depends_on = [
    null_resource.upload_shopping_app
  ]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<-EOT
    rm -rf ./shopping-app-download
    rm -rf ./modules/resources/lambda-fn/node_modules
    rm -rf ./modules/resources/lambda-fn/package-lock.json
    EOT
  }
}

resource "null_resource" "build_database" {
  triggers = {
    always_run = timestamp()
  }
  depends_on = [
    module.database.database_endpoint,
  ]

  provisioner "local-exec" {
    command = "/bin/bash run_all_sql.sh ${module.database.database_endpoint}"
  }
}
