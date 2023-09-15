import React, { useState, useEffect } from "react";

const Home: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileContent, setFileContent] = useState<string>("");
	const [contentsList, setContentsList] = useState<string[]>([]);

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		setSelectedFile(file);
	};

	const onSubmit = async (event: React.FormEvent) => {
		console.log("submit clicked.");
		event.preventDefault();

		if (selectedFile) {
			const formData = new FormData();
			formData.append("file", selectedFile);

			try {
				const response = await fetch("http://127.0.0.1:8000/api/convert/", {
					method: "POST",
					body: formData,
				});

				const data = await response.text();
				setFileContent(data);
			} catch (error) {
				console.error("There was an error uploading the file", error);
			}
		}
	};
	const handleDisplayContent = (e: React.MouseEvent<HTMLInputElement>) => {
		console.log(e.currentTarget.textContent);
	};

	useEffect(() => {
		console.log("1st rendering");
		const response = fetch("http://127.0.0.1:8000/api/list/", {})
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				setContentsList([...r.data]);
			})
			.catch((e) => console.log("Error:", e));
	}, []);

	return (
		<>
			<form onSubmit={onSubmit}>
				<input type="file" accept=".ipynb" onChange={onFileChange} />
				<button type="submit">Convert to HTML</button>
			</form>
			{fileContent ? (
				<iframe
					title="Notebook Preview"
					srcDoc={fileContent}
					width="100%"
					height="800px"
					style={{ marginTop: "20px", border: "none" }}
				/>
			) : (
				<div style={{ textAlign: "center", margin: "20px" }}>
					ここにnotebookを表示
				</div>
			)}
			{contentsList.length > 0 &&
				contentsList.map((content, index) => (
					<p key={index} onClick={handleDisplayContent}>
						{content}
					</p>
				))}
		</>
	);
};

export default Home;
