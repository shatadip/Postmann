import { useState } from 'react';
import './HistoryComponent.css'
import './CardStyles.css'
interface HistoryComponentProps {
    onReRun: (method: string, url: string, body: string) => void;
}
const HistoryComponent: React.FC<HistoryComponentProps> = ({ onReRun }) => {
    //     let histURL = 'https://bookstore.toolsqa.com/Account/v1/User/16798781-4f29-47e8-b96f-a532903c1482';
    //     let histBody =
    // `{
    //     'username': 'test',
    //     'password': 'test'
    // }`;

    /* map all localstorage postmannHistory */
    const [historyArray, setHistoryArray] = useState(() => {
        const history = localStorage.getItem('postmannHistory');
        return history ? JSON.parse(history) : [];
    });

    const deleteHistoryItem = (index: number) => {
        const updatedHistoryArray = historyArray.filter((_: any, i: number) => i !== index);
        setHistoryArray(updatedHistoryArray);
        localStorage.setItem('postmannHistory', JSON.stringify(updatedHistoryArray));
    };
    return (
        <>
            <div className="hc-container">
                <div className='history-label'>Here you'll see your earlier requests, and can re-run them as well.</div>

                {/* card begin */}
                {/* <main>
                    <header>
                        <span>
                            <img src="date-svgrepo-com.svg" alt="" width={24} />
                        </span>
                        <b>{getDateTime()}</b>
                    </header>
                    <section>
                        <h1>Method: <span className="postmann-get">GET</span></h1>
                        <h1>URL:</h1>
                        <textarea
                            name="urlTextArea"
                            className='historyTA urlTextArea'
                            cols={44}
                            rows={1}
                            readOnly
                            value={histURL}
                        ></textarea>
                        <h1>Body:</h1>

                        <textarea
                            cols={44}
                            rows={6}
                            id='bodyTextArea'
                            className="historyTA"
                            value={histBody}
                            readOnly
                            ></textarea>

                    </section>
                    <footer>
                        <button className="btn neutral">
                            Delete
                        </button>
                        <button className="btn primary">
                            Re-run
                        </button>
                    </footer>
                </main> */}
                {/* card end */}

                {/* map historyArray sort by latest to oldest */}
                {historyArray.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .reverse()
                    .map((historyItem: any, index: number) => (

                        <div key={index} className='all-cards'>
                            {/* <p>key: {index}</p>
                    <p>date: {historyItem.date}</p>
                    <p>method: {historyItem.method}</p>
                    <p>url: {historyItem.url}</p>
                    <p>body: {historyItem.body}</p>
                    <br /> */}
                            {/* card begin */}
                            <main>
                                <header>
                                    <span>
                                        {/* add svg */}
                                        <img src="date-svgrepo-com.svg" alt="" width={24} />
                                    </span>
                                    <b>{historyItem.time.curTime}</b>
                                </header>
                                <section>
                                    <h1>Method: <span className={`postmann-${historyItem.method.toLowerCase()}`}>{historyItem.method}</span></h1>
                                    <h1>URL:</h1>
                                    <textarea
                                        name="urlTextArea"
                                        className='historyTA urlTextArea'
                                        cols={44}
                                        rows={1}
                                        readOnly
                                        value={historyItem.url}
                                    ></textarea>
                                    {historyItem.method === 'GET' ? null : (
                                        <>
                                            <h1>Body:</h1>
                                            <textarea
                                                cols={44}
                                                rows={6}
                                                className="historyTA bodyTextArea"
                                                wrap='off'
                                                style={{ whiteSpace: 'pre-wrap' }}
                                                readOnly
                                                value={historyItem.body.replace(/\n/g, (_: string) => '\r\n')}
                                            ></textarea>

                                        </>
                                    )}

                                </section>
                                <footer>
                                    <button className="btn neutral" onClick={() => deleteHistoryItem(index)}>
                                        Delete
                                    </button>
                                    <button className="btn primary" onClick={() => onReRun(historyItem.method, historyItem.url, historyItem.method === 'GET' ? '' : historyItem.body)}>
                                        Re-run
                                    </button>
                                </footer>
                            </main>
                            {/* card end */}

                        </div>

                    ))}
            </div>

        </>
    )
}

// const getDateTime = () => {
//     const date = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric', 
//         hour: 'numeric', 
//         minute: 'numeric', 
//         second: 'numeric', 
//         hour12: true
//     };

//     return date.toLocaleString('en-US', options);
// }

export default HistoryComponent