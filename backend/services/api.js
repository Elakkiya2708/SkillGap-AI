export async function analyzeSkills(userSkills, requiredSkills) {

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_skills: userSkills,
      required_skills: requiredSkills
    })
  });

  return response.json();
}