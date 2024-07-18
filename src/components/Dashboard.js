import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [companyData, setCompanyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchCompanyDetails(token);
        }
    }, [navigate]);

    const fetchCompanyDetails = async (token) => {
        try {
            const response = await fetch('http://13.52.157.11:8080/quikhire-uat/api/v1/company/counts', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch company details');
            }

            const responseData = await response.json();
            setCompanyData(responseData.DATA);
        } catch (error) {
            console.error('Error fetching company details:', error);
            navigate('/login'); // Redirect to login if there's an error or token is invalid
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const handleCompanyClick = (companyUid) => {
        navigate(`/components/companydetails/${companyUid}`);
    };

    if (loading) {
        return <p>Loading...</p>;
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

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-2 mt-2">Reports</h4>
                                </div>
                                <div className="card-body">
                                    <form className="row gy-2 gx-3 align-items-center">
                                        <div className="col-auto">
                                            <label htmlFor="showSelect">Show</label>
                                            <select className="form-control" id="showSelect">
                                                <option>select</option>
                                                <option value="Show 1-50">Show 1-50</option>
                                                <option value="51-100">51-100</option>
                                                <option value="101-150">101-150</option>
                                            </select>
                                        </div>
                                        <div className="col-auto">
                                            <label htmlFor="fromDateInput">From Date</label>
                                            <input type="date" className="form-control" id="fromDateInput" />
                                        </div>
                                        <div className="col-auto">
                                            <label htmlFor="toDateInput">To Date</label>
                                            <input type="date" className="form-control" id="toDateInput" />
                                        </div>
                                        <div className="col-auto">
                                            <button type="submit" className="btn btn-primary mt-4"><i className="fa fa-search"></i> Submit</button>
                                        </div>
                                        <div className="col-auto">
                                            <label htmlFor="searchInput">Search</label>
                                            <input type="text" className="form-control" id="searchInput" placeholder="Search" />
                                        </div>
                                        <div className="col-auto">
                                            <button type="submit" className="btn btn-primary mt-4">Download</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered">
                                            <thead className="bg-success">
                                                <tr>
                                                    <th>Sr.no</th>
                                                    <th>Company</th>
                                                    <th>Job Posted</th>
                                                    <th>Active Jobs</th>
                                                    <th>Viewed</th>
                                                    <th>Applied</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {companyData.map((item, index) => (
                                                    <tr key={item.company.companyUid}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-link"
                                                                onClick={() => handleCompanyClick(item.company.companyUid)}
                                                            >
                                                                {item.company.companyName}
                                                            </button>
                                                        </td>
                                                        <td>{item.countsMap.totalJobs}</td>
                                                        <td>{item.countsMap.activeJobs}</td>
                                                        <td>{item.countsMap.viewd}</td>
                                                        <td>{item.countsMap.intrested}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
