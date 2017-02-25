var express     = require('express');
var bodyParser  = require('body-parser');
var query       = require('./query');
var bcrypt      = require('bcrypt');
var session     = require('client-sessions');

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
app.use("/lightgallery", express.static(__dirname + '/lightgallery'));
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',  // random string to encrypt cookie
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    console.log("we have a session!");
    query('select * from admins where email=$1',[req.session.user.email], function(err, user) {
      if (user.rows[0]) {
        req.user = user.rows[0];
        delete req.user.password; // delete the password from the session
        req.session.user = user.rows[0];  //refresh the session value
        res.locals.user = user.rows[0]; // local allws user to be accessed in view
      }
      else{
        res.locals.user = null;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.get('/admin/signup', function(req, res){
  res.render("admin/signup");
});
app.post('/admin/signup', function(req, res){
  console.log("hereeee TYLER");
  var salt = bcrypt.genSaltSync(10);
  var generatedPass = bcrypt.hashSync(req.body.password, salt);
  query(`insert into admins(name, password, email) values('${req.body.name}', '${generatedPass}','${req.body.email}') returning *`, function(err, result){
    if(err){
      console.log(err);
      res.redirect('/admin/signup', {flash_message: err});
    }
    else{
      res.redirect('/admin/login');
    }
  });
});

  app.get('/admin/login', function(req, res){
    console.log('get login');
    res.render('admin/login');
  });

  app.post('/admin/login', function(req, res){
    console.log("post login");
    query('select * from admins where email=$1',[req.body.email], function(err, result){
      if(err){
        console.log(err);
      }
      else if(bcrypt.compareSync(req.body.password, result.rows[0].password )){
        console.log("log in works");
        req.session.user = result.rows[0];            // send user info in session
        res.redirect('/admin/'+result.rows[0].id);
      }
      else{
        console.log(result.rows[0].password);
        console.log("could not log in");
        res.redirect('/admin/login');
      }
    });
  });
  app.get('/admin/logout',function(req, res){
    req.session.reset();
    console.log('session destroyed');
    res.redirect('/admin/login');
  });



app.get('/admin/:id', function(req, res){
  query('select * from admins where id=$1',[req.params.id], function(err, result){
    if(err){
      console.log(err);
    }
    else{
      if((req.session && req.session.user) && req.session.user.id == result.rows[0].id){
        res.render('admin/profile', {saved_user: result.rows[0]});
      }
      else{
        res.render('page_not_found');
      }
    }
  });
});

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
app.get("/blog/create", requireLogin, function(req, res){
  res.render("newPost");
});
app.post("/blog/create", function(req, res){
  console.log(req.body.title);
    query(`insert into posts(title, body) values('${req.body.title.replace("'","''")}', '${req.body.body.replace("'","''")}')`, function(err, result){
      console.log(result.rows[0]);
      res.redirect("/blog");
    });
});
app.get("/blog/:id", function(req, res){
  query('select * from posts where id = $1', [req.params.id], function(err,result){
      res.render('post', {post: result.rows[0]});
  });
});

app.get("/photography", function(req, res){
  res.render("photography");
});
app.get("/", function(req, res){
  res.render("index");
});
app.get("/home", function(req, res){
  res.render("index");
});

app.get("/*", function(req, res){
  res.render('page_not_found');
});



function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.listen(process.env.PORT || 3000, function(){
  console.log("yeeeet");
});
