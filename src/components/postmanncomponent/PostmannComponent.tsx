// PostmannComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import './PostmannComponent.css'; // Import the stylesheet
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import the new theme
import { Github, HeartFill, TextWrap, Clipboard, BrightnessHighFill, Download, MoonFill, ListOl } from 'react-bootstrap-icons';
import LinkAlternator from '../LinkAlternator'; //Show <> @Shatadip <> Rate Postmann <> alternately
import Modal from 'react-modal'; // Import the modal library

//options components
import VariablesComponent from '../variablescomponent/VariablesComponent';
import NotesComponent from '../notescomponent/NotesComponent';
import MRHComponent from '../mrhcomponent/HeadersMRHComponent';
import HistoryComponent from '../historycomponent/HistoryComponent';

Modal.setAppElement('#root'); // This line is important for accessibility reasons.

interface PostmannComponentProps {
    showLineNumbers: boolean;
}

const PostmannComponent: React.FC<PostmannComponentProps> = () => {
    //STATES
    const [requestType, setRequestType] = useState<string>('GET');
    const [url, setUrl] = useState<string>(localStorage.getItem('postmannUrl') || ''); // Load from localStorage
    const [jsonBody, setJsonBody] = useState<string>(localStorage.getItem('postmannJsonBody') || ''); // Load from localStorage
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [responseCode, setResponseCode] = useState<any | null>(null);
    const [absoluteRawResponse, setAbsoluteRawResponse] = useState<string>(''); //[[v1.0.4]]
    const [response, setResponse] = useState<any>('');
    const [responseHeaders, setResponseHeaders] = useState<Headers | null>(null);
    const [responseClass, setResponseClass] = useState<string>('');
    const [viewOption, setViewOption] = useState<'pretty' | 'raw' | 'image' | 'binary' | 'pdf' | 'headers'>('pretty');
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [syntaxHighlighterLanguage, setSyntaxHighlighterLanguage] = useState<string>('json');
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isVarModalOpen, setIsVarModalOpen] = useState<boolean>(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
    const [isModifyRequestHeadersModalOpen, setIsModifyRequestHeadersModalOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [responseType, setResponseType] = useState<any>('');
    const [binaryFileContents, setBinaryFileContents] = useState<string>('');
    const [imageResolution, setImageResolution] = React.useState<any>('');
    const [isInvalidJSON, setIsInvalidJSON] = useState<boolean>(false);
    const [wrapState, setWrapState] = useState<boolean>(false);
    const [themeForSHL, setThemeForSHL] = useState<any>(atomDark); //ghcolors;
    const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
    const [processedURLView, setProcessedURLView] = useState<any>('');
    const [processedBodyView, setProcessedBodyView] = useState<any>('');

    // REFS
    const urlInputRef = useRef<HTMLInputElement>(null);
    const wrapButtonRef = useRef<HTMLButtonElement>(null);
    const themeButtonRef = useRef<HTMLButtonElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);
    const downloadButtonRef = useRef<HTMLButtonElement>(null);
    const toggleLnumButtonRef = useRef<HTMLButtonElement>(null);


    // Function to handle button click
    const handleButtonClick = (ref: React.RefObject<HTMLButtonElement>) => {
        // Remove focus from the clicked button
        // timeout
        setTimeout(() => {
            ref.current?.blur();
        }, 175);
    };


    const calculateSizeInBytes = (str: any) => {
        // const encoder = new TextEncoder();
        // const encodedData = encoder.encode(str);
        // return encodedData.length;
        const sizeInBytes = new Blob([str]).size;

        if (sizeInBytes > 1024) {
            const sizeInKB = (sizeInBytes / 1024).toFixed(2); // Rounds to 2 decimal places
            return `${sizeInKB} KB`;
        } else {
            return `${sizeInBytes} B`;
        }

    };

    const calculateSizeInBytes2 = (resBod: any, resHead: any) => {
        const sizeInBytes = new Blob([resBod]).size + new Blob([resHead]).size;

        if (sizeInBytes > 1024) {
            const sizeInKB = (sizeInBytes / 1024).toFixed(2); // Rounds to 2 decimal places
            return `${sizeInKB} KB`;
        } else {
            return `${sizeInBytes} B`;
        }
    };

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
            <button
                onClick={() => { handleCopy(); handleButtonClick(copyButtonRef) }}
                className={`copy-button ${copied ? 'flash' : ''}`}
                ref={copyButtonRef}
            >
                <Clipboard className='rbi-button-icon' />{copied ? 'Copied' : 'Copy'}
            </button>

        );
    };
    const toggleLineNumbers = () => {
        setShowLineNumbers(!showLineNumbers);
    };
    const downloadResponse = (downloadFileName: any, downloadBlob: any) => {
        const blob = new Blob([downloadBlob], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const optionsDiv = (type: string, resp: any) => {
        let fileName = type === 'pretty' ? 'response-body.txt' : 'response-headers.txt';

        let handleDownload = () => {
            downloadResponse(fileName, resp);
        };

        return (

            <div className='optionsDiv'>
                {/* Toggle Line Num Button */}

                <button
                    onClick={() => { toggleLineNumbers(); handleButtonClick(toggleLnumButtonRef); }}
                    className='toggle-lnum-button'
                    ref={toggleLnumButtonRef}
                >
                    <ListOl className='rbi-button-icon' />
                    {showLineNumbers ? '!!Lines' : 'Lines'}
                </button>


                {/* Wrap Button */}

                <button
                    onClick={() => { setWrapState(!wrapState); handleButtonClick(wrapButtonRef); }}
                    className='wrap-button'
                    ref={wrapButtonRef}
                >
                    <TextWrap className='rbi-button-icon' /> {wrapState ? '!!Wrap' : 'Wrap'}
                </button>

                {/* Copy Button */}

                <CopyButton contentToCopy={resp} />

                {/* Download Button */}

                <button
                    onClick={() => { handleDownload(); handleButtonClick(downloadButtonRef); }}
                    className='download-button'
                    ref={downloadButtonRef}
                >
                    <Download className='rbi-button-icon' />Download
                </button>


                {/* Theme Button */}

                <button
                    onClick={() => { setThemeForSHL(themeForSHL == atomDark ? ghcolors : atomDark); handleButtonClick(themeButtonRef) }}
                    className='theme-button'
                    ref={themeButtonRef}
                >
                    {themeForSHL == atomDark ? <BrightnessHighFill className='rbi-button-icon' /> : <MoonFill className='rbi-button-icon' />}
                    {themeForSHL == atomDark ? 'Light' : 'Dark'}
                </button>
            </div>
        );
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

    interface Variable {
        name: string;
        value: string;
    }

    const replaceVariables = (input: string, typeOfInput: string) => {
        let result = input;
        // Retrieve the variables from localStorage and parse them into an array
        const storedVariables = localStorage.getItem('postmannVars');
        const variables: Variable[] = storedVariables ? JSON.parse(storedVariables) : [];

        variables.forEach((variable: Variable) => {
            const regex = new RegExp(`{{\\s*${variable.name}\\s*}}`, 'g');
            result = result.replace(regex, variable.value);
        });
        
        return typeOfInput==='textarea'?result:result;
    };
// create a function to return date time like Mar 23, 2024 - 5:34 pm

    const saveRequestAsHistory = (method: string,processedBody: string,processedUrl: string) => {
        const history = localStorage.getItem('postmannHistory');
        const historyArray = history ? JSON.parse(history) : [];
        const curTime = new Date().toLocaleString();

        const newHistory = {
            method: method,
            url: processedUrl,
            body: processedBody,
            time: curTime
        };
        historyArray.push(newHistory);
        localStorage.setItem('postmannHistory', JSON.stringify(historyArray));
    }

    const sendRequest = async () => {
        const processedUrl = replaceVariables(url, 'url');
        const processedBody = replaceVariables(jsonBody, 'textarea');
        setProcessedURLView(processedUrl);
        setProcessedBodyView(processedBody);
        setLoading(true); // Set loading to true when starting the request
        setResponseCode(null); // Reset the response code when sending a new request
        setIsButtonDisabled(true);
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

            // Get headers from local storage
            // const savedHeadersJSON = localStorage.getItem('postmannHeaders');
            // const savedHeaders = savedHeadersJSON ? JSON.parse(savedHeadersJSON) : {
            //     'Content-Type': 'application/json',
            //     'Cache-Control': 'no-cache',
            //     'Accept': '*/*',
            //     'Accept-Encoding': 'gzip, deflate, br',
            //     'Connection': 'keep-alive',
            // };
            // const headersJSON = {
            //     'Content-Type': 'application/json',
            //     'Cache-Control': 'no-cache',
            //     'Accept': '*/*',
            //     'Accept-Encoding': 'gzip, deflate, br',
            //     'Connection': 'keep-alive',
            // }
            // Define the type for the header objects
            type HeaderObject = {
                name: string;
                value: string;
            };

            // Retrieve the saved headers JSON string from localStorage
            let savedHeadersJSON = localStorage.getItem('postmannHeadersMRH');

            // Parse the JSON string into an array of HeaderObject
            let savedHeadersArray: HeaderObject[] = JSON.parse(savedHeadersJSON || '[]');

            // Convert the array of HeaderObject into a single object
            let savedHeadersJSONObj: Record<string, string> = savedHeadersArray.reduce((accumulator: Record<string, string>, current: HeaderObject) => {
                accumulator[current.name] = current.value;
                return accumulator;
            }, {});
            // let savedHeaders: Record<string, string> = {};
            // let headersCall: Headers = new Headers();

            // if (savedHeadersJSON) {
            //     try {
            //         savedHeaders = JSON.parse(savedHeadersJSON);
            //         headersCall = new Headers(savedHeaders);
            //     } catch (error) {
            //         console.error('Error parsing saved headers JSON:', error);
            //         // Handle parsing error, perhaps by setting default headers
            //     }
            // }

            const requestOptions: RequestInit = {
                method: requestType,
                headers: savedHeadersJSONObj,
                signal,
            };

            if (requestType !== 'GET') {
                requestOptions.body = processedBody;
                // setProcessedURLView(headersCall);
                // setProcessedBodyView(JSON.stringify(savedHeadersJSONObj));
                // setProcessedBodyView(JSON.stringify(headersJSON));
                // requestOptions.body = processedBody;
            }
            saveRequestAsHistory(requestType,processedBody,processedUrl);
            const timeoutId = setTimeout(() => abortController.abort(), 60000);

            // const res = await fetch(url, requestOptions);
            const res = await fetch(processedUrl, requestOptions);
            clearTimeout(timeoutId);

            // Capture the response headers
            const resHeaders = res.headers;
            setResponseHeaders(resHeaders);

            //Capoture the response code (200, 201, 404 etc.)
            const responseCode = res.status;
            setResponseCode(responseCode);
            setIsButtonDisabled(false);
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
                        setAbsoluteRawResponse(responseBody);
                        setResponse(responseBody);
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
                        const pdfData = await res.arrayBuffer();
                        const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
                        setResponse(pdfUrl);
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
                            setAbsoluteRawResponse(rawResponse2);
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
            setResponseCode('N/A');
            setResponseHeaders(null);
            setAbsoluteRawResponse(`Error: ${error.message}`);
            setIsButtonDisabled(false);
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
                try {
                    // Attempt to parse JSON values inside the header
                    const jsonString = String.raw`${value}`.replace(/\\/g, '\\\\');
                    const parsedValue = JSON.parse(jsonString);
                    const formattedValue = parsedValue;
                    formattedHeaders[key] = formattedValue;
                } catch (error) {
                    // If parsing fails, use the original value
                    formattedHeaders[key] = value;
                }
            });
        }

        return JSON.stringify(formattedHeaders, null, 2);
    };



    const formatHeaders2 = (headers: Headers | null) => {
        const formattedHeaders2: Record<string, string> = {};

        if (headers) {
            headers.forEach((value, key) => {
                formattedHeaders2[key] = value;
            });
        }

        return JSON.stringify(formattedHeaders2, null);
    };

    const renderVariablesModal = () => {
        // showVarModal();
        setIsVarModalOpen(true);
    }
    const renderHistoryModal = () => {
        // showHistoryModal();
        setIsHistoryModalOpen(true);
    }
    const renderNotesModal = () => {
        // showNotesModal();
        setIsNotesModalOpen(true);
    }
    const renderMRHModal = () => {
        setIsModifyRequestHeadersModalOpen(true);
    }
    const renderDonationLink = () => {
        if (country === 'IN') {
            // Display image in modal window for India
            return (
                <a href="#" onClick={() => showModal()}>
                    <HeartFill className='donateHeart' />
                    Donate
                </a>
            );
        } else {
            // Display regular PayPal link for other countries
            return (
                <a href="https://www.paypal.com/paypalme/shatadip2020" target="_blank" rel="noopener noreferrer">
                    <HeartFill className='donateHeart' />
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
            setIsVarModalOpen(false);
            setIsHistoryModalOpen(false);
            setIsNotesModalOpen(false);
            setIsModifyRequestHeadersModalOpen(false);
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
                    <p className="postmann-version">v 1.0.5*</p>
                </div>
                <div className="postmann-links">
                    {renderDonationLink()}
                    <a href="https://github.com/shatadip/Postmann" target="_blank" rel="noopener noreferrer"><Github className='githubLink' />GitHub</a>
                    {/* <a href="https://www.shatadip.com/" target="_blank" rel="noopener noreferrer">@Shatadip</a> */}
                    <LinkAlternator />
                </div>
            </div>
            <div className='dynamic-options'>
                <a href='#' onClick={renderVariablesModal}>Variables</a>
                <a href='#' onClick={renderHistoryModal}>History</a>
                <a href='#' onClick={renderNotesModal}>Notes</a>
                <a href='#' onClick={renderMRHModal}>Modify Request Headers</a>
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
                <button
                    className="postmann-button"
                    onClick={sendRequest}
                    disabled={isButtonDisabled}
                    style={{ cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
                >
                    Send Request
                </button>
            </div>
            <div className="debugStuff">
                <p>Processed URL: {processedURLView}</p>
                <p>Processed Body:
                    <pre>
                        {processedBodyView}
                    </pre>
                </p>
            </div>
            <div>
                {requestSent && ( // Render the response section only if the request has been sent
                    <>
                        <p className={`postmann-response-title`}>
                            Response:
                            <span className={`prt-code ${responseClass}`} data-tooltip='Status Code'><strong>{responseCode !== null ? responseCode : <><i className="hourGlassEmoji-styles">⌛</i></>}</strong></span>

                            <span className='prt-time' data-tooltip='Response Time'>{responseTime !== null ? ` ${responseTime.toFixed(2)}s` : ' N/A'}</span>

                            {responseCode && response && absoluteRawResponse && responseHeaders && (
                                <span className='prt-size' data-tooltip={`Response Size: ${calculateSizeInBytes(absoluteRawResponse)} (body) + ${calculateSizeInBytes(formatHeaders2(responseHeaders))} (headers)`}>
                                    {calculateSizeInBytes2(absoluteRawResponse, formatHeaders2(responseHeaders))}

                                </span>
                            )}

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
                                        {optionsDiv('pretty', response)}
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
                                    <div className={`postmann-raw-response`}><pre>{absoluteRawResponse}</pre></div>
                                ) : (
                                    <div className={`postmann-headers`}>
                                        {/* Render headers here */}
                                        {optionsDiv('headers', formatHeaders(responseHeaders))}
                                        {/* {responseHeaders && ( */}
                                        <SyntaxHighlighter
                                            language="json"
                                            style={themeForSHL}
                                            showLineNumbers={showLineNumbers}
                                            className="syntax-hl-custom-styles"
                                            wrapLongLines={wrapState}
                                        >
                                            {/* if response headers is null. show err */}
                                            {responseHeaders ? formatHeaders(responseHeaders) : `No Headers Available\nAPI URI broken or CORS issue or Network Error\nCheck the URL and try again\nAnd Donate to Postmann for 7 years of good luck`}
                                        </SyntaxHighlighter>
                                        {/* )} */}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
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

            {/* Modal for Variables */}
            <Modal
                isOpen={isVarModalOpen}
                onRequestClose={closeModal}
                contentLabel="Donation Modal"
                className={`donation-modal vars-modal ${isClosing ? 'ReactModal__Content--before-close' : ''}`}
                overlayClassName="donation-modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <div className="modal-content">
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                    <h1 className='dynamic-options-modal-h1'>Variables</h1>
                    <VariablesComponent />
                </div>
            </Modal>
            {/* Modal for History */}
            <Modal
                isOpen={isHistoryModalOpen}
                onRequestClose={closeModal}
                contentLabel="Donation Modal"
                className={`donation-modal history-modal ${isClosing ? 'ReactModal__Content--before-close' : ''}`}
                overlayClassName="donation-modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <div className="modal-content">
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                    <h1 className='dynamic-options-modal-h1'>History</h1>
                    <HistoryComponent />
                </div>
            </Modal>
            {/* Modal for Notes */}
            <Modal
                isOpen={isNotesModalOpen}
                onRequestClose={closeModal}
                contentLabel="Donation Modal"
                className={`donation-modal notes-modal ${isClosing ? 'ReactModal__Content--before-close' : ''}`}
                overlayClassName="donation-modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <div className="modal-content" style={{ width: '20rem' }}>
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                    <h1 className='dynamic-options-modal-h1'>Notes</h1>
                    <NotesComponent />
                </div>
            </Modal>
            {/* Modal for modifying request headers */}
            <Modal
                isOpen={isModifyRequestHeadersModalOpen}
                onRequestClose={closeModal}
                contentLabel="Donation Modal"
                className={`donation-modal mrh-modal ${isClosing ? 'ReactModal__Content--before-close' : ''}`}
                overlayClassName="donation-modal-overlay"
                shouldCloseOnOverlayClick={true}
            >
                <div className="modal-content" style={{ width: '20rem' }}>
                    <button className="close-button" onClick={closeModal}>
                        &times;
                    </button>
                    <h1 className='dynamic-options-modal-h1'>Request Headers</h1>
                    <MRHComponent />
                </div>
            </Modal>

        </div>
    );

};

export default PostmannComponent;
