import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Navbar = () => {
  // const [loading, setLoading] = useState(true); // State to manage loading
  const [user, setUser] = useState(null); // State to store user data
  const location = useLocation(); // Hook to get current route
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Check for user data in localStorage after the component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('auth'));
    if (storedUser) {
      setUser(storedUser); // Set user if data is found
    }
    // setLoading(false); // Set loading to false after checking
  }, user); // Empty dependency array means this effect runs once after the component mounts

  const handleLogout = () => {
    // Remove the 'auth' item from localStorage and redirect to login page
    localStorage.removeItem('auth');

    // toast.success( "Logout successful!", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });

    alert("You have been logged out");
    setUser(null); // Reset user state
    
    navigate('/login'); // Redirect to login page
  };



  return (
    <div className="mb-4">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><span style={{ fontSize: '20px' }}>{"</"}MediCrypt.</span><span >ai{">"}</span></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">About</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Services
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/service2">Text to prescription</Link></li>
                  <li><Link className="dropdown-item" to="/home">Prescription on email</Link></li>
                  <li><Link className="dropdown-item" to="/home">Audio to prescription</Link></li>
                </ul>
              </li>
            </ul>
            <form className="d-flex" role="search">
              {/* If the user is on the '/' path */}
              {location.pathname === "/" && !user && (
                <>
                  {/* Show Login and Signup buttons if user is not logged in */}
                  <button className="btn btn-outline-success mx-1" type="button">
                    <Link to="/login" className="text-decoration-none text-dark">Login</Link>
                  </button>
                  <button className="btn btn-outline-success mx-1" type="button">
                    <Link to="/register" className="text-decoration-none text-dark">Signup</Link>
                  </button>
                </>
              )}

              {/* Conditionally render Signup or Login button only if no user data in localStorage */}
              {location.pathname === "/login" && (
                <button className="btn btn-outline-success mx-1" type="button">
                  <Link to="/register" className="text-decoration-none text-dark">Signup</Link>
                </button>
              )}
              {location.pathname === "/register" && (
                <button className="btn btn-outline-success mx-1" type="button">
                  <Link to="/login" className="text-decoration-none text-dark">Login</Link>
                </button>
              )}

              {/* If user is logged in, show profile and logout */}
              {location.pathname !== "/login" && location.pathname !== "/register" && user && (
                <>
                  <div className="btn-group mx-1">
                    <button className="btn btn-outline-success" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Profile
                    </button>
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <strong>Name:{user.name}</strong>
                      </li>
                      <li className="dropdown-item">
                        {user.email}
                      </li>
                    </ul>
                  </div>
                  <button className="btn btn-outline-success mx-1" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
