import json
import os

import nbformat
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from nbconvert import HTMLExporter
from starlette.templating import Jinja2Templates

app = FastAPI()
origins = ["http://localhost:3001"]  # 開発用
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
templates = Jinja2Templates(directory="frontend/out")
app.mount("/_next", StaticFiles(directory="frontend/out/_next"), name="next-static")


@app.get("/health")
def health():
    return "health check, OK"


@app.get("/")
def read_root(request: Request):
    # index.htmlを返す
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/convert")
async def upload_notebook(file: UploadFile = File(...)):
    if not file.filename.endswith(".ipynb"):
        raise HTTPException(
            status_code=400, detail="Invalid file format. Please upload a .ipynb file."
        )

    content = await file.read()

    # バイト列をPythonの辞書オブジェクトにデシリアライズ
    notebook = nbformat.reads(content.decode("utf-8"), as_version=4)
    html_exporter = HTMLExporter()
    (html_output, resources) = html_exporter.from_notebook_node(notebook)

    return HTMLResponse(content=html_output)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
