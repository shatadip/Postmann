//MRHComponent.tsx

import { useState, useRef, useEffect } from 'react';
import './MRHComponent.css'

const MRHComponent = () => {
    const [modifiedHeaders, setModifiedHeaders] = useState(() => {
        const savedHeaders = localStorage.getItem('postmannHeaders');
        
        return savedHeaders ? JSON.parse(savedHeaders) : {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        };
    });

    // Create a reference to the textarea with explicit typing
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update localStorage whenever headers change
    useEffect(() => {
        localStorage.setItem('postmannHeaders', JSON.stringify(modifiedHeaders));
    }, [modifiedHeaders]);

    // Fetch and display the saved headers from localStorage when the component mounts
    useEffect(() => {
        const savedHeaders = localStorage.getItem('postmannHeaders');
        if (savedHeaders) {
            setModifiedHeaders(JSON.parse(savedHeaders));
        }
    }, []);

    // Set focus on the textarea when the component mounts
    useEffect(() => {
        // Check if the ref is currently pointing to a DOM element
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const mrhTAPH = `Write your headers in JSON here, like this:

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
                <textarea
                    ref={textareaRef} // Attach the ref to the textarea
                    name="mrhTA"
                    id="mrhTA"
                    className='mrhTA'
                    placeholder={mrhTAPH}
                    value={JSON.stringify(modifiedHeaders, null, 4)} // stringify the object
                    onChange={(e) => {
                        try {
                            const newHeaders = JSON.parse(e.target.value);
                            setModifiedHeaders(newHeaders);
                        } catch (error) {
                            console.error("Invalid JSON format", error);
                            // Optionally, show an error message to the user
                        }
                    }}
                    
                    
                ></textarea>
            </div>
        </>
    );
}

export default MRHComponent;
