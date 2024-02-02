// PostmannComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import './PostmannComponent.css'; // Import the stylesheet
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import the new theme
import { Github, Heart, TextWrap, Clipboard, BrightnessHighFill, Download, MoonFill, ListOl } from 'react-bootstrap-icons';

import Modal from 'react-modal'; // Import the modal library
Modal.setAppElement('#root'); // This line is important for accessibility reasons.

// const themeForSHL = atomDark; //ghcolors;

interface PostmannComponentProps {
    showLineNumbers: boolean;
}

const PostmannComponent: React.FC<PostmannComponentProps> = () => {
    const [requestType, setRequestType] = useState<string>('GET');
    const [url, setUrl] = useState<string>(localStorage.getItem('postmannUrl') || ''); // Load from localStorage
    const [jsonBody, setJsonBody] = useState<string>(localStorage.getItem('postmannJsonBody') || ''); // Load from localStorage
    const [responseCode, setResponseCode] = useState<number | null>(null);
    const [response, setResponse] = useState<any>('');
    const [responseHeaders, setResponseHeaders] = useState<Headers | null>(null);
    const [responseClass, setResponseClass] = useState<string>('');
    const [viewOption, setViewOption] = useState<'pretty' | 'raw' | 'image' | 'binary' | 'pdf' | 'headers'>('pretty');
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [syntaxHighlighterLanguage, setSyntaxHighlighterLanguage] = useState<string>('json');
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [responseType, setResponseType] = useState<any>('');
    const [binaryFileContents, setBinaryFileContents] = useState<string>('');
    const [imageResolution, setImageResolution] = React.useState<any>('');
    const [isInvalidJSON, setIsInvalidJSON] = useState<boolean>(false);
    const [wrapState, setWrapState] = useState<boolean>(false);
    const [themeForSHL, setThemeForSHL] = useState<any>(atomDark); //ghcolors;
    const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
    // const [scrolling, setScrolling] = useState<boolean>(false);
    const urlInputRef = useRef<HTMLInputElement>(null);
    interface CopyButtonProps {
        contentToCopy: string;
    }

    const CopyButton: React.FC<CopyButtonProps> = ({ contentToCopy }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(contentToCopy);
            setCopied(true);

            // Reset "Copied" message after a short delay
            setTimeout(() => setCopied(false), 400);
        };

        return (
            <button onClick={handleCopy} className={`copy-button ${copied ? 'flash' : ''}`}>
                <Clipboard className='rbi-button-icon' />{copied ? 'Copied' : 'Copy'}
            </button>
        );
    };
    const toggleLineNumbers = () => {
        setShowLineNumbers(!showLineNumbers);
      };
    const downloadResponse = () => {
        const blob = new Blob([response], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'response.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const textareaPlaceholder = `//This is TOTALLY Optional
//You may send something like this:
    
{
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
}`;
    const urlPlaceholder = 'Enter API URL, e.g. https://reqres.in/api/login';

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

    useEffect(() => {
        // Load the previously selected request type from localStorage
        const savedRequestType = localStorage.getItem('postmannRequestType');
        if (savedRequestType) {
            setRequestType(savedRequestType);
        }
    }, []);

    //Get Country for Donation purpose
    const [country, setCountry] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.country.is', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const countryName = data.country;
                setCountry(countryName);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    // Function to format HTML for better readability
    const formatHtml = (html: string) => {

        return html;
    };
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
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
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

            // Capture the response headers
            const resHeaders = res.headers;
            setResponseHeaders(resHeaders);

            //Capoture the response code (200, 201, 404 etc.)
            const responseCode = res.status;
            setResponseCode(responseCode);

            const contentLength = res.headers.get('content-length');

            if (contentLength && parseInt(contentLength, 100) > maxSize) {
                setResponse('Response is too large to display.');
            } else {
                const contentType = res.headers.get('content-type') || '';

                let rawResponse2: any;
                switch (true) {
                    case contentType.includes('text/html'):
                    case contentType.includes('text/plain'):
                    case contentType.includes('application/xml'):
                        const responseBody = await res.text();
                        const formattedHtml = formatHtml(responseBody);
                        setResponse(formattedHtml);
                        setViewOption('pretty');
                        setIsInvalidJSON(false);
                        break;

                    case contentType.includes('image/jpeg'):
                    case contentType.includes('image/png'):
                    case contentType.includes('image/svg'):
                    case contentType.includes('image/webp'):
                    case contentType.includes('image/gif'):
                        const blobImage = await res.blob();
                        const urlImage = URL.createObjectURL(blobImage);
                        setResponse(urlImage);
                        setViewOption('image');
                        break;

                    case contentType.includes('application/octet-stream'):
                        const blobBinary = await res.blob();
                        const urlBinary = URL.createObjectURL(blobBinary);
                        const arrayBuffer = await blobBinary.arrayBuffer();
                        const decoder = new TextDecoder('utf-8');
                        const text = decoder.decode(arrayBuffer);
                        setBinaryFileContents(text);
                        setResponse(urlBinary);
                        setViewOption('binary');
                        break;

                    case contentType.includes('application/pdf'):
                        // const blobPdf = await res.blob();
                        // const urlPdf = URL.createObjectURL(blobPdf);
                        const pdfData = await res.arrayBuffer();
                        const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
                        setResponse(pdfUrl);
                        // setResponse(blobPdf);
                        setViewOption('pdf');
                        break;

                    default:
                        //[[v1.0.2]] I was using res.json but it had issues pursuing invalid JSON responses    
                        // const jsonResponse = responseCode === 204 ? null : await res.json();
                        // setResponse(JSON.stringify(jsonResponse, null, 2));
                        // setViewOption('pretty');
                        // break;

                        //[[v1.0.3]] I am using res.text, and then parsing it to JSON, so that I can handle invalid JSON responses e.g. https://httpbin.org/stream/2
                        // try is used to handle valid JSON responses and catch is used to handle invalid JSON responses

                        try {
                            rawResponse2 = responseCode === 204 ? null : await res.text();
                            //rawResponse2 = await res.text(); //usually a null body if responseCode is 204 but some people might send a body with 204. So...
                            const jsonResponse = JSON.parse(rawResponse2);
                            setResponse(JSON.stringify(jsonResponse, null, 2));
                            setViewOption('pretty');
                            setIsInvalidJSON(false);
                        } catch (error) {
                            setResponse(rawResponse2);  // Use the stored raw response
                            setViewOption('pretty');
                            setIsInvalidJSON(true);
                        }
                        break;
                }

                switch (true) {
                    case contentType.includes('text/html'):
                        setResponseType('html');
                        setSyntaxHighlighterLanguage('html');
                        break;

                    case contentType.includes('text/plain'):
                        setResponseType('text');
                        setSyntaxHighlighterLanguage('text');
                        break;

                    case contentType.includes('image'):
                        setResponseType('image');
                        break;

                    case contentType.includes('application/octet-stream'):
                        setResponseType('binary');
                        break;

                    case contentType.includes('application/xml'):
                        setResponseType('xml');
                        setSyntaxHighlighterLanguage('xml');
                        break;

                    case contentType.includes('application/pdf'):
                        setResponseType('pdf');
                        break;

                    default:
                        setResponseType('json');
                        setSyntaxHighlighterLanguage('json');
                        break;
                }
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
    const formatHeaders = (headers: Headers | null) => {
        const formattedHeaders: Record<string, string> = {};

        if (headers) {
            headers.forEach((value, key) => {
                formattedHeaders[key] = value;
            });
        }

        return JSON.stringify(formattedHeaders, null, 2);
    };

    const renderDonationLink = () => {
        if (country === 'IN') {
            // Display image in modal window for India
            return (
                <a href="#" onClick={() => showModal()}>
                    <Heart className='donateHeart' />
                    Donate
                </a>
            );
        } else {
            // Display regular PayPal link for other countries
            return (
                <a href="https://www.paypal.com/paypalme/shatadip2020" target="_blank" rel="noopener noreferrer">
                    <Heart className='donateHeart' />
                    Donate
                </a>
            );
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 150);
    };

    const handleRequestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRequestType = e.target.value;
        setRequestType(selectedRequestType);

        // Save the selected request type to localStorage
        localStorage.setItem('postmannRequestType', selectedRequestType);
    };

    return (
        <div className={`postmann-container`}>
            <div className="postmann-header">
                <img src="postmann-icon128.png" alt="Postmann Logo" className="postmann-logo rotating" />
                <div className="postmann-title-container">
                    <h2 className="postmann-title">Postmann</h2>
                    <p className="postmann-version">v 1.0.4*</p>
                </div>
                <div className="postmann-links">
                    {renderDonationLink()}
                    <a href="https://github.com/shatadip/Postmann" target="_blank" rel="noopener noreferrer"><Github className='githubLink' />GitHub</a>
                    <a href="https://www.shatadip.com/" target="_blank" rel="noopener noreferrer">@Shatadip</a>
                </div>
            </div>
            <div>
                <label>
                    HTTP Request Type:
                    <select
                        className={`postmann-select postmann-${requestType.toLowerCase()}`}
                        value={requestType}
                        onChange={handleRequestTypeChange}
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
                            {(responseType === 'image') ? (
                                <div
                                    className={`postmann-tab ${viewOption === 'image' ? 'active' : ''}`}
                                    onClick={() => setViewOption('image')}
                                >
                                    Image
                                </div>
                            ) : (responseType === 'binary') ? (
                                <div
                                    className={`postmann-tab ${viewOption === 'binary' ? 'active' : ''}`}
                                    onClick={() => setViewOption('binary')}
                                >
                                    Binary
                                </div>
                            ) : (responseType === 'pdf') ? (
                                <div
                                    className={`postmann-tab ${viewOption === 'pdf' ? 'active' : ''}`}
                                    onClick={() => setViewOption('pdf')}
                                >
                                    PDF
                                </div>

                            ) : (
                                <>
                                    <div
                                        className={`postmann-tab ${viewOption === 'pretty' ? 'active' : ''}`}
                                        onClick={() => setViewOption('pretty')}
                                    >
                                        Pretty
                                        {isInvalidJSON && <sup className='invalidJSON-sup'>Invalid JSON</sup>}
                                    </div>
                                    <div className={`postmann-tab ${viewOption === 'raw' ? 'active' : ''}`} onClick={() => setViewOption('raw')}>
                                        Raw
                                    </div>
                                </>
                            )}
                            <div className={`postmann-tab ${viewOption === 'headers' ? 'active' : ''}`} onClick={() => setViewOption('headers')}>
                                Headers
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
                                    <>
                                        <div className='optionsDiv'>
                                        <button onClick={toggleLineNumbers} className='toggle-lnum-button'>
                                            <ListOl className='rbi-button-icon' />
                                            {showLineNumbers ? '!!Lines' : 'Lines'}
                                        </button>
                                            <button onClick={() => setWrapState(!wrapState)} className='wrap-button'>
                                                <TextWrap className='rbi-button-icon' /> {wrapState ? '!!Wrap' : 'Wrap'}
                                            </button>
                                            <CopyButton contentToCopy={response} />
                                            <button onClick={downloadResponse} className='download-button'>
                                                <Download className='rbi-button-icon' />Download
                                            </button>
                                            <button
                                                onClick={() => setThemeForSHL(themeForSHL == atomDark ? ghcolors : atomDark)}
                                                className='theme-button'
                                            >
                                                {themeForSHL == atomDark ? <BrightnessHighFill className='rbi-button-icon' /> : <MoonFill className='rbi-button-icon' />}
                                                {themeForSHL == atomDark ? 'Light' : 'Dark'}
                                            </button>
                                        </div>
                                        <SyntaxHighlighter
                                            language={syntaxHighlighterLanguage}
                                            style={themeForSHL}
                                            showLineNumbers={showLineNumbers}
                                            className="syntax-hl-custom-styles"
                                            wrapLongLines={wrapState}
                                        >
                                            {response}
                                        </SyntaxHighlighter>


                                    </>
                                ) : viewOption === 'image' ? (
                                    <div className={`postmann-raw-response`}>
                                        <div style={{ position: 'relative' }}>
                                            <kbd className='binaryFC-length-kbd' style={{ position: 'absolute', bottom: 0, right: 0 }}>
                                                {'{'}Res: {imageResolution}{'}'}
                                            </kbd>
                                            <img className='imageResponse-img'
                                                src={response}
                                                alt="Image response"
                                                onLoad={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    setImageResolution(`${target.naturalWidth} x ${target.naturalHeight}`);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : viewOption === 'binary' ? (
                                    <div className={`postmann-raw-response`}>
                                        <a href={response} download>Download file</a>
                                        {/* show what the download file link will trigger */}
                                        <pre>{response}</pre>
                                        {/* show binary file contents */}
                                        <p className='binaryFC-title-p'>
                                            Binary/Octet-Stream File Contents (Response Data)
                                        </p>

                                        {responseType === 'binary' &&
                                            <div style={{ position: 'relative' }}>
                                                <kbd className='binaryFC-length-kbd' style={{ position: 'absolute', bottom: 0, right: 0 }}>
                                                    {'{'}Len: {binaryFileContents.length}{'}'}
                                                </kbd>
                                                <pre className='binaryPRE'>{binaryFileContents}</pre>
                                            </div>
                                        }
                                    </div>
                                ) : viewOption === 'pdf' ? (
                                    <div className={`postmann-raw-response`}>
                                        <iframe src={response} title="PDF Response" className='pdf-iframe' />
                                    </div>
                                ) : viewOption === 'raw' ? (
                                    <div className={`postmann-raw-response`}><pre>{response}</pre></div>
                                ) : (
                                    <div className={`postmann-headers`}>
                                        {/* Render headers here */}
                                        {responseHeaders && (
                                            <SyntaxHighlighter language="json" style={themeForSHL} showLineNumbers={showLineNumbers} className="syntax-hl-custom-styles">
                                                {formatHeaders(responseHeaders)}
                                            </SyntaxHighlighter>
                                        )}
                                    </div>
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
            {/* Modal for India */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Donation Modal"
                className={`donation-modal ${isClosing ? 'ReactModal__Content--before-close' : ''}`}
                overlayClassName="donation-modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <div className="modal-content">
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                    <img src="india-qr.png" className='donation-india-qr' alt="Donation Image" />
                </div>
            </Modal>
        </div>
    );

};

export default PostmannComponent;
