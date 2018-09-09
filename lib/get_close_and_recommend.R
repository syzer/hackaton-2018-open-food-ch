

## deal with case where ingredient is not in expiry table
## either set days_till_expiry manually in that case
## or skip execution in loop entirely


get_list_of_items2use <- function(inventory, expiry_table, date, cutoff=3){
  days = c()
  cutoff_items = c()
  counter=1
  out_list=list()
  for (ix in 1:nrow(inventory)){
    item = inventory[ix,]
    # print(date)
    # print(item$DateBought)
    # print(expiry_table[expiry_table$id == item$id, "expiry"])
    days_till_expiry = expiry_table[expiry_table$id == item$id, "expiry"]-difftime(date, item$DateBought, units="days")
   # days_till_expiry = date + diff.Date(item$DateBought, expiry_table[expiry_table$id == item$id, "expiry"])
    if(days_till_expiry<cutoff){
      cutoff_items=c(cutoff_items, days_till_expiry)
    }
    item$days_till_expiration =days_till_expiry
    out_list[[counter]]=item
    counter=counter+1
  }
  new_inventory = Reduce(rbind, out_list)
  number_out = max(5, length(cutoff_items))
  number_out = min(number_out, nrow(inventory))
  new_inventory[order(new_inventory$days_till_expiration),][1:number_out,]
}




get_portion_recipes <- function(recipe_list, guests){
  recipe_list[unlist(lapply(recipe_list, function(x) x$properties$portions==guests))]
}

get_viable_recipes <- function(recipe_list, ingredients_to_use, eaters){
  recipe_list = get_portion_recipes(recipe_list, eaters)
  score_vec = numeric(length(recipe_list))
  for (ix in 1:length(recipe_list)){
    score = length(intersect(recipe_list[[ix]]$ingredientsArr$id, ingredients_to_use$id))
    score_vec[ix] = score
  }
  #  put_back = recipe_list[order(score_vec,decreasing=T)][1:3]
  put_back = recipe_list[order(score_vec,decreasing=T)][[1]]
  list(put_back$groupsArr$title, put_back$groupsArr$imgUrl, put_back$ingredientsArr)
}



get_instock_buy_table <- function(inventory, recipe_ingredients){
  ISBchar <- rep("Buy", nrow(recipe_ingredients))
  instock_indices = recipe_ingredients$id %in% inventory$id
  ISBchar[instock_indices] <- "in Stock"
  recipe_ingredients$Availability <- ISBchar
  recipe_ingredients[order(recipe_ingredients$Availability, decreasing=T),]
}

#some tests
# 
# my_recipes = get_viable_recipes(recipe_list, mC, 4)
# 
# rIngs = lapply(my_recipes, function(x) x$ingredientsArr)
