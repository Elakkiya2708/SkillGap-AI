from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.skill_gap import calculate_skill_gap
from services.priority import get_priority
from services.roadmap import get_roadmap
from services.resume import extract_text, extract_skills
from services.job_analyzer import extract_required_skills
from services.dependency import get_dependencies
from fastapi.responses import StreamingResponse
from reportlab.pdfgen import canvas
import io

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class SkillRequest(BaseModel):

    user_skills: list[str]
    required_skills: list[str]


@app.get("/")
def home():

    return {
        "message": "SkillGap AI API is running"
    }

@app.post("/download-report")
def download_report(data: dict):

    buffer = io.BytesIO()

    pdf = canvas.Canvas(buffer)

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, 800, "SkillGap AI - Career Skill Gap Report")

    pdf.setFont("Helvetica", 12)

    y = 760

    pdf.drawString(
        50, y,
        "Target Job: " + data.get("job", "N/A")
    )

    y -= 30

    pdf.drawString(
        50, y,
        "Skill Match: " +
        str(data.get("match_percentage", 0)) + "%"
    )

    y -= 40

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Matched Skills")

    y -= 25

    pdf.setFont("Helvetica", 11)

    for skill in data.get("matched", []):

        pdf.drawString(60, y, "✓ " + skill)

        y -= 20

    y -= 20

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Missing Skills")

    y -= 25

    pdf.setFont("Helvetica", 11)

    for skill in data.get("missing", []):

        pdf.drawString(60, y, "✗ " + skill)

        y -= 20

    pdf.save()

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=SkillGap_Report.pdf"
        }
    )

@app.post("/analyze")
def analyze(data: SkillRequest):

    result = calculate_skill_gap(
        data.user_skills,
        data.required_skills
    )

    roadmap = []

    for skill in result["missing"]:

        roadmap.append({
            "skill": skill,
            "priority": get_priority(skill),
            "steps": get_roadmap(skill),
            "dependencies": get_dependencies(skill)
        })

    result["roadmap"] = roadmap

    return result


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    allowed = [
        ".pdf",
        ".docx"
    ]

    filename = file.filename.lower()

    if not any(
        filename.endswith(ext)
        for ext in allowed
    ):

        return {
            "error": "Only PDF and DOCX files are allowed"
        }

    text = extract_text(
        file.file,
        file.filename
    )

    skills = extract_skills(text)

    return {
        "filename": file.filename,
        "skills": skills,
        "text_length": len(text)
    }


@app.post("/analyze-job")
def analyze_job(data: dict):

    text = data.get(
        "job_description",
        ""
    )

    skills = extract_required_skills(text)

    return {
        "required_skills": skills
    }