import { useState } from "react";
import {
  analyzeSkills,
  uploadResume
} from "../services/api";


const jobs = {

  "Software Developer": [
    "Python", "Java", "JavaScript", "SQL", "Git", "React", "Docker", "AWS"
  ],

  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "MongoDB", "Git"
  ],

  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git"
  ],

  "Backend Developer": [
    "Python", "FastAPI", "Node.js", "SQL", "REST API", "Docker", "Git"
  ],

  "Java Developer": [
    "Java", "SQL", "Spring", "REST API", "Git", "Docker"
  ],

  "Python Developer": [
    "Python", "SQL", "FastAPI", "REST API", "Git", "Docker"
  ],

  "Web Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Git"
  ],

  "Data Analyst": [
    "Python", "SQL", "Excel", "Power BI", "Statistics"
  ],

  "Data Scientist": [
    "Python", "SQL", "Statistics", "Machine Learning", "Data Science"
  ],

  "Machine Learning Engineer": [
    "Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Docker"
  ],

  "AI Engineer": [
    "Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Docker"
  ],

  "Data Engineer": [
    "Python", "SQL", "Docker", "AWS", "Git"
  ],

  "Cloud Engineer": [
    "AWS", "Docker", "Linux", "Python", "Git"
  ],

  "DevOps Engineer": [
    "Docker", "AWS", "Git", "Python", "Linux"
  ],

  "AWS Cloud Developer": [
    "AWS", "Python", "Java", "Docker", "Git", "SQL"
  ],

  "Cybersecurity Analyst": [
    "Python", "Linux", "SQL", "Git", "AWS"
  ],

  "QA Engineer": [
    "Python", "Java", "SQL", "Git", "REST API"
  ],

  "Software Tester": [
    "Java", "Python", "SQL", "Git", "REST API"
  ],

  "Database Developer": [
    "SQL", "Python", "MongoDB", "Git"
  ],

  "Business Analyst": [
    "Excel", "SQL", "Power BI", "Statistics"
  ],

  "Power BI Developer": [
    "Power BI", "Excel", "SQL", "Statistics"
  ],

  "AI/ML Intern": [
    "Python", "Machine Learning", "SQL", "Statistics"
  ],

  "Software Engineer": [
    "Python", "Java", "JavaScript", "SQL", "Git", "Docker", "AWS"
  ],

  "Mobile App Developer": [
    "Java", "JavaScript", "Git", "SQL"
  ]

};


export default function Analyze() {

  const [userSkills, setUserSkills] = useState("");

  const [job, setJob] =
    useState("Software Developer");

  const [result, setResult] = useState(null);

  const [resume, setResume] = useState("");

  const [detectedSkills, setDetectedSkills] =
    useState([]);


  const handleResume = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowed = [
      ".pdf",
      ".docx"
    ];

    const valid = allowed.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!valid) {

      alert("Please upload PDF or DOCX file");

      return;
    }


    setResume(file.name);


    try {

      const data = await uploadResume(file);

      setDetectedSkills(data.skills || []);

      setUserSkills(
        (data.skills || []).join(", ")
      );

    } catch (error) {

      console.error(error);

      alert("Resume upload failed");

    }

  };


  const analyze = async () => {

    const user = userSkills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);


    if (user.length === 0) {

      alert(
        "Please upload a resume or enter your skills"
      );

      return;
    }


    try {

      const data = await analyzeSkills(
        user,
        jobs[job]
      );

      setResult(data);

    } catch (error) {

      console.error(error);

      alert("Analysis failed");

    }

  };


  return (

    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "auto"
      }}
    >

      <h1>SkillGap AI</h1>

      <p>
        AI-Powered Career Skill Gap Analyzer
      </p>


      <h3>Upload Resume</h3>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleResume}
      />


      {resume && (
        <p>
          📄 {resume}
        </p>
      )}


      {detectedSkills.length > 0 && (

        <div>

          <h3>
            Detected Skills
          </h3>


          {detectedSkills.map(skill => (

            <span
              key={skill}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                margin: "5px",
                border: "1px solid #ccc",
                borderRadius: "20px"
              }}
            >
              {skill}
            </span>

          ))}

        </div>

      )}


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
          padding: "12px",
          boxSizing: "border-box"
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

          <option
            key={jobName}
            value={jobName}
          >
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

              <h3>
                {item.skill}
              </h3>

              <p>
                Priority: <b>
                  {item.priority}
                </b>
              </p>


              <h4>
                Learning Steps
              </h4>


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