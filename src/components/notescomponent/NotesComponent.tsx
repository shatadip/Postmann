import { useState, useEffect, useRef } from 'react';
import './NotesComponent.css';

const NotesComponent = () => {
    // Initialize state with the value from localStorage or an empty string
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('postmannNotes');
        return savedNotes ? savedNotes : '';
    });

    // Create a reference to the textarea with explicit typing
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // Set focus on the textarea when the component mounts
    useEffect(() => {
        // Check if the ref is currently pointing to a DOM element
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    return (
        <>
            <div className='notes-label'>Your notes are auto-saved here, think of it as a scratchpad.</div>
            <textarea
                ref={textareaRef} // Attach the ref to the textarea
                className="nc-textarea"
                placeholder="Write your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            ></textarea>
        </>
    );
};

export default NotesComponent;
