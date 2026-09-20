def calculate_skill_gap(user_skills, required_skills):

    user = {x.lower() for x in user_skills}
    required = {x.lower() for x in required_skills}

    matched = list(user & required)
    missing = list(required - user)

    score = round((len(matched) / len(required)) * 100, 2) if required else 0

    return {
        "matched": matched,
        "missing": missing,
        "match_percentage": score
    }