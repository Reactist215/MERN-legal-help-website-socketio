/**
 * Signin Firebase
 */

import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, useHistory } from 'react-router-dom';

import { Applogo } from '../Entryfile/imagepath.jsx';

import { loginActions, userActions } from '../store/actions';

const Loginpage = () => {
    const dispatch = useDispatch();
    const login = useSelector(state => state.login, shallowEqual);

    // component states
    const [submitted, setSubmitted] = useState(false);
    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const { email, password } = state;

    // form handlers
    const loginclick = useCallback(() => {
        setSubmitted(true);
        // history.push('/home')
        if (email && password) {
            dispatch(loginActions.submitLogin({ email, password }));
        }
    }, [email, password]);

    const handleChange = useCallback(e => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    // render
    return (
        <div className="main-wrapper">
            <Helmet>
                <title>Login - HRMS Admin Template</title>
                <meta name="description" content="Login page" />
            </Helmet>
            <div className="account-content">
                {/* <a href="/purple/applyjob/joblist" className="btn btn-primary apply-btn">Apply Job</a> */}
                <div className="container">
                    {/* Account Logo */}
                    <div className="account-logo">
                        <Link to="/">
                            <img src={Applogo} alt="Go to Landing Page" />
                        </Link>
                    </div>
                    {/* /Account Logo */}
                    <div className="account-box">
                        <div className="account-wrapper">
                            <h3 className="account-title">Login</h3>
                            <p className="account-subtitle">Access to our dashboard</p>
                            {/* Account Form */}
                            <form onSubmit={e => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="text"
                                        name="email"
                                    />
                                    {submitted && !email && (
                                        <div className="text-danger">Email is required</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col">
                                            <label>Password</label>
                                        </div>
                                        <div className="col-auto">
                                            <a className="text-muted" href="/purple/forgotpassword">
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>
                                    <input
                                        onChange={handleChange}
                                        className="form-control"
                                        type="password"
                                        name="password"
                                    />
                                    {submitted && !password && (
                                        <div className="text-danger">Password is required</div>
                                    )}
                                </div>
                                {submitted &&
                                    login.error &&
                                    Object.keys(login.error).map(key => (
                                        <div key={key} className="text-danger">
                                            <strong>{key}</strong> : {login.error[key]}
                                        </div>
                                    ))}
                                <div className="form-group text-center">
                                    <a className="btn btn-primary account-btn" onClick={loginclick}>
                                        Login
                                    </a>
                                </div>
                                <div className="account-footer">
                                    <p>
                                        Don't have an account yet?{' '}
                                        <Link to="/register">Register</Link>
                                    </p>
                                </div>
                            </form>
                            {/* /Account Form */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default withRouter(Loginpage);
