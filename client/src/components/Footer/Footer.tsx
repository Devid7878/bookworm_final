import React from 'react';
import './dist/Footer.css';
import { Email, EmailRounded, Phone, PhoneRounded } from '@mui/icons-material';
import Logo from '../Logo/Logo';
import Swal from 'sweetalert2';
function Footer() {
  return (
    <div className="footer">
      <div className="footer-part-1">
        <div className="logo">
          <Logo />
        </div>
        <div className="about-us">
          <h3>About us</h3>
          <p>Want people to learn new things by reading our book.</p>
        </div>
        <div className="contact-us">
          <div className="phone">
            <PhoneRounded sx={{ fontSize: '25px' }} />{' '}
            <span>+91 4214521212</span>
          </div>
          <div className="email">
            <EmailRounded sx={{ fontSize: '25px' }} />{' '}
            <span>bookworm@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="footer-part-2">
        <h3>Information</h3>
        <span>More Search</span>
        <span>Blog</span>
        <span>Testimonials</span>
        <span>Events</span>
      </div>
      <div className="footer-part-3">
        <h3>Helpful Links</h3>
        <span>Services</span>
        <span>Supoort</span>
        <span>Terms & Conditions</span>
        <span>Privacy Policy</span>
      </div>
      <div className="footer-part-4">
        <span>Subscribe for more info</span>
        <div className="email">
          <EmailRounded />
          <input type="email" placeholder="Enter your Email" />
        </div>
        <button
          onClick={() => {
            Swal.fire('Thanks for Subscribing Bookworm!');
          }}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}

export default Footer;
