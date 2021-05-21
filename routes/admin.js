const { response } = require('express');
var express = require('express');
const { handlebars } = require('hbs');
var router = express.Router();
var adminHelper= require('../helpers/admin-helper')

const varifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin')
  }
}



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/login',{error:req.session.error})
    req.session.error=false
});

router.get('/index',varifyLogin,(req,res,next)=>{
  adminHelper.viewPost().then(async(posts)=>{
    let category = await adminHelper.getCategory()
  res.render('admin/index',{admin:true,posts,user:req.session.admin,category})
  })
})

router.post('/login',(req,res,next)=>{
  adminHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.user
      req.session.loggedIn=true
      res.redirect('/admin/index')
    }else{
      req.session.error='invalied username or password'
      res.redirect('/admin')
    }
  
  })
})



router.get('/add-post',varifyLogin,async(req,res,next)=>{
  let category = await adminHelper.getCategory()
  res.render('admin/add-post',{admin:true,user:req.session.admin,category})
})

router.post('/add-post',(async(req,res,next)=>{
  let date= new Date()
  await adminHelper.addPost(req.body,date).then((id)=>{
    if (req.files.image){
      let image = req.files.image
      image.mv('./public/images/post/'+id+'.jpg',(err,done)=>{
        if (!err){
          res.redirect('/admin/index')
          adminHelper.resizeImage(id)
        }else{
          console.log(err)
        }
      })
    }
    if (req.files.personImage){
      let imagePerson = req.files.personImage
      imagePerson.mv('./public/images/post/'+id+'author.jpg',(err,done)=>{
        if (!err){
          adminHelper.resizePersonImage(id)
        }else{
          console.log(err)
        }
      })
    }
    
  })
}))

router.get('/edit-post/:id',varifyLogin,async(req,res,next)=>{
  let category = await adminHelper.getCategory()
  let post = await adminHelper.getPostDetiles(req.params.id)
  res.render('admin/edit-post',{admin:true,post,user:req.session.admin,category})
})

router.post('/edit-post/:id',(req,res,next)=>{
  adminHelper.updatePost(req.params.id,req.body).then(()=>{
    res.redirect('/admin/index')
    if (req.files.image){
      let image = req.files.image
      image.mv('./public/images/post/'+req.params.id+'.jpg',(err,done)=>{
        if (!err){
          adminHelper.resizeImage(req.params.id)
        }else{
          console.log(err)
        }
       
      })
    }
    if (req.files.personImage){
      let imagePerson = req.files.personImage
      imagePerson.mv('./public/images/post/'+req.params.id+'author.jpg',(err,done)=>{
        if (!err){
          adminHelper.resizePersonImage(req.params.id)
        }else{
          console.log(err)
        }
      })
    }
  })
})

router.get('/delect-post',varifyLogin,(req,res,next)=>{
  adminHelper.delectPost(req.query.id).then(()=>{
    res.redirect('/admin/index')
  })
})

router.get('/add-admin',varifyLogin,(req,res)=>{
  res.render('admin/add-admin',{admin:true,error:req.session.error,user:req.session.admin})
  req.session.error=false
})

router.post('/add-admin',(req,res,next)=>{
  adminHelper.addAdmin(req.body).then((response)=>{
    req.session.admin=response
    req.session.loggedIn=true
    res.redirect('/admin/index')
    if (req.files.image){
      let image = req.files.image
      image.mv('./public/images/user-profile/'+response._id+'.jpg')
    }
  }).catch((err)=>{
    req.session.error='passwords are diffrent'
    res.redirect('/admin/add-admin')
  })
  
})

router.get('/logout',varifyLogin,(req,res)=>{
  req.session.admin=null
  res.redirect('/admin')
})

router.get('/change-password',varifyLogin,(req,res)=>{

})

router.post('/category',varifyLogin,(req,res)=>{
  adminHelper.addCategory(req.body).then(()=>{
    res.redirect('/admin/index')
  })
  
})

module.exports = router;
