import fitz
from docx import Document


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

    # =========================
    # PDF
    # =========================

    if filename.endswith(".pdf"):

        pdf = fitz.open(
            stream=file.read(),
            filetype="pdf"
        )

        text = ""

        for page in pdf:

            text += page.get_text(
                "text"
            ) + "\n"

        pdf.close()

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

    text_lower = text.lower()


    for skill in SKILLS:

        if skill.lower() in text_lower:

            found.append(skill)


    return found