const express = require('express')
const hbs = require('express-handlebars')
const cookieSession = require('cookie-session')

const app = express();

const PORT = process.env.PORT || 3000;

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie session
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'CSP',
    keys: ['key1', 'key2']
}));

// hbs
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// static imports
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/assets', express.static(__dirname + '/views/assets'));

// middleware
app.use((req, res, next) => {
    // check requested route is login
    if (req.path.includes('login')) {
        if (req.session && req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            next();   
        }
    } else {
        if (req.session && req.session.isLoggedIn) {
            next();
        } else {
            res.redirect('login')
        }
    }
});

// views
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Cookie-Session App',
        username: req.session.username,
        maxAge: req.session.maxAge,
        scripts: ['/assets/js/home.js']
    });
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Cookie-Session App ',
        scripts: ['/assets/js/login.js']
    });
});

// actions
app.post('/actions/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});
app.post('/actions/login', (req, res) => {

    const username = req.body && req.body.username;
    const password = req.body && req.body.password;
    const rememberMe = req.body && req.body.rememberMe;

    if (username === 'admin' && password === 'admin') {
        const maxAge = 14 * 24 * 3600000;     // number_of_days * hours_a_day * one_hour(in milliseconds)
        req.sessionOptions.maxAge = rememberMe ? maxAge : req.sessionOptions.maxAge;
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.maxAge = req.sessionOptions.maxAge;

        res.redirect('/');
        return;
    }

    res.redirect('/login?error=Invalid Credentials');
});

// api
app.post('/api/logout', (req, res) => {
    req.session = null;
    res.json();
});
app.post('/api/login', (req, res) => {

    const username = req.body && req.body.username;
    const password = req.body && req.body.password;
    const rememberMe = req.body && req.body.rememberMe;

    if (username === 'admin' && password === 'admin') {
        const maxAge = 14 * 24 * 3600000;     // number_of_days * hours_a_day * one_hour(in milliseconds)
        req.sessionOptions.maxAge = rememberMe ? maxAge : req.sessionOptions.maxAge;
        req.session.isLoggedIn = true;
        req.session.username = username;
        req.session.maxAge = req.sessionOptions.maxAge;

        res.json();
        return;
    }

    res.status(401).json();
});

// entry point
app.listen(PORT, () => console.log(`Server started on ${PORT}`));