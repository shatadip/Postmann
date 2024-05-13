import './AboutPostmannComponent.css';

const AboutPostmannComponent = () => {
  return (
    <>
    <div className='apc-label'>Let's talk about it...</div>
    <p className='apc-title'>Disclaimer</p>
    <ul className='apc-ul'>
      <li>Postmann is an open-source REST Client under MIT License</li>
      <li>Postmann is not an official Chrome Extension of Postman</li>
      <li>Postmann is not affiliated with Postman in any way</li>
      <li>None of your requests are monitored or tracked</li>
      <li>This Chrome Extension does not come with any guarantee of any sort</li>
    </ul>
    <p className='apc-title'>About</p>
    <ul className='apc-ul'>
      <li>First release was in January 2024, latest in May 2024 (v 1.1.1)</li>
      <li>Supports JSON, XML, HTML, Image, PDF, Octet Stream responses</li>
      <li>Work with variables, history, notes, request headers (e.g. add bearer tokens for authentication)</li>
      <li>Everything is auto-saved locally (using local storage) in your computer</li>
      <li>There's no 'Collections' as of now for bulk operations</li>
      <li>Postmann is a REST Client, so there's no support for GraphQL, WebSocket, Socket.io, gRPC, or MQTT yet</li>
      <li>It's an open-source project, so, feel free to contribute</li>
      <li>Donating to Postmann will give you 7 years of good luck, trust me!</li>
      <li>For more info and changelog:</li>
      <li>Check out Postmann's GitHub repository
        <ul>
        <li>Check out <a href='https://chromewebstore.google.com/detail/postmann/okonkfbibmnmlpcookfdplminfemfhgf' target='_blank' className='apc-link apc-li-link'>Chrome landing page</a></li>
        <li>Check out <a href='https://github.com/shatadip/Postmann' target='_blank' className='apc-link apc-li-link'>Postmann's GitHub page</a></li>
        </ul>
      </li>
    </ul>
    <p className='apc-title'>Author</p>
      <div className="img-wrapper">
        <img src="shatadip.jpg" alt="Shatadip Majumder" className="author-shatadip-img" />
      </div>
        <p className="text-align-center">Shatadip Majumder (Developer)</p>
        <p className="text-align-center author-links"><a className='apc-link' href="https://www.shatadip.com" target="_blank">Website</a> | <a className='apc-link' href="https://github.com/shatadip" target="_blank">GitHub</a> | <a className='apc-link' href="https://chromewebstore.google.com/search/shatadip" target="_blank">Other Chrome Extensions</a></p>
    </>
  )
}

export default AboutPostmannComponent