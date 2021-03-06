let express = require('express'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSainitizer = require('express-sanitizer');
    app = express();

let createBlog = require('./models/blogschema');

// Configure app
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSainitizer());
app.use(methodOverride('_method'));

// createBlog.create({
//     title: 'Orange',
//     image: 'https://images.unsplash.com/photo-1484256017452-47f3e80eae7c?ixlib=rb-0.3.5&s=f1af676eceb49746407f0f418349b962&auto=format&fit=crop&w=1050&q=80',
//     body: 'This is an orange good for vitamin C'
// });

app.get('/', (req, res) => {
    res.redirect('/blogs');
})

// Index Routes
app.get('/blogs', (req, res) => {
    createBlog.find({}, (err, newBlog) => {
        if (err) {
            res.send(err);
        } else {
            res.render('blog', {blogs: newBlog});
        }
    });
});

// New Routes
// GET
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

// Create Blog Routes
//POST
app.post('/blogs', (req, res) => {
    //Sanitize Body if the body html tag
    req.body.blog.body = req.sanitize(req.body.blog.body);
    createBlog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
})

//SHOW Route
app.get('/blogs/:id', (req, res) => {
    createBlog.findById(req.params.id, (err, viewBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('view', {view: viewBlog});
        }
    })
})

//EDIT 
app.get('/blogs/:id/edit', (req, res) => {
    createBlog.findById(req.params.id, (err, editData) => {
        if(err) {
            res.send(err);
        } else {
            res.render('edit', {edit: editData});
        }
    })
})

// UPDATE Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    createBlog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    })
})

//DELETE Blog
app.delete('blogs/:id', (req, res) => {
    createBlog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.send(err);
        } else {
            res.redirect('/blogs');
        }
    })
})

// Listen
app.listen(3500, () => {
    console.log('The server has been running ....');
});