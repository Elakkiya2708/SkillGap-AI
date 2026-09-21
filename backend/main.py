from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from reportlab.pdfgen import canvas

from datetime import datetime
import io

from services.skill_gap import calculate_skill_gap
from services.priority import get_priority
from services.roadmap import get_roadmap
from services.resume import extract_text, extract_skills
from services.job_analyzer import extract_required_skills
from services.dependency import get_dependencies

from services.database import (
    init_db,
    save_analysis,
    get_history,
    delete_analysis,
    clear_history
)


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


# =========================
# DATABASE
# =========================

init_db()


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
# SKILL GAP
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


    filename = (
        file.filename or ""
    ).lower()


    if not any(
        filename.endswith(ext)
        for ext in allowed
    ):

        return {
            "error":
            "Only PDF and DOCX files are allowed"
        }


    try:

        text = extract_text(
            file.file,
            file.filename
        )


        skills = extract_skills(text)


        print(
            "FINAL DETECTED SKILLS:",
            skills
        )


        return {

            "filename":
                file.filename,

            "skills":
                skills,

            "text_length":
                len(text)

        }


    except Exception as e:

        print(
            "Resume error:",
            str(e)
        )


        return {

            "filename":
                file.filename,

            "skills":
                [],

            "text_length":
                0,

            "error":
                str(e)

        }


# =========================
# JOB DESCRIPTION
# =========================

@app.post("/analyze-job")
def analyze_job(data: dict):

    text = data.get(
        "job_description",
        ""
    )


    skills =
        extract_required_skills(text)


    return {

        "required_skills":
            skills

    }


# =========================
# SAVE HISTORY
# =========================

@app.post("/save-analysis")
def save_analysis_route(data: dict):

    try:

        save_analysis(

            data.get(
                "job",
                "Unknown"
            ),

            data.get(
                "match_percentage",
                0
            ),

            data.get(
                "matched",
                []
            ),

            data.get(
                "missing",
                []
            )

        )


        return {
            "message":
                "Analysis saved"
        }


    except Exception as e:

        print(
            "Save history error:",
            str(e)
        )


        return {
            "message":
                "Failed to save history",

            "error":
                str(e)
        }


# =========================
# GET HISTORY
# =========================

@app.get("/history")
def history():

    try:

        return get_history()

    except Exception as e:

        print(
            "History error:",
            str(e)
        )

        return []


# =========================
# DELETE ONE HISTORY
# =========================

@app.delete("/history/{analysis_id}")
def delete_history(
    analysis_id: int
):

    deleted = delete_analysis(
        analysis_id
    )


    if not deleted:

        return {
            "message":
                "Analysis not found"
        }


    return {
        "message":
            "Analysis deleted"
    }


# =========================
# DELETE ALL HISTORY
# =========================

@app.delete("/history")
def delete_all_history():

    clear_history()


    return {
        "message":
            "All history deleted"
    }


# =========================
# PDF REPORT
# =========================

@app.post("/download-report")
def download_report(data: dict):

    buffer = io.BytesIO()


    pdf = canvas.Canvas(
        buffer
    )


    pdf.setFont(
        "Helvetica-Bold",
        18
    )


    pdf.drawString(
        50,
        800,
        "SkillGap AI - Career Skill Gap Report"
    )


    pdf.setFont(
        "Helvetica",
        10
    )


    pdf.drawString(
        50,
        780,
        "Generated: "
        + datetime.now().strftime(
            "%d-%m-%Y %H:%M"
        )
    )


    y = 750


    pdf.setFont(
        "Helvetica",
        12
    )


    pdf.drawString(
        50,
        y,
        "Target Job: "
        + data.get(
            "job",
            "N/A"
        )
    )


    y -= 30


    if data.get(
        "resume_filename"
    ):

        pdf.drawString(
            50,
            y,
            "Resume: "
            + data.get(
                "resume_filename"
            )
        )

        y -= 30


    pdf.drawString(
        50,
        y,
        "Skill Match: "
        + str(
            data.get(
                "match_percentage",
                0
            )
        )
        + "%"
    )


    y -= 40


    pdf.setFont(
        "Helvetica-Bold",
        14
    )


    pdf.drawString(
        50,
        y,
        "Matched Skills"
    )


    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )


    matched = data.get(
        "matched",
        []
    )


    if matched:

        for skill in matched:

            pdf.drawString(
                60,
                y,
                "- " + skill
            )

            y -= 20

    else:

        pdf.drawString(
            60,
            y,
            "No matched skills"
        )

        y -= 20


    y -= 20


    pdf.setFont(
        "Helvetica-Bold",
        14
    )


    pdf.drawString(
        50,
        y,
        "Missing Skills"
    )


    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )


    missing = data.get(
        "missing",
        []
    )


    if missing:

        for skill in missing:

            pdf.drawString(
                60,
                y,
                "- " + skill
            )

            y -= 20

    else:

        pdf.drawString(
            60,
            y,
            "No missing skills"
        )

        y -= 20


    y -= 20


    pdf.setFont(
        "Helvetica-Bold",
        14
    )


    pdf.drawString(
        50,
        y,
        "Learning Roadmap"
    )


    y -= 25


    pdf.setFont(
        "Helvetica",
        11
    )


    roadmap = data.get(
        "roadmap",
        []
    )


    for item in roadmap:

        skill = item.get(
            "skill",
            "Unknown"
        )


        priority = item.get(
            "priority",
            "Low"
        )


        pdf.drawString(
            60,
            y,
            skill
            + " - "
            + priority
        )


        y -= 20


        if y < 60:

            pdf.showPage()

            pdf.setFont(
                "Helvetica",
                11
            )

            y = 800


    pdf.save()


    buffer.seek(0)


    return StreamingResponse(

        buffer,

        media_type="application/pdf",

        headers={
            "Content-Disposition":
            "attachment; "
            "filename=SkillGap_Report.pdf"
        }

    )