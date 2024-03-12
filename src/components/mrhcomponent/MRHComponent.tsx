//MRHComponent.tsx

import { useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage'; // Adjust the import path as necessary
import './MRHComponent.css';

const MRHComponent = () => {
    const [modifiedHeaders, _setModifiedHeaders] = useLocalStorage('postmannHeaders', {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

//     const _mrhTAPH = `Write your headers in JSON here, like this:

// {
//     'Content-Type': 'application/json',
//     'Cache-Control': 'no-cache',
//     'Accept': '*/*',
//     'Accept-Encoding': 'gzip, deflate, br',
//     'Connection': 'keep-alive',
// }
//     `;

    return (
        <>
        {JSON.parse(modifiedHeaders)}
            {/* <div className='mrh-label'>Modify headers according to your requirements, these are auto-saved.</div>
            <div className="mrh-container">
                <textarea
                    ref={textareaRef}
                    name="mrhTA"
                    id="mrhTA"
                    className='mrhTA'
                    placeholder={mrhTAPH}
                    value={JSON.stringify(modifiedHeaders, null, 4)}
                    onChange={(e) => {
                        
                            const newHeaders = JSON.parse(e.target.value);
                            setModifiedHeaders(newHeaders);
                        
                    }}
                ></textarea>
            </div> */}
        </>
    );
}

export default MRHComponent;