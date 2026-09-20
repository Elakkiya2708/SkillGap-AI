import { useState } from "react";
import { analyzeSkills, uploadResume } from "../services/api";

const jobs = {
  "Software Developer": [
    "Python",
    "Java",
    "SQL",
    "Git",
    "React",
    "Docker",
    "AWS"
  ],

  "Data Analyst": [
    "Python",
    "SQL",
    "Excel",
    "Power BI",
    "Statistics"
  ],

  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git"
  ],

  "Backend Developer": [
    "Python",
    "FastAPI",
    "SQL",
    "REST API",
    "Docker"
  ]
};


export default function Analyze() {

  const [userSkills, setUserSkills] = useState("");
  const [job, setJob] = useState("Software Developer");
  const [result, setResult] = useState(null);

  const analyze = async () => {

    const user = userSkills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    const data = await analyzeSkills(
      user,
      jobs[job]
    );

    setResult(data);
  };


  return (
    <div style={{
      padding: "40px",
      maxWidth: "800px",
      margin: "auto"
    }}>

      <h1>SkillGap AI</h1>

      <p>
        AI-Powered Career Skill Gap Analyzer
      </p>


      <h3>Your Skills</h3>

      <input
        type="text"
        placeholder="Python, SQL, Git"
        value={userSkills}
        onChange={(e) =>
          setUserSkills(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      />


      <h3>Target Job</h3>

      <select
        value={job}
        onChange={(e) =>
          setJob(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      >

        {Object.keys(jobs).map(jobName => (
          <option key={jobName}>
            {jobName}
          </option>
        ))}

      </select>


      <br />
      <br />


      <button onClick={analyze}>
        Analyze Skill Gap
      </button>


      {result && (

        <div>

          <h2>
            {result.match_percentage}% Match
          </h2>


          <h3>Matched Skills</h3>

          {result.matched.map(skill => (
            <p key={skill}>
              ✓ {skill}
            </p>
          ))}


          <h3>Missing Skills</h3>

          {result.missing.map(skill => (
            <p key={skill}>
              ✗ {skill}
            </p>
          ))}


          <h2>Learning Roadmap</h2>


          {result.roadmap.map(item => (

            <div
              key={item.skill}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginTop: "10px"
              }}
            >

              <h3>{item.skill}</h3>

              <p>
                Priority: <b>{item.priority}</b>
              </p>


              <h4>Learning Steps</h4>

              {item.steps.map(step => (
                <p key={step}>
                  → {step}
                </p>
              ))}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}