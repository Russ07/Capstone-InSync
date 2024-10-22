import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <nav className="header-nav"> 
       <Link to='/'> <h2 className="header-nav__heading">inSync</h2></Link> 
        <div className="header-side-nav">
          <button className="header-side-nav__btn header-side-nav__btn-concerts" onClick={() => navigate('/concerts')}>
            Concerts
          </button>
          <button className="header-side-nav__btn" onClick={() => navigate('/recommended-playlists')}>
            Explore room
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
