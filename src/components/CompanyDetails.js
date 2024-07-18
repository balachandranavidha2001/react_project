import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/bootstrap.css';
import '../assets/css/app.css';
import '../assets/css/icons.css';

const CompanyDetails = () => {
    const { companyUid } = useParams();
    const navigate = useNavigate();
    const [companyDetails, setCompanyDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalJobs: 0,
        viewed: 0,
        applied: 0,
        appliedRate: 0,
        jobsOlderThan30Days: 0,
        activeJobsOlderThan30Days: 0,
        jobsOlderThan15Days: 0,
        activeJobsOlderThan15Days: 0,
        jobsOlderThan7Days: 0,
        activeJobsOlderThan7Days: 0,
    });

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch(`http://13.52.157.11:8080/quikhire-uat/api/v1/company/${companyUid}/jobs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch company details');
                }

                const responseData = await response.json();
                setCompanyDetails(responseData.DATA);

                // Calculate statistics
                const totalJobs = responseData.DATA.length;
                const viewed = responseData.DATA.reduce((acc, job) => acc + (job.viewd || 0), 0);
                const applied = responseData.DATA.reduce((acc, job) => acc + (job.intrested || 0), 0);
                const appliedRate = totalJobs > 0 ? (applied / totalJobs) * 100 : 0;

                const now = new Date();
                
                // Calculate jobs older than 30 days
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const jobsOlderThan30Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < thirtyDaysAgo;
                }).length;
                const activeJobsOlderThan30Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < thirtyDaysAgo && job.active;
                }).length;

                // Calculate jobs older than 15 days
                const fifteenDaysAgo = new Date(now);
                fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

                const jobsOlderThan15Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < fifteenDaysAgo;
                }).length;
                const activeJobsOlderThan15Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < fifteenDaysAgo && job.active;
                }).length;

                // Calculate jobs older than 7 days
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const jobsOlderThan7Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < sevenDaysAgo;
                }).length;
                const activeJobsOlderThan7Days = responseData.DATA.filter(job => {
                    const jobDate = new Date(job.formattedActiveTillDate);
                    return jobDate < sevenDaysAgo && job.active;
                }).length;

                setStats({
                    totalJobs,
                    viewed: isNaN(viewed) ? 0 : viewed,
                    applied: isNaN(applied) ? 0 : applied,
                    appliedRate: isNaN(appliedRate) ? 0 : appliedRate,
                    jobsOlderThan30Days,
                    activeJobsOlderThan30Days,
                    jobsOlderThan15Days,
                    activeJobsOlderThan15Days,
                    jobsOlderThan7Days,
                    activeJobsOlderThan7Days,
                });
            } catch (error) {
                console.error('Error fetching company details:', error);
                setError(error.message);
                navigate('/login'); // Redirect to login if there's an error
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [companyUid, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
             <div className="py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-8">
                            <a href="" className="btn btn-primary">Reports - 1</a>
                            <a href="" className="btn btn-primary">Reports - 2</a>
                        </div>
                        <div className="col-md-4 text-right">
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title mb-2 mt-2">Reports</h4>
                                </div>
                                <div class="card-body">
                                    <form class="row gy-2 gx-3 align-items-center">
                                        <div class="col-auto">
                                        <img src="https://keyblocksstrategy.com/img/keyblocks.webp" width="200px" />  
                                        </div>
                                        <div class="col-md-5">
                                            <h3 class="text-center">Permanence Metric</h3>
                                        </div>
                                        <div class="col-auto">
                                            <select class="form-control">
                                                <option>Select Week</option>
                                                <option value="week-1">Week - 1 </option>
                                                <option value="week-2">Week - 2 </option>
                                                <option value="week-3">Week - 3 </option>
                                                <option value="week-4">Week - 4 </option>
                                            </select>
                                        </div>
                                        <div class="col-auto">
                                            <select class="form-control">
                                                <option>Select Fortnight</option>
                                                <option value="1st 15 Days">1st 15 Days</option>
                                                <option value="2nd 15 Days">2nd 15 Days </option>
                                            </select>
                                        </div>
                                        <div class="col-auto">
                                            <button type="submit" class="btn btn-primary">Monthly</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="progoc">
                                        <div className="row align-items-center mb-3">
                                            <div className="col-md-6">
                                                <h3><span>{stats.totalJobs}</span> Jobs Posted</h3>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="progress green">
                                                    <div className="progress-bar">
                                                        <div className="progress-value" style={{ width: `${stats.totalJobs > 0 ? 100 : 0}%` }}>
                                                            {stats.totalJobs > 0 ? '100%' : '0%'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-3">
                                            <div className="col-md-6">
                                                <h3><span>{stats.viewed}</span> Viewed</h3>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="progress green">
                                                    <div className="progress-bar">
                                                        <div className="progress-value" style={{ width: `${stats.totalJobs > 0 ? (stats.viewed / stats.totalJobs) * 100 : 0}%` }}>
                                                            {stats.totalJobs > 0 ? `${(stats.viewed / stats.totalJobs) * 100}%` : '0%'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-3">
                                            <div className="col-md-6">
                                                <h3><span>{stats.applied}</span> Applied</h3>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="progress green">
                                                    <div className="progress-bar">
                                                        <div className="progress-value" style={{ width: `${stats.totalJobs > 0 ? (stats.applied / stats.totalJobs) * 100 : 0}%` }}>
                                                            {stats.totalJobs > 0 ? `${(stats.applied / stats.totalJobs) * 100}%` : '0%'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-3">
                                            <div className="col-md-12">
                                                <div className="progress green">
                                                    <div className="progress-bar">
                                                        <div className="progress-value" style={{ width: `${stats.appliedRate}%` }}>
                                                            {stats.appliedRate}% Applied rate
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <div className="progoc">
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <h3>30 Days Older Jobs</h3>
                                </div>
                                <div className="col-md-6">
                                    <div className="progress green">
                                        <div className="progress-bar">
                                            <div className="progress-value" style={{ width: `${stats.jobsOlderThan30Days > 0 ? (stats.activeJobsOlderThan30Days / stats.jobsOlderThan30Days) * 100 : 0}%` }}>
                                                {stats.jobsOlderThan30Days > 0 ? `${stats.activeJobsOlderThan30Days} Active` : '0 Active'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <h3>15 Days Older Jobs</h3>
                                </div>
                                <div className="col-md-6">
                                    <div className="progress green">
                                        <div className="progress-bar">
                                            <div className="progress-value" style={{ width: `${stats.jobsOlderThan15Days > 0 ? (stats.activeJobsOlderThan15Days / stats.jobsOlderThan15Days) * 100 : 0}%` }}>
                                                {stats.jobsOlderThan15Days > 0 ? `${stats.activeJobsOlderThan15Days} Active` : '0 Active'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <h3>07 Days Older Jobs</h3>
                                </div>
                                <div className="col-md-6">
                                    <div className="progress green">
                                        <div className="progress-bar">
                                            <div className="progress-value" style={{ width: `${stats.jobsOlderThan7Days > 0 ? (stats.activeJobsOlderThan7Days / stats.jobsOlderThan7Days) * 100 : 0}%` }}>
                                                {stats.jobsOlderThan7Days > 0 ? `${stats.activeJobsOlderThan7Days} Active` : '0 Active'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-md-12">
                                    <div className="progress green">
                                        <div className="progress-bar">
                                            <div className="progress-value" style={{ width: `${stats.totalJobs > 0 ? (stats.totalJobs / 100) * 60 : 0}%` }}>
                                                {stats.totalJobs > 0 ? `${stats.totalJobs} Posted Jobs` : '0 Posted Jobs'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div> 

                    </div>


                    
                </div>
             </div>
            <h2>Company Details</h2>
            {companyDetails.length === 0 ? (
                <p>No jobs found for this company.</p>
            ) : (
                <ul>
                    {companyDetails.map(job => (
                        <li key={job.jobId}>
                            <h3>{job.jobTitle}</h3>
                            <p>{job.formattedActiveTillDate}</p>
                            {/* Render other job details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompanyDetails;
