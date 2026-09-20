import re
import pdfplumber
from pypdf import PdfReader
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

        pdf_bytes = file.read()

        text = ""

        # Method 1 - pdfplumber
        try:

            import io

            with pdfplumber.open(
                io.BytesIO(pdf_bytes)
            ) as pdf:

                for page in pdf.pages:

                    page_text = page.extract_text(
                        x_tolerance=2,
                        y_tolerance=3
                    )

                    if page_text:
                        text += page_text + "\n"

        except Exception as e:

            print(
                "pdfplumber error:",
                e
            )


        # Method 2 - pypdf fallback
        if len(text.strip()) < 20:

            try:

                import io

                reader = PdfReader(
                    io.BytesIO(pdf_bytes)
                )

                text = ""

                for page in reader.pages:

                    page_text = (
                        page.extract_text()
                        or ""
                    )

                    text += (
                        page_text +
                        "\n"
                    )

            except Exception as e:

                print(
                    "pypdf error:",
                    e
                )


        print(
            "Extracted text length:",
            len(text)
        )

        print(
            "Extracted text preview:",
            text[:1000]
        )

        return text


    # =========================
    # DOCX
    # =========================

    if filename.endswith(".docx"):

        document = Document(file)

        text = ""

        for paragraph in document.paragraphs:

            text += (
                paragraph.text +
                "\n"
            )

        return text


    return ""


def extract_skills(text):

    found = []

    if not text:

        print("No text extracted from resume")

        return found


    # Normalize text
    text_lower = text.lower()

    text_lower = re.sub(
        r"\s+",
        " ",
        text_lower
    )


    # =========================
    # SKILL DETECTION
    # =========================

    for skill in SKILLS:

        skill_lower = skill.lower()


        # Special C++
        if skill_lower == "c++":

            if "c++" in text_lower:

                found.append(skill)

            continue


        # Special Node.js
        if skill_lower == "node.js":

            if (
                "node.js" in text_lower
                or "node js" in text_lower
                or "nodejs" in text_lower
            ):

                found.append(skill)

            continue


        # Special React
        if skill_lower == "react":

            if (
                "react" in text_lower
                or "react.js" in text_lower
            ):

                found.append(skill)

            continue


        # Normal skill
        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(skill_lower)
            + r"(?![a-z0-9])"
        )


        if re.search(
            pattern,
            text_lower
        ):

            found.append(skill)


    # Remove duplicates
    found = list(
        dict.fromkeys(found)
    )


    print(
        "Detected skills:",
        found
    )


    return found