resource "aws_db_instance" "default" {
  allocated_storage   = 20
  engine              = "mysql"
  engine_version      = "5.7"
  instance_class      = "db.t3.micro"
  db_name             = "mydb"
  username            = "tstdb01"
  password            = "tstdb01234" # use vault later on to secure password
  storage_type        = "gp2"
  skip_final_snapshot = true
  publicly_accessible = true

  tags = {
    Name = "Practice DB Server"
  }
}


output "database_endpoint" {
  value = aws_db_instance.default.address
}
