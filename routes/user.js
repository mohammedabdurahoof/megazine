var express = require('express');
const { localsAsTemplateData, handlebars } = require('hbs');
const { NotFound } = require('http-errors');
var router = express.Router();
var userHelper = require('../helpers/user-helper');
const { post } = require('./admin');
const nodeMailer = require("nodemailer")


/* GET home page. */
router.get('/', async function(req, res, next) {
  let post = await userHelper.getPosts()
  let recent = post[post.length-1]
  let three = [post[post.length-2],post[post.length-3],post[post.length-4]]
  let popularPosts = [post[1],post[2],post[3],post[4]]
  let mostPopularPosts=post[1]
  let newAdded = [post[post.length-1],post[post.length-2]]
  let category = await userHelper.getCategory()
  let politics = await userHelper.basedOnCategories('Politics',3)
  let business = await userHelper.basedOnCategories('Business',3)
  let health = await userHelper.basedOnCategories('Health',3)
  let design = await userHelper.basedOnCategories('Design',3)
  let sports = await userHelper.basedOnCategories('sports',3)
  let mobile = await userHelper.basedOnCategories('MOBILE',3)
  res.render('user/index', { user:true,recent,three,popularPosts,newAdded,mostPopularPosts,politics,post});
});

router.get('/about',async(req,res,next)=>{
  let post = await userHelper.getPosts()
  let recent = post[post.length-1]
  let three = [post[post.length-2],post[post.length-3],post[post.length-4]]
  let popularPosts = [post[1],post[2],post[3],post[4]]
  res.render('user/about',{user:true,recent,three,popularPosts})
})

router.get('/contact',(req,res,next)=>{
  res.render('user/contact',{user:true})
})

router.get('/categories',(req,res,next)=>{
  res.render('user/categories',{user:true})
})

router.get('/readPost/:id',async(req,res,next)=>{
  let post = await userHelper.findPost(req.params.id)
  let posts = await userHelper.getPosts()
  let popularPosts = [posts[1],posts[2],posts[3],posts[4]]
  res.render('user/blog-single',{user:true,post,popularPosts})
})

router.get('/allposts',async(req,res,next)=>{
  let posts = await userHelper.getPosts()
  res.render('user/all-post',{user:true,posts})
})

router.get('/category/:category',async(req,res,next)=>{
  let name = req.params.category
  let category = await userHelper.basedOnCategories(name,10)
  let posts = await userHelper.getPosts()
  let popularPosts = [posts[1],posts[2],posts[3],posts[4]]
  res.render('user/categories',{user:true,category,name,popularPosts})
})

router.get('/autocomplete/',async function(req,res,next){
  var regex = new RegExp(req.query["term"],'i')
  var postFilter = await userHelper.searchPost(regex).then((data)=>{
    var result = []
                
                  if(data && data.length && data.length>0){
                    data.forEach(user=>{
                      let obj = {
                        id:user._id,
                        label: user.data.title
                      }
                      result.push(obj)
                    })
                  }else{
                    // let obj = {
                    //   id:null,
                    //   label: "'Not found search result'"
                    // }
                    // result.push(obj)
                  }
                res.jsonp(result)
  })
  


})

router.post('/search-post',(req,res,next)=>{
  console.log(req.body.id)
  res.redirect('/readPost/'+req.body.id)
})

router.post('/contact',(req,res,next)=>{
  console.log(req.body)

  const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'marp527313@gmail.com',
      pass: '31352777'
    }
  })

  const mailOptions = {
    from: req.body.email,
    to: 'marp527313@gmail.com',
    subject: `message from ${req.body.fname} ${req.body.lname} `,
    text :`${req.body.message}\r\n\r\n\r\ncontact numbur: ${req.body.tel}`
  }

  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      console.log(error)
      res.send('error')
    }else{
      console.log('Email sented:'+info.response)
      res.send('success')
    }
  })



})

router.put('/like',(req,res,next)=>{
  pos
})

module.exports = router;
