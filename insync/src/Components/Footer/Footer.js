import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
        <h3 className="footer__heading">Powered by, <span className="footer__spotify footer__spacings">SpotifyAPI</span> and <span className="footer__ticketmaster footer__spacings">TicketmasterAPI</span> </h3>
    </footer>
  );
};

export default Footer;