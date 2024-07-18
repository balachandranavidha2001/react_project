import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

import './Login.css';
import './assets/css/bootstrap.css';
import './assets/css/app.css';
import './assets/css/icons.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Encrypt the password
        const encryptedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

        const loginData = {
            countryCodeId: "249",
            username: username,
            password: encryptedPassword,
            role: "ADMIN"
        };

        try {
            const response = await fetch('http://13.52.157.11:8080/quikhire-uat/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();
            if (result.SUCCESS) {
                if (result.token) {
                    // Store the token and navigate to the dashboard
                    sessionStorage.setItem('token', result.token);
                    navigate('/dashboard');
                } else {
                    alert('Login successful, but no token found.');
                }
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="bg-pattern">
            <div className="bg-overlay"></div>
            <div className="account-pages pt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-lg-6 col-md-8">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="">
                                        <div className="text-center">
                                            <a href="login" className="">
                                                <img src="assets/images/logo-dark.png" alt="" height="24" className="auth-logo logo-dark mx-auto" />
                                                <img src="assets/images/logo-light.png" alt="" height="24" className="auth-logo logo-light mx-auto" />
                                            </a>
                                        </div>
                                        <h4 className="font-size-18 text-muted mt-2 text-center">Welcome Back!</h4>
                                        <form className="form-horizontal" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="username">Username</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="username"
                                                            placeholder="Enter username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="userpassword">Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="userpassword"
                                                            placeholder="Enter password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="d-grid mt-4">
                                                        <button className="btn btn-primary waves-effect waves-light" type="submit">Log In</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <p className="text-white-50">© {new Date().getFullYear()} KEYBLOCKS. Crafted with <i className="mdi mdi-heart text-danger"></i> by QUIKHIRE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
