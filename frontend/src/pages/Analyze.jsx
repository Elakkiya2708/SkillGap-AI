import { useState } from "react";
import { analyzeSkills } from "../services/api";

export default function Analyze() {

  const [result, setResult] = useState(null);

  const analyze = async () => {

    const data = await analyzeSkills(
      ["Python", "SQL", "Git"],
      ["Python", "SQL", "Git", "React", "Docker", "AWS"]
    );

    setResult(data);
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>SkillGap AI</h1>

      <p>AI-Powered Career Skill Gap Analyzer</p>

      <button onClick={analyze}>
        Analyze My Skills
      </button>

      {result && (
        <div>

          <h2>{result.match_percentage}% Match</h2>

          <h3>Matched Skills</h3>

          {result.matched.map((skill) => (
            <p key={skill}>✓ {skill}</p>
          ))}

          <h3>Missing Skills</h3>

          {result.missing.map((skill) => (
            <p key={skill}>✗ {skill}</p>
          ))}

        </div>
      )}

    </div>
  );
}