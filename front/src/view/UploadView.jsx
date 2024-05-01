import {useState} from 'react';

function UploadPage() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('YOUR_BACKEND_URL/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            navigate('/result', {state: {data: result}});
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <div>
            <h1>Upload your data</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}/>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export {UploadPage};
