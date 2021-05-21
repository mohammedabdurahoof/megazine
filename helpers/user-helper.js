const db = require('../confiq/connection')
const collection =require('../confiq/collections')
const { ObjectID } = require('mongodb')

module.exports={
    getPosts:(limit)=>{
        return new Promise(async(resolve,reject)=>{
           let post = await db.get().collection(collection.POST_COLLECTION).find().toArray()
               resolve(post)
           
        })
    },
    basedOnCategories:(category,limit)=>{
        return new Promise (async(resolve,reject)=>{
            let posts = await db.get().collection(collection.POST_COLLECTION).find({'data.category':category}).sort({date:-1}).limit(limit).toArray()
            resolve(posts)
        })
    },
    getCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let posts=[]
            let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            let post = async function  (category){
                let post = await db.get().collection(collection.POST_COLLECTION).find({'data.category':category}).toArray()
                
                return 'hi'
            }
            let p = await post()
             categories.forEach((category) => {
                let obj = {
                    category:category.category,
                    post: post(category) 
                }
                posts.push(obj)
            });
            console.log(posts)
            resolve(categories)
        })
    },
    findPost:(postId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.POST_COLLECTION).findOne({_id:ObjectID(postId)}).then((post)=>{
                resolve(post)
            })
        })
    },
    searchPost:(regex)=>{
        return new Promise(async(resolve,reject)=>{
            var postFilter = await db.get().collection(collection.POST_COLLECTION).find({'data.title':regex},{'data.title':1}).sort({'date':-1}).sort({'_id':-1}).limit(20).toArray()
            
            resolve(postFilter)
        })
    }
}