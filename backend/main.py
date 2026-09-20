from fastapi import FastAPI
from pydantic import BaseModel
from services.skill_gap import calculate_skill_gap

app = FastAPI()

class SkillRequest(BaseModel):
    user_skills: list[str]
    required_skills: list[str]

@app.get("/")
def home():
    return {"message": "SkillGap AI API"}

@app.post("/analyze")
def analyze(data: SkillRequest):

    result = calculate_skill_gap(
        data.user_skills,
        data.required_skills
    )

    return result