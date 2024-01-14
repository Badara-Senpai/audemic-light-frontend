import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

const getRecentFiles = async () => {
    const response = await fetch('http://localhost:8000/recent-files/');
    if (response.ok) {
        return response.json();
    }

    throw new Error('Network response was not ok.');
};

const fetchExtractedText = async (fileId) => {
    try {
        const response = await fetch(`http://localhost:8000/extract-text/${fileId}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error fetching extracted text:', error);
        return 'Failed to fetch extracted text.';
    }
};


export default function RecentFiles() {
    const [files, setFiles] = useState([]);
    const [extractedText, setExtractedText] = useState('');

    useEffect(() => {
        getRecentFiles()
            .then(recentFiles => {
                setFiles(recentFiles);
            })
            .catch(error => {
                console.error('Error fetching recent files:', error);
            });
    }, []);

    const handleExtractTextClick = async (fileId) => {
        const text = await fetchExtractedText(fileId);
        setExtractedText(text);
    };


    return (
        <main>
            {extractedText}


            <h4>Recent Uploads</h4>

            {files.map((file, index) => (
                <li key={index}>
                    {file.file_name}
                    <Button onClick={() => handleExtractTextClick(file.id)}>Listen</Button>
                </li>
            ))}
        </main>
    )
}