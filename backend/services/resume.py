from pypdf import PdfReader
from docx import Document
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


def extract_text(file, filename):

    filename = filename.lower()

    if filename.endswith(".pdf"):

        reader = PdfReader(file)

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""
            text += "\n"

        return text


    if filename.endswith(".docx"):

        document = Document(file)

        text = ""

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

        return text


    return ""


def extract_skills(text):

    found = []

    text_lower = text.lower()


    for skill in SKILLS:

        pattern = r"\b" + re.escape(
            skill.lower()
        ) + r"\b"

        if re.search(
            pattern,
            text_lower
        ):

            found.append(skill)


    return found