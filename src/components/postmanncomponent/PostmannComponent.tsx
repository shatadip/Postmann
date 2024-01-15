// PostmannComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import './PostmannComponent.css'; // Import the stylesheet
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import the new theme

interface PostmannComponentProps {
    showLineNumbers: boolean;
}

const PostmannComponent: React.FC<PostmannComponentProps> = ({ showLineNumbers }) => {
    const [requestType, setRequestType] = useState<string>('GET');
    const [url, setUrl] = useState<string>(localStorage.getItem('postmannUrl') || ''); // Load from localStorage
    const [jsonBody, setJsonBody] = useState<string>(localStorage.getItem('postmannJsonBody') || ''); // Load from localStorage
    const [responseCode, setResponseCode] = useState<number | null>(null);
    const [response, setResponse] = useState<string>('');
    const [responseClass, setResponseClass] = useState<string>('');
    const [viewOption, setViewOption] = useState<'pretty' | 'raw'>('pretty');
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [syntaxHighlighterLanguage, setSyntaxHighlighterLanguage] = useState<string>('json');
    const [requestSent, setRequestSent] = useState<boolean>(false);
    // const [scrolling, setScrolling] = useState<boolean>(false);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const textareaPlaceholder = `//This is TOTALLY Optional
//You may send something like this:
    
{
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
}`;
    const urlPlaceholder='Enter API URL, e.g. https://reqres.in/api/login';

    useEffect(() => {
        // Save to localStorage whenever the URL or JSON body changes
        localStorage.setItem('postmannUrl', url);
        localStorage.setItem('postmannJsonBody', jsonBody);
    }, [url, jsonBody]);

    useEffect(() => {
        // Focus on the URL input when the component mounts
        if (urlInputRef.current) {
            urlInputRef.current.focus();
        }
    }, []);

    const sendRequest = async () => {
        setLoading(true); // Set loading to true when starting the request
        setRequestSent(true);
        const startTime: number = performance.now();
        const maxSize = 1024 * 1024; // 1 MB (adjust as needed)

        const intervalId = setInterval(() => {
            const elapsedTime = (performance.now() - startTime) / 1000;
            setResponseTime(elapsedTime);
        }, 100); // Update every 100 milliseconds

        try {
            const abortController = new AbortController();
            const { signal } = abortController;

            const requestOptions: RequestInit = {
                method: requestType,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                signal,
            };

            if (requestType !== 'GET') {
                requestOptions.body = jsonBody;
            }

            const timeoutId = setTimeout(() => abortController.abort(), 60000);

            const res = await fetch(url, requestOptions);
            // alert(res.text());
            clearTimeout(timeoutId);

            const responseCode = res.status;
            setResponseCode(responseCode);

            const contentLength = res.headers.get('content-length');

            if (contentLength && parseInt(contentLength, 100) > maxSize) {
                setResponse('Response is too large to display.');
            } else {
                const contentType = res.headers.get('content-type');

                if (contentType && contentType.includes('text/html')) {
                    const responseBody = await res.text();
                    setResponse(responseBody);
                    // Set language to "html" for HTML responses
                    setSyntaxHighlighterLanguage('html');
                } else {
                    const jsonResponse = responseCode === 204 ? null : await res.json();
                    setResponse(JSON.stringify(jsonResponse, null, 2));
                    // Set language to "json" for JSON responses
                    setSyntaxHighlighterLanguage('json');
                }

                const responseClass =
                    responseCode >= 200 && responseCode < 300
                        ? 'success'
                        : responseCode >= 400 && responseCode < 500
                            ? 'error'
                            : responseCode >= 500
                                ? 'server-error'
                                : '';

                setResponseClass(responseClass);
            }
        } catch (error: any) {
            // Handle errors and set the response code to indicate failure
            setResponseCode(null);
            setResponseClass('error'); // Red for errors
            setResponse(`Error: ${error.message}`);
        } finally {
            // Scroll down when the response is received
            // setScrolling(true);
            const scrollToBottom = () => {
                const currentPosition = window.scrollY;
                const targetPosition = document.body.scrollHeight;
                const distance = targetPosition - currentPosition;
                const duration = 1275; // Scroll duration in milliseconds
                const startTime = performance.now();

                const scrollStep = (timestamp: DOMHighResTimeStamp) => {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    window.scrollTo(0, currentPosition + distance * progress);

                    if (progress < 1) {
                        // Continue scrolling
                        window.requestAnimationFrame(scrollStep);
                    }
                    // } else {
                    //     // Scrolling completed
                    //     setScrolling(false);
                    // }
                };

                window.requestAnimationFrame(scrollStep);
            };

            // Wait for the DOM to update before scrolling
            setTimeout(scrollToBottom, 100);
            clearInterval(intervalId);
            setLoading(false); // Set loading to false when the request is complete
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
            setResponseTime(elapsedTime);
        }
    };


    return (
        <div className={`postmann-container`}>
            <div className="postmann-header">
            <img src="postmann-icon128.png" alt="Logo" className="postmann-logo" />
            <h2 className="postmann-title">Postmann</h2>
            </div>
            <div>
                <label>
                    Request Type:
                    <select
                        className={`postmann-select postmann-${requestType.toLowerCase()}`}
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                    >
                        <option className="postmann-get" value="GET">
                            GET
                        </option>
                        <option className="postmann-post" value="POST">
                            POST
                        </option>
                        <option className="postmann-put" value="PUT">
                            PUT
                        </option>
                        <option className="postmann-patch" value="PATCH">
                            PATCH
                        </option>
                        <option className="postmann-delete" value="DELETE">
                            DELETE
                        </option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    URL:
                    <input 
                    ref={urlInputRef}
                    className="postmann-input" 
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder={urlPlaceholder}
                    />
                </label>
            </div>
            <div>
                <label>
                    Body (Raw/JSON):
                    <textarea
                        className="postmann-textarea"
                        value={jsonBody}
                        onChange={(e) => setJsonBody(e.target.value)}
                        placeholder={textareaPlaceholder}
                    ></textarea>
                </label>
                <button className="postmann-button" onClick={sendRequest}>
                    Send Request
                </button>
            </div>
            <div>
                {requestSent && ( // Render the response section only if the request has been sent
                    <>
                        <p className={`postmann-response-title`}>
                            Response (<span className={responseClass}>{responseCode !== null ? responseCode : 'N/A'}</span>
                            <span>{' - Time: '}{responseTime !== null ? ` ${responseTime.toFixed(2)}s` : ' N/A'}</span>):
                        </p>

                        <div className="postmann-tabs">
                            <div
                                className={`postmann-tab ${viewOption === 'pretty' ? 'active' : ''}`}
                                onClick={() => setViewOption('pretty')}
                            >
                                Pretty
                            </div>
                            <div className={`postmann-tab ${viewOption === 'raw' ? 'active' : ''}`} onClick={() => setViewOption('raw')}>
                                Raw
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-indicator">
                                <div>Loading </div>
                                <div className="dot1"></div>
                                <div className="dot2"></div>
                                <div className="dot3"></div>
                            </div>
                        ) : (
                            <div>
                                {viewOption === 'pretty' ? (
                                    <SyntaxHighlighter language={syntaxHighlighterLanguage} style={ghcolors} showLineNumbers={showLineNumbers} className="syntax-hl-custom-styles">
                                        {response}
                                    </SyntaxHighlighter>
                                ) : (
                                    <div className={`postmann-raw-response`}>{response}</div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* {scrolling && (
                <div className="scroll-indicator">
                    Scrolling...
                </div>
            )} */}
            <div>
            </div>
        </div>
    );

};

export default PostmannComponent;
