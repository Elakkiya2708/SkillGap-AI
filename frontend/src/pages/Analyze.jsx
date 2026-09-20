import { useState } from "react";
import { analyzeSkills } from "../services/api";

export default function Analyze() {

  const [userSkills, setUserSkills] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {

    const user = userSkills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    const required = requiredSkills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    const data = await analyzeSkills(user, required);

    setResult(data);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>

      <h1>SkillGap AI</h1>

      <p>Find the skills you need for your target career.</p>

      <h3>Your Skills</h3>

      <input
        type="text"
        placeholder="Python, SQL, Git"
        value={userSkills}
        onChange={(e) => setUserSkills(e.target.value)}
        style={{ width: "100%", padding: "12px" }}
      />

      <h3>Required Job Skills</h3>

      <input
        type="text"
        placeholder="Python, SQL, React, Docker, AWS"
        value={requiredSkills}
        onChange={(e) => setRequiredSkills(e.target.value)}
        style={{ width: "100%", padding: "12px" }}
      />

      <br />
      <br />

      <button onClick={analyze}>
        Analyze Skill Gap
      </button>

      {result && (
        <div>

          <h2>{result.match_percentage}% Match</h2>

          <h3>Matched Skills</h3>

          {result.matched.map(skill => (
            <p key={skill}>✓ {skill}</p>
          ))}

          <h3>Missing Skills</h3>

          {result.missing.map(skill => (
            <p key={skill}>✗ {skill}</p>
          ))}

        </div>
      )}

    </div>
  );
}