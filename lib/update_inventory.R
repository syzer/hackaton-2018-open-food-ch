# Source File - table update functions
#

# unit conversion

convert_unit <- function(inventory, unit_lookup){
  inventory[inventory$Unit=="<NA>", "Unit"]="piece"
  for (ix in 1:nrow(inventory)){
    unit_line = unit_lookup[unit_lookup$id==inventory[ix, "id"] & unit_lookup$unit==inventory[ix, "Unit"],]
    if (nrow(unit_line>1)){
      unit_line = unit_line[1,]
    }
    inventory[ix, "Amount"] = inventory[ix, "Amount"] * unit_line$faktor
    inventory[ix, "Unit"] = unit_line$unit_new
  }
  inventory
}





#Structure INVENTORY:    id | Name | Amount | Unit | DateBought
#                       int | char | double | char | POSIXct
#

#add bought items to inventory
# 
# @param: inventory:   dataframe INVENTORY    :(data.frame)
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
  cooking_ingredients = unit_convert(cooking_ingredients)
  inventory = unit_convert(inventory)
  #
  for (ix in 1:nrow(cooking_ingredients)){
    ingredient = cooking_ingredients[ix,]
    inventory_entries = nrow(inventory[inventory$id==cooking_ingredients[ix, "id"],])
    if (inventory_entries==1){
      inventory_ix = which(inventory$id==ingredient$id)
      inventory[inventory_ix, "Amount"] = max(inventory[inventory_ix, "Amount"] - ingredient$Amount,0)
      if (inventory[inventory_ix, "Amount"]==0){
        inventory = inventory[-inventory_ix,]
      }
    }
    else if (inventory_entries>1){
      ingredient_inv_subset = inventory[inventory$id==ingredient$id,]
      ingredient_inv_subset =ingredient_inv_subset[order(ingredient_inv_subset$DateBought),]
      
      needed_amount = ingredient$Amount
      
      for (jx in 1:nrow(ingredient_inv_subset)){
        curr_ingredient = ingredient_inv_subset[jx,]
        inventory_ix = which(inventory$id == curr_ingredient$id & inventory$DateBought == curr_ingredient$DateBought)
        needed_amount = curr_ingredient$Amount - needed_amount
        
        if (needed_amount<0){
          inventory = inventory[-inventory_ix,]
          needed_amount = abs(needed_amount)
        } else {
          inventory[inventory_ix, "Amount"] = needed_amount
          break
        }
      }
    }
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


update_inventory_spoiled <- function(inventory, id, DateBought){
  ix = which(inventory$id==id & inventory$DateBought == DateBought)
  if(length(ix)>0){
    inventory=inventory[-ix,]
  }
  inventory  
}
