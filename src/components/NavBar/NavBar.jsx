import React from "react";

const NavBar = () => {
  return (
    <div className="templatemo-top-nav-container">
      <div className="row">
        <nav className="templatemo-top-nav col-lg-12 col-md-12">
          <ul className="text-uppercase">
            <li>
              <a href="" className="active">
                Admin panel
              </a>
            </li>
            <li>
              <a href="">Dashboard</a>
            </li>
            <li>
              <a href="">Overview</a>
            </li>
            <li>
              <a href="login.html">Sign in form</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
