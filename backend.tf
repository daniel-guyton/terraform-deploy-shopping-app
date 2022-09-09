terraform {
  backend "remote" {
    organization = "danielguyton"
    workspaces {
      name = "terraform-deploy-shopping-app"
    }
  }
}
