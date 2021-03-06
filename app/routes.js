module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        db.collection('bets').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('index.ejs', {
            bets: result
          })
        })
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('bets').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user: req.user,
            bets: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/play', (req, res) =>{
        let randomNumber = Math.floor(Math.random() * 37) 
        let colorChose = req.body.name
        let money = 0
        let winnerColor;
        let result;
        
        randomNumber < 18 ? winnerColor = 'red' :
        randomNumber > 18 ? winnerColor = 'black' :
        randomNumber == 0 ? winnerColor = 'green' : null

        winnerColor === colorChose ? result = 'win' : result = 'lose'
        winnerColor === colorChose ? money += 500 : money += 500

        db.collection('bets').insert({colorChose, winnerColor, result, money}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        setTimeout(() => {res.redirect('/')},8000)
      })   
    })


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash bets
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash bets
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
