var express     = require('express');
var bodyParser  = require('body-parser');
var query       = require('./query');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//to serve up static resources.(etc. js/~.js)
app.use(express.static("/"));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/resources", express.static(__dirname + '/resources'));
app.use("/font-awesome", express.static(__dirname + '/font-awesome'));

app.get("/blog", function(req, res){
    query('select * from posts', function(err, result){
      res.render('blog', {posts: result.rows} );
    });
});

app.get("/blog/delete/:id", function(req, res){
  query('delete from posts where id = $1',[req.params.id], function(err, result){
      res.redirect("/blog");
  });
});
app.get("/blog/create", function(req, res){
  res.render("newPost");
});
app.post("/blog/create", function(req, res){
  console.log(req.body.title);
    query(`insert into posts(title, body) values('${req.body.title.replace("'","''")}', '${req.body.body.replace("'","''")}')`, function(err, result){
      res.redirect("/blog");
    });
});
app.get("/blog/:id", function(req, res){
  query('select * from posts where id = $1', [req.params.id], function(err,result){
      res.render('post', {post: result.rows[0]});
  });
});
app.get("/", function(req, res){
  res.render("portfolio");
});

app.listen(3000, function(){
  console.log("yeeeet");
});
