import React from 'react';
import './Home.css';
import Hero from './../../static/imgs/hero-img.png';
function Home() {
  return (
    <>
      <div className="home-container">
        <div className="slogan">
          <h1>“The Magic of Books: Unleash Your Imagination.”</h1>
        </div>
        <div className="hero">
          <img src={Hero} alt="Hero Image" />
        </div>
      </div>
      <div className="categories">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}

export default Home;
