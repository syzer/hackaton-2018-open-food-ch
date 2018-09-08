
#Structure EXPIRY:      id | Name | avg_days | std_days
#                      int | char | integer  | double
#



# update expiry table if user gives input
#
# @param: expiry_table: table of expected life span of products (data.frame)
# @param: item: item id                                         (int)
# @param: change_reason [spoiled / still_good]                  (char)
update_expiry_table <- function(expiry_table, item, change_reason){
  if (change_reason =="spoiled"){
    expiry_table[expiry_table$id == item$id, "expiry"] = expiry_table[expiry_table$id == item$id, "avg_days"]-1 
  } else if (change_reason == "still_good"){
    expiry_table[expiry_table$id == item$id, "expiry"] = expiry_table[expiry_table$id == item$id, "avg_days"]+1
  }
  expiry_table
}

