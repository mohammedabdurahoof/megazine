const db = require('../confiq/connection')
const collection =require('../confiq/collections')
const objectId = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const resizer = require('node-image-resizer')
const { response } = require('express')
const sharp = require('sharp')

module.exports={
    addPost:(data,date)=>{
        return new Promise(async(resolve,reject)=>{
            let dd=date.getDate()
            let mm=date.getMonth()+1
            let yyyy=date.getFullYear()
            let time=date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
            date= dd+'/'+mm+'/'+yyyy+', '+time
            await db.get().collection(collection.POST_COLLECTION).insertOne({data,date:date}).then((data)=>{
                resolve(data.ops[0]._id)
            })

        })
    },
    viewPost:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.POST_COLLECTION).find().toArray().then((posts)=>{
                resolve(posts)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
           let user =await db.get().collection(collection.ADMIN_COLLECTION).findOne({user_name:userData.username})
            if(user){
                bcrypt.compare(userData.password,user.pw).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('[assword is inccrout')
                        response.status=false
                        resolve(response)
                    }
                })
            }else{
                console.log('user not found');
                response.status=false
                resolve(response)
            }
            
        })
    },
    getPostDetiles:(postId)=>{
      return new Promise((resolve,reject)=>{
          db.get().collection(collection.POST_COLLECTION).findOne({_id:objectId(postId)}).then((posts)=>{
              resolve(posts)
          })
      })
  },
  updatePost:(postId,postUpdate)=>{
      return new Promise((resolve,reject)=>{
          db.get().collection(collection.POST_COLLECTION).updateOne({_id:objectId(postId)},{
              $set:{
                'data.title':postUpdate.title,
                'data.aouther':postUpdate.aouther,
                'data.article':postUpdate.article,
                'data.category':postUpdate.category
              }
          }).then((response)=>{
              resolve()
          })
      })
  },
  delectPost:(postId)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.POST_COLLECTION).removeOne({_id:objectId(postId)}).then((response)=>{
            resolve(response._id)
        })
      })
      
  },
  addAdmin:(adminDetiles)=>{
      return new Promise(async(resolve,reject)=>{
          if(adminDetiles.pw === adminDetiles.pw_confirm){
            adminDetiles.pw = await bcrypt.hash(adminDetiles.pw,10)
            adminDetiles.pw_confirm = await bcrypt.hash(adminDetiles.pw_confirm,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminDetiles).then((response)=>{
                resolve(response.ops[0])
            })
            
        }else{
            reject('error')
        }
          
      })
  },
  resizeImage:(id)=>{
      let originalImage = './public/images/post/'+id+'.jpg'
      let resizeImageBig = './public/images/post/post-thumbnails/big_'+id+'.jpg'
      let resizeImageMedium = './public/images/post/post-thumbnails/medium_'+id+'.jpg'
      let resizeImageSmall = './public/images/post/post-thumbnails/small_'+id+'.jpg'
      sharp(originalImage).resize({height:1140,width:1900}).toFile(resizeImageBig)
      sharp(originalImage).resize({height:300,width:500}).toFile(resizeImageMedium)
      sharp(originalImage).resize({height:400,width:300}).toFile(resizeImageSmall)

  },
  addCategory:(categoryName)=>{
      return new Promise((resolve,reject)=>{
          db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryName).then(()=>{
              resolve()
          })
      })
  },
  getCategory:()=>{
      return new Promise(async(resolve,reject)=>{
          let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
          resolve(category)
      })
  },
  resizePersonImage:(id)=>{
      
    let originalImage = './public/images/post/'+id+'author.jpg'
    let resizeImage = './public/images/post/author-images/'+id+'author.jpg'
    sharp(originalImage).resize({height:338,width:388}).toFile(resizeImage)

  }
}