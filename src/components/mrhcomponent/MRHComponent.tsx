import './MRHComponent.css'

const MRHComponent = () => {
    const mrhTAPH=`Write your headers in JSON here, like this:

{
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
}
    `;
    return (
        <>
            <div className='mrh-label'>Modify headers according to your requirements, these are auto-saved.</div>
            <div className="mrh-container">
                <textarea name="mrhTA" id="mrhTA" className='mrhTA' placeholder={mrhTAPH}>

                </textarea>
            </div>
        </>
    )
}

export default MRHComponent