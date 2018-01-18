const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const config = require('../config/config')
const boom = require("boom")
const base64Img = require('base64-img')
const path = require('path')
const sendJSONresponse = require('./shared')



async function listSubCategories(req,res,next){
    let urlParts = req.baseUrl.split("/")
    try {
        let categories = await Category.findById(urlParts[3])
        let subcategoriesList = categories.subcategories
        sendJSONresponse(res,200,subcategoriesList)   
    } catch (error) {
      return next (error)
    }
}


async function createSubCategory (req, res, next){
   try {
        let newSubcategory = new Subcategory(req.body)
        let createdSubCategory = await newSubcategory.save()
        sendJSONresponse(res,200,createdSubCategory)
   } catch (error) {
       return next (error)
   }
}

async function editSubCategory (req, res, next){
 try {
      let updatedSubcategory = await Subcategory.findByIdAndUpdate(req.params.subcategoryId, req.body, {new: true})
      sendJSONresponse(res,200, updatedSubcategory)
  
 } catch (error) {
     return next(error)
 }
  
}

async function deleteSubCategory (req, res, next){
  try {
          let removedSubcategory = await Subcategory.findByIdAndRemove(req.params.subcategoryId)
          sendJSONresponse(res,200,removedSubcategory)
  } catch (error) {
      return next(error)
  }
}  



  module.exports ={ 
    listSubCategories,
    createSubCategory,
    editSubCategory,
    deleteSubCategory
  }



  