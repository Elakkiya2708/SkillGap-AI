from pypdf import PdfReader
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
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch"
]


def extract_text(file):

    reader = PdfReader(file)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def extract_skills(text):

    found = []

    text_lower = text.lower()

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text_lower):
            found.append(skill)

    return found