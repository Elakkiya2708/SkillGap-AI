roadmaps = {

    "python": [
        "Python Basics",
        "Functions and OOP",
        "Python Projects"
    ],

    "react": [
        "JavaScript Basics",
        "React Fundamentals",
        "React Projects"
    ],

    "docker": [
        "Linux Basics",
        "Docker Fundamentals",
        "Containerize a Project"
    ],

    "aws": [
        "Cloud Fundamentals",
        "AWS Core Services",
        "Deploy a Project"
    ],

    "sql": [
        "SQL Basics",
        "Joins and Queries",
        "Database Project"
    ],

    "fastapi": [
        "Python Basics",
        "REST API Concepts",
        "FastAPI Project"
    ]
}


def get_roadmap(skill):

    return roadmaps.get(
        skill.lower(),
        [
            f"Learn {skill} Basics",
            f"Practice {skill}",
            f"Build a {skill} Project"
        ]
    )