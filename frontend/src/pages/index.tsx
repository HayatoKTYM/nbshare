import React, { useState } from 'react';

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const onSubmit = async (event: React.FormEvent) => {
    console.log('submit clicked.')
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/convert/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.text();
        setFileContent(data);
      } catch (error) {
        console.error('There was an error uploading the file', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".ipynb" onChange={onFileChange} />
        <button type="submit">Convert to HTML</button>
      </form>
      { fileContent ? (
      <iframe
        title="Notebook Preview"
        srcDoc={fileContent}
        width="100%"
        height="800px"
        style={{ marginTop: '20px', border: 'none' }}
      />
      ) : <div style={{textAlign: "center", margin: "20px"}}>ここにnotebookを表示</div>
      }
    </div>
  );
};

export default Home;
