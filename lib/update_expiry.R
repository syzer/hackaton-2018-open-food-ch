
#Structure EXPIRY:      Name | avg_days | std_days
#                       char | integer  | double
#



# update expiry table if user gives input
#
# @param: expiry_table: table of expected life span of products (data.frame)
# @param: item: item name                                       (char)
# @param: change_reason [spoiled / still_good]                  (char)
update_expiry_table <- function(expiry_table, item, change_reason){
  if (change_reason =="spoiled"){
    expiry_table[expiry_table$Name == item$Name, "avg_days"] = expiry_table[expiry_table$Name == item$Name, "avg_days"]-1 
  } else if (change_reason == "still_good"){
    expiry_table[expiry_table$Name == item$Name, "avg_days"] = expiry_table[expiry_table$Name == item$Name, "avg_days"]+1
  }
  expiry_table
}

