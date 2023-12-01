
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
main();
async function main(){
await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});
}
const UserData={
  userName: String,
  password: String
}
const postSchema = {
  userName: String,
  userId: String,
  title: String,
  content: String,
  time: Date
};
const Userdata=mongoose.model("UserData",UserData);
const Post = mongoose.model("Post", postSchema);


app.get("/",(req,res)=>{
  res.render("login",{showAlert:false});
});

app.get("/login",(req,res)=>{
  res.render("login",{showAlert:false});
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/home",async (req,res)=>{
  await Post.find({})
  .then( posts =>{
      res.render("home", {posts: posts});
  })
  .catch(err=>console.log(err));
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});


app.post("/register", async (req,res)=>{
  const user=new Userdata({
      userName: req.body.username,
      password: req.body.password
  });
  await user.save();
  res.redirect("/home");
});

app.post("/login",(req,res)=>{
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  Userdata.findOne({ userName: username })
  .then((user) => {
      // Check if the user object exists

      if (user.password === password) {
        res.redirect("/home");
      } else {
        console.log("error");
        res.render('login',{showAlert: true});

      }
    })
  .catch((error) => {
    console.log(error);
        res.render('login',{showAlert: true});
  });

});


app.post("/compose", async function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    time:Date.now()
  });
  
  await post.save();
  res.redirect('/home');
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;

  Post.findById(requestedPostId)
  .then(post =>{
    res.render("post", {
      title: post.title,
      content: post.content,
      time:post.time
    });
  });

});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
