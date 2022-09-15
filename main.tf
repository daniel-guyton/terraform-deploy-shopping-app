locals {
  mydb_enpoint = module.database.database_endpoint
}

module "resources" {
  source = "./modules/resources"
  depends_on = [
    module.database,
    null_resource.install_lambda_node_modules
  ]
  db_input_endpoint = local.mydb_enpoint
}


module "database" {
  source = "./modules/db"
}

module "static_site" {
  source = "./modules/static-site"
}

output "api-invoke_url" {
  value = module.resources.base_url
}

output "db_address" {
  value = local.mydb_enpoint
}


