import re

SKILLS = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "FastAPI",
    "SQL",
    "MongoDB",
    "Git",
    "Docker",
    "AWS",
    "Excel",
    "Power BI",
    "Statistics",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "REST API"
]


def extract_required_skills(text):

    found = []

    text_lower = text.lower()

    for skill in SKILLS:

        if skill.lower() in text_lower:
            found.append(skill)

    return found