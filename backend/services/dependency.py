dependencies = {

    "python": [
        "machine learning",
        "data science",
        "fastapi"
    ],

    "javascript": [
        "react",
        "node.js"
    ],

    "sql": [
        "data science",
        "data analyst",
        "data engineer"
    ],

    "machine learning": [
        "tensorflow",
        "pytorch",
        "ai engineer"
    ],

    "react": [
        "frontend developer",
        "full stack developer"
    ],

    "docker": [
        "devops engineer",
        "cloud engineer"
    ],

    "aws": [
        "cloud engineer",
        "devops engineer"
    ],

    "fastapi": [
        "backend developer"
    ]

}


def get_dependencies(skill):

    return dependencies.get(
        skill.lower(),
        []
    )