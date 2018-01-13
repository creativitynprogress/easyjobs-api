const Category = require('../models/category')
const config = require('../config/config')
const boom = require("boom");

var sendJSONresponse = function (res, status, content) {
    res.status(status).json(content)
  }


  async function listCategories(req,res,next){
      try {
          let categories = await Category.find({})
          if(categories){
              sendJSONresponse(res,200,{categories})
          }else{
              throw boom.badRequest('Error al obtener las categorias, no hay, no existe')
          }
      } catch (error) {
        return next (error)
      }
  }

  async function createCategory (req, res, next){
     try {
          let usuRole = req.user.role 

          if(usuRole !== 'Admin'){ /// check if reciebe the role 
              throw boom.unauthorized('No tienes los provilegios para acceder a esto') /// no lo saca
          }else{
              //// falta validar que no se repitan  los nombres de caricaturas
              let newCategory = new Category(req.body) 
              let createdCategory = await newCategory.save()
              if(createdCategory){
                  sendJSONresponse(res,201, {category: createdCategory})
              }else{
                  throw boom.badData('Bad body')
              }
          }

     } catch (error) {
         return next (error)
     }
  }

  async function editCategory (req, res, next){
   try {
    let usuRole = req.user.role 
    
    if(usuRole !== 'Admin'){ /// check if reciebe the role 
        throw boom.unauthorized('No tienes los provilegios para acceder a esto')
    }else{
        let updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, {new: true})
        if(updatedCategory){
            sendJSONresponse(res,200, {updatedCategory})
        }else{
            throw boom.badRequest('Bad body')
        }
    }
   } catch (error) {
       return next(error)
   }
    
  }

  async function deleteCategory (req, res, next){
    try {
        let usuRole = req.user.role 
        
        if(usuRole !== 'Admin'){ /// check if reciebe the role 
            throw boom.unauthorized('No tienes los provilegios para acceder a esto')
        }else{
            let removedCategory = await Category.findByIdAndUpdate(req.params.categoryId)
            if(removedCategory){
                sendJSONresponse(res,200,{msg: "Categoria eliminada exitosamente prro"})
            }else{
                throw boom.badRequest('Error al eliminar categoria, no se encontro esa categoria')
            }
        }
    } catch (error) {
        return next(error)
    }
  }  

  module.exports ={
    listCategories,
    createCategory,
    editCategory,
    deleteCategory
  }