const express = require('express');
const mainController = require('../controllers/mainController');

module.exports = (authProvider) => {
    
    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // auth routes
    router.get('/signin',
        authProvider.signIn({
            successRedirect: "/",
        }),
    );

    router.get('/signout',
        authProvider.signOut({
            successRedirect: "/",
        }),
    );

    // secure routes
    router.get('/id',
        authProvider.isAuthenticated(),
        mainController.getIdPage
    );

    router.get('/profile',
        authProvider.isAuthenticated(),
        authProvider.getToken({
            resource: authProvider.appSettings.remoteResources.graphAPI
        }),
        mainController.getProfilePage
    ); // get token for this route to call web API

    router.get('/tenant',
        authProvider.isAuthenticated(),
        authProvider.getToken({
            resource: authProvider.appSettings.remoteResources.armAPI
        }),
        mainController.getTenantPage
    ); // get token for this route to call web API

    // error
    router.get('/error', (req, res) => res.redirect('/401.html'));

    // unauthorized
    router.get('/unauthorized', (req, res) => res.redirect('/500.html'));

    // 404
    router.get('*', (req, res) => res.redirect('/404.html'));

    return router;
}