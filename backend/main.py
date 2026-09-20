from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.skill_gap import calculate_skill_gap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class SkillRequest(BaseModel):
    user_skills: list[str]
    required_skills: list[str]


@app.get("/")
def home():
    return {"message": "SkillGap AI API is running"}


@app.post("/analyze")
def analyze(data: SkillRequest):

    result = calculate_skill_gap(
        data.user_skills,
        data.required_skills
    )

    return result