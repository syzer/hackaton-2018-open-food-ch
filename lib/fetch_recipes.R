### fectch recipe ids and return recipes in format

# 


fetch_recipe_ids <- function(recipe_list, close_to_expiration){
  
  close_to_expiration_string = paste(close_to_expiration$Name, collapse=",")
  close_to_expiration_string=gsub(" ", "%20", close_to_expiration_string)
  
  id_list = fromJSON(paste("https://d588630f.eu.ngrok.io/recepies/[",close_to_expiration_string ,"]", sep=""))
  recipe_list = recipe_list[unlist(lapply(recipe_list, function(x) x$properties$portions==2))]
  id_list=unlist(id_list)
  recommended_recipes = recipe_list[unlist(lapply(recipe_list, function(x) x$groupsArr$id %in% id_list))]
  lapply(recommended_recipes, function(x) list(x$groupsArr$title, x$groupsArr$imgUrl, x$ingredientsArr))[1:3]

}
