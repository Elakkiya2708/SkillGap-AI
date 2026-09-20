def get_priority(skill):

    critical = [
        "python",
        "java",
        "javascript",
        "sql"
    ]

    high = [
        "react",
        "fastapi",
        "docker",
        "aws"
    ]

    medium = [
        "git",
        "power bi",
        "excel",
        "statistics"
    ]

    skill = skill.lower()

    if skill in critical:
        return "Critical"

    if skill in high:
        return "High"

    if skill in medium:
        return "Medium"

    return "Low"