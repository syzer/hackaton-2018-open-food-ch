# Source File - table update functions
#
#Structure INVENTORY:    id | Name | Amount | Unit | DateBought
#                       int | char | double | char | POSIXct
#


#add bought item to inventory
# 
# @param: inventory:   dataframe INGREDIENTS    :(data.frame)
# @param: groceries:   dateaframe ITEMS         :(data.frame)

update_inventory_buy <- function(inventory, groceries){
  
  ##Todo: Unit Converison here
  #
  groceries = unit(convert_groceries)  #
  
  for (item in 1:nrow(groceries)){
  
    if (groceries[item, "id"] %in% inventory$id  && inventory[inventory$id == groceries[item, "id"], "DateBought"] == groceries[item, "DateBought"]){
      inventory[inventory$id == groceries[item, "id"], "Amount"] = inventory[inventory$id == groceries[item, "id"], "Amount"] + groceries[item, "Amount"]
    } else {
      inventory = rbind(inventory, groceries[item,])
      print(nrow(inventory))
    }
  }
  inventory
}




# subtract the ingredients used for cooking from inventory list and return the updated inventory
# 
# @param: inventory:           dataframe INVENTORY    :(data.frame)
# @param: cooking_ingredients  dataframe INVENTORY    :(data.frame)

# subtracts the amounts used in the recipe from the inventory and returns the updated inventory

update_inventory_cook <- function(inventory, cooking_ingredients){
  ##todo unit convert line
  #cooking_ingredients = unit_convert_line()
  #
  for (ingredient in cooking_ingredients){
    ## what if there is an item with multiple occurrences
    inventory[inventory$Name==ingredient$Name, "Amount"] = max(inventory[inventory$Name==ingredient$Name, "Amount"] - ingredient$Amount,0) 
  }
  inventory
}





# #add bought item to inventory
# # 
# # @param: inventory:   dataframe INGREDIENTS    :(data.frame)
# # @param: name:        Name of item bought item :(char)
# # @param: amount:      Amount of item bought    :(double)
# # @param: unit:        Unit of item bought      :(char)
# # @param: date_bought: Date Bought              :(POSIXct)
# 
# update_inventory_buy <- function(inventory, id, amount, unit, date=Sys.Date()){
#   
#   ##Todo: Unit Converison here
#   #
#   #amount = unit_convert(amount, unit)
#   #
#   
#   if (unit == inventory[inventory$Name == name, "Date"] == date){
#     inventory[inventory$Name == name, "Amount"] = inventory[inventory$Name == name, "Amount"] + amount
#   } else {
#     inventory(rbind(inventory, data.frame(Name=name, Amount=amount, Unit=unit, DateBought=date)))
#   }
#   inventory
# }
