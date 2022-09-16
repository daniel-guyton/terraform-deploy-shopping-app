#!/bin/bash
declare -a array=('./data-definition.sql' './test-data.sql')
for file in "${array[@]}";
  do MYSQL_PWD=tstdb01234 mysql -h $1 -e "source $file" -u tstdb01;
done