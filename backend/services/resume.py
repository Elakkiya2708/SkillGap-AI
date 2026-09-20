import pdfplumber
from docx import Document
import re


SKILLS = [
    "Python",
    "Java",
    "C++",
    "C",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "React.js",
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
    "REST API",
    "Artificial Intelligence",
    "Deep Learning"
]


def extract_text(file, filename):

    filename = filename.lower()

    # =========================
    # PDF
    # =========================

    if filename.endswith(".pdf"):

        text = ""

        with pdfplumber.open(file) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text(
                    x_tolerance=2,
                    y_tolerance=3
                )

                if page_text:
                    text += page_text + "\n"

        return text


    # =========================
    # DOCX
    # =========================

    if filename.endswith(".docx"):

        document = Document(file)

        text = ""

        for paragraph in document.paragraphs:

            text += paragraph.text + "\n"

        return text


    return ""


def extract_skills(text):

    found = []

    if not text:
        return found

    text_lower = text.lower()

    # Normalize common resume formats
    text_lower = text_lower.replace(
        "react.js",
        "react"
    )

    text_lower = text_lower.replace(
        "node.js",
        "node.js"
    )


    for skill in SKILLS:

        skill_lower = skill.lower()

        # Avoid C matching inside C++
        if skill_lower == "c":

            pattern = r"(?<!\+)\bc\b(?!\+)"

        else:

            pattern = (
                r"(?<![a-z0-9+#.])"
                + re.escape(skill_lower)
                + r"(?![a-z0-9+#.])"
            )


        if re.search(
            pattern,
            text_lower
        ):

            # Don't duplicate React / React.js
            if skill == "React.js" and "React" in found:
                continue

            if skill == "React" and "React.js" in found:
                continue

            found.append(skill)


    return found