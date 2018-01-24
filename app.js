let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();

// Configure app
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('blog');
});

// Listen
app.listen(3500, () => {
    console.log('The server has been running ....');
});