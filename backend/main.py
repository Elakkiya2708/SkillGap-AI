from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.skill_gap import calculate_skill_gap
from services.priority import get_priority
from services.roadmap import get_roadmap
from services.resume import extract_text, extract_skills
from services.job_analyzer import extract_required_skills
from services.dependency import get_dependencies


app = FastAPI()


# =========================
# CORS
# =========================

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


# =========================
# REQUEST MODEL
# =========================

class SkillRequest(BaseModel):

    user_skills: list[str]

    required_skills: list[str]


# =========================
# HOME
# =========================

@app.get("/")
def home():

    return {
        "message": "SkillGap AI API is running"
    }


# =========================
# SKILL GAP ANALYSIS
# =========================

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

            "priority":
                get_priority(skill),

            "steps":
                get_roadmap(skill),

            "dependencies":
                get_dependencies(skill)

        })


    result["roadmap"] = roadmap


    return result


# =========================
# RESUME UPLOAD
# =========================

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
            "error":
            "Only PDF and DOCX files are allowed"
        }


    text = extract_text(
        file.file,
        file.filename
    )


    skills = extract_skills(text)


    return {

        "filename":
            file.filename,

        "skills":
            skills,

        "text_length":
            len(text)

    }


# =========================
# JOB DESCRIPTION ANALYZER
# =========================

@app.post("/analyze-job")
def analyze_job(data: dict):

    text =
        data.get(
            "job_description",
            ""
        )


    skills =
        extract_required_skills(text)


    return {

        "required_skills":
            skills

    }