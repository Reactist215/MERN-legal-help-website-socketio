const _ = require('lodash');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const gravatar = require('gravatar');
const socialAuthActions = require('../actions/socialAuthActions');

/** Middleware */
const {
    checkRegistrationFields,
    checkLoginFields,
    createErrorObject,
    customSocialAuthenticate
} = require('../middleware/authenticate');

/**
 * @description  POST /register
 * @param  {} [checkRegistrationFields]
 * @param  {} request
 * @param  {} response
 * @access public
 */
// router.post('/register', [checkRegistrationFields], (req, res) => {
router.post('/register', [checkRegistrationFields], (req, res) => {
    let errors = [];
    const { firstName, lastName, phone, password, email } = req.body;
    User.findOne({ email }).then(user => {
        if (user) {
            errors.push({ param: 'email', msg: 'Email is already taken' });
            console.log('[user]', createErrorObject(errors));
            return res.send({ errors: createErrorObject(errors) });
        }
        /** Assign Gravatar */
        const avatar = gravatar.url(email, {
            s: '220',
            r: 'pg',
            d: 'identicon'
        });
        const newUser = new User({
            firstName,
            lastName,
            phone,
            password,
            from: 'custom-db',
            role: 'user',
            photoURL: avatar,
            email
        });

        newUser
            .save()
            .then(userData => {
                const user = _.omit(userData.toObject(), ['password']);

                const token = jwt.sign(user, process.env.JWT_SECRET, {
                    expiresIn: 18000
                });

                res.status(200).send({
                    auth: true,
                    access_token: `Bearer ${token}`,
                    user
                });
            })
            .catch(err => {
                console.log('[be] err', err);
                res.send({
                    err,
                    error: 'Something went wrong, Please check the fields again'
                });
            });
    });
});

/**
 * @description POST /login
 * @param  {} checkLoginFields
 * @param  {} request
 * @param  {} response
 * @access public
 */
// router.post('/login', async (req, res) => {
router.post('/login', checkLoginFields, async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).select('-password');

    if (!user) {
        return res.status(404).send({
            error: 'No User Found'
        });
    }

    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: 18000 });

    res.status(200).send({ auth: true, access_token: `Bearer ${token}`, user });
});

router.get('/access-token', async (req, res) => {
    const { access_token } = req.query;
    try {
        const token = access_token.replace('Bearer ', '');
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id }).select('-password');

        const updatedAccessToken = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: 18000
        });

        res.status(200).send({ auth: true, access_token: `Bearer ${updatedAccessToken}`, user });
    } catch (error) {
        res.status(401).send({ message: 'unAuthorized' });
    }
});

/**
 * @description POST /logout
 * @param  {} request
 * @param  {} response
 * @access public
 */
router.post('/logout', async (req, res) => {
    const user = await User.findOne({ username: req.body.username }).select('-password');

    if (!user) {
        return res.status(404).send({
            error: 'No User Found'
        });
    }

    res.status(200).send({ success: true });
});

/** Social Auth Routes */
router.get('/google', customSocialAuthenticate('google'));
router.get('/facebook', customSocialAuthenticate('facebook'));

/** Social Auth Callbacks */
router.get('/google/redirect', passport.authenticate('google'), socialAuthActions.google);
router.get('/facebook/redirect', passport.authenticate('facebook'), socialAuthActions.facebook);

module.exports = router;
