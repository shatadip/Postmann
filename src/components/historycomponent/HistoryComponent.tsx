import './HistoryComponent.css'
import './CardStyles.css'

const HistoryComponent = () => {
    let histURL = 'https://bookstore.toolsqa.com/Account/v1/User/16798781-4f29-47e8-b96f-a532903c1482';
    let histBody =
`{
    'username': 'test',
    'password': 'test'
}`;

/* map all localstorage postmannHistory */
    const history = localStorage.getItem('postmannHistory');
    const historyArray = history ? JSON.parse(history) : [];

    // const deleteHistoryItem = (index: number) => {
    //     const updatedHistoryArray = historyArray.filter((_:any, i:number) => i !== index);
    //     localStorage.setItem('postmannHistory', JSON.stringify(updatedHistoryArray));
    // };

    // const rerunHistoryItem = (historyItem: any) => {
    //     console.log(`Re-running: ${historyItem.url} with method ${historyItem.method}`);
    // };

    return (
        <>
            <div className="hc-container">
                <div>HistoryComponent</div>

                {/* card begin */}
                <main>
                    <header>
                        <span>
                            {/* add svg */}
                            <img src="date-svgrepo-com.svg" alt="" width={24} />
                        </span>
                        <b>{getDateTime()}</b>
                    </header>
                    <section>
                        <h1>Method: <span className="postmann-get">GET</span></h1>
                        <h1>URL:</h1>
                        <textarea
                            name="urlTextArea"
                            id="urlTextArea"
                            className='historyTA'
                            cols={34}
                            rows={1}
                            readOnly
                            value={histURL}
                        ></textarea>
                        <h1>Body:</h1>

                        <textarea
                            cols={34}
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
                </main>
                {/* card end */}

            </div>
            {/* map historyArray sort by latest to oldest */}
        
        {historyArray.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((historyItem:any, index:number) => (
                
                <div key={index} style={{color:'white'}}>
                    <p>key: {index}</p>
                    <p>date: {historyItem.date}</p>
                    <p>method: {historyItem.method}</p>
                    <p>url: {historyItem.url}</p>
                    <p>body: {historyItem.body}</p>
                    <br />
                </div>
                
            ))}
        </>
    )
}

const getDateTime = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        hour12: true
    };
    
    return date.toLocaleString('en-US', options);
}

export default HistoryComponent