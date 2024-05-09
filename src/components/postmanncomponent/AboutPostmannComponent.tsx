import './AboutPostmannComponent.css';

const AboutPostmannComponent = () => {
  return (
    <>
    <div className='apc-label'>AboutPostmannComponent</div>
    <p className='apc-disclaimer'>Disclaimer</p>
    <ul className='apc-ul'>
      <li>Postmann is an open-source REST Client under MIT License</li>
      <li>Postmann is not an official Chrome Extension of Postman</li>
      <li>Postmann is not affiliated with Postman in any way</li>
      <li>None of your requests are monitored or tracked</li>
      <li>This Chrome Extension does not come with any guarantee of any sort</li>
    </ul>
    </>
  )
}

export default AboutPostmannComponent