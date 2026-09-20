dependencies = {

    "python": [
        "Machine Learning",
        "Data Science",
        "FastAPI"
    ],

    "javascript": [
        "React",
        "Node.js"
    ],

    "sql": [
        "Data Science",
        "Data Analyst",
        "Data Engineer"
    ],

    "machine learning": [
        "TensorFlow",
        "PyTorch",
        "AI Engineer"
    ],

    "react": [
        "Frontend Developer",
        "Full Stack Developer"
    ],

    "docker": [
        "DevOps Engineer",
        "Cloud Engineer"
    ],

    "aws": [
        "Cloud Engineer",
        "DevOps Engineer"
    ],

    "fastapi": [
        "Backend Developer"
    ],

    "java": [
        "Spring",
        "Backend Developer"
    ],

    "html": [
        "CSS",
        "JavaScript",
        "Frontend Developer"
    ],

    "css": [
        "JavaScript",
        "React",
        "Frontend Developer"
    ]

}


def get_dependencies(skill):

    return dependencies.get(
        skill.lower(),
        []
    )