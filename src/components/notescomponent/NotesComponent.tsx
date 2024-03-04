//NotesComponent.tsx

import { useState, useEffect } from 'react';
import './NotesComponent.css';

const NotesComponent = () => {
    // Initialize state with the value from localStorage or an empty string
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('postmannNotes');
        return savedNotes ? savedNotes : '';
    });

    // Update localStorage whenever notes changes
    useEffect(() => {
        localStorage.setItem('postmannNotes', notes);
    }, [notes]);

    // Fetch and display the saved notes from localStorage when the component mounts
    useEffect(() => {
        const savedNotes = localStorage.getItem('postmannNotes');
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, []);

    return (
        <>
            <div>NotesComponent</div>
            <textarea
                className="nc-textarea"
                placeholder="Write your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            ></textarea>
        </>
    );
};

export default NotesComponent;
