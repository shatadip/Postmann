import { useState, useEffect } from 'react';
import { StarFill } from 'react-bootstrap-icons';
import './LinkAlternator.css';

const LinkAlternator = () => {
  const links = [
      { text: '@Shatadip', url: 'https://www.shatadip.com/' },
    {
      text: (
        <>
          <StarFill className='star-gold' />
          Rate Postmann
        </>
      ),
      url: 'https://chromewebstore.google.com/detail/postmann/okonkfbibmnmlpcookfdplminfemfhgf',
    }
  ];

  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentLinkIndex((prevIndex) => (prevIndex + 1) % links.length);
        setIsVisible(true);
      }, 1000);
    }, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <a
      href={links[currentLinkIndex].url}
      target="_blank"
      rel="noopener noreferrer"
      className={`postmann-links-alternator`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      {links[currentLinkIndex].text}
    </a>
  );
};

export default LinkAlternator;
