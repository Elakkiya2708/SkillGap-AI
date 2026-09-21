import { useState } from "react";

import {
  analyzeSkills,
  uploadResume
} from "../services/api";


const jobs = {

  "Software Developer": [
    "Python", "Java", "JavaScript", "SQL",
    "Git", "React", "Docker", "AWS"
  ],

  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React",
    "Node.js", "SQL", "MongoDB", "Git"
  ],

  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git"
  ],

  "Backend Developer": [
    "Python", "FastAPI", "Node.js", "SQL",
    "REST API", "Docker", "Git"
  ],

  "Java Developer": [
    "Java", "SQL", "Git", "Docker"
  ],

  "Python Developer": [
    "Python", "SQL", "FastAPI",
    "REST API", "Git", "Docker"
  ],

  "Web Developer": [
    "HTML", "CSS", "JavaScript",
    "React", "Node.js", "Git"
  ],

  "Data Analyst": [
    "Python", "SQL", "Excel",
    "Power BI", "Statistics"
  ],

  "Data Scientist": [
    "Python", "SQL", "Statistics",
    "Machine Learning", "Data Science"
  ],

  "Machine Learning Engineer": [
    "Python", "Machine Learning",
    "TensorFlow", "PyTorch", "SQL", "Docker"
  ],

  "AI Engineer": [
    "Python", "Machine Learning",
    "TensorFlow", "PyTorch", "SQL", "Docker"
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
    "AWS", "Python", "Java",
    "Docker", "Git", "SQL"
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
    "Python", "Machine Learning",
    "SQL", "Statistics"
  ],

  "Software Engineer": [
    "Python", "Java", "JavaScript",
    "SQL", "Git", "Docker", "AWS"
  ],

  "Mobile App Developer": [
    "Java", "JavaScript", "Git", "SQL"
  ]

};


export default function Analyze() {

  const [userSkills, setUserSkills] =
    useState("");

  const [job, setJob] =
    useState("Software Developer");

  const [result, setResult] =
    useState(null);

  const [resume, setResume] =
    useState("");

  const [detectedSkills, setDetectedSkills] =
    useState([]);

  const [jobDescription, setJobDescription] =
    useState("");

  const [requiredSkills, setRequiredSkills] =
    useState([]);


  // =========================
  // RESUME
  // =========================

  const handleResume = async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;


    const allowed = [
      ".pdf",
      ".docx"
    ];


    const valid =
      allowed.some(
        ext =>
          file.name
            .toLowerCase()
            .endsWith(ext)
      );


    if (!valid) {

      alert(
        "Please upload PDF or DOCX file"
      );

      return;
    }


    setResume(file.name);


    try {

      const data =
        await uploadResume(file);


      setDetectedSkills(
        data.skills || []
      );


      setUserSkills(
        (data.skills || [])
          .join(", ")
      );


    } catch (error) {

      console.error(error);

      alert(
        "Resume upload failed"
      );

    }

  };


  // =========================
  // JOB DESCRIPTION
  // =========================

  const analyzeJobDescription =
    async () => {

      if (!jobDescription.trim()) {

        alert(
          "Please enter a job description"
        );

        return;
      }


      try {

        const response =
          await fetch(
            "http://127.0.0.1:8000/analyze-job",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                job_description:
                  jobDescription
              })

            }
          );


        const data =
          await response.json();


        setRequiredSkills(
          data.required_skills || []
        );


      } catch (error) {

        console.error(error);

        alert(
          "Job analysis failed"
        );

      }

    };


  // =========================
  // ANALYZE
  // =========================

  const analyze = async () => {

    const user =
      userSkills
        .split(",")
        .map(
          skill => skill.trim()
        )
        .filter(Boolean);


    const required =
      requiredSkills.length > 0
        ? requiredSkills
        : jobs[job];


    if (user.length === 0) {

      alert(
        "Please upload a resume or enter your skills"
      );

      return;
    }


    try {

      const data =
        await analyzeSkills(
          user,
          required
        );


      setResult(data);


    } catch (error) {

      console.error(error);

      alert(
        "Analysis failed"
      );

    }

  };


  return (

    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "Arial"
      }}
    >

      <h1>
        SkillGap AI
      </h1>


      <p>
        AI-Powered Career Skill Gap Analyzer
      </p>


      {/* =========================
          RESUME
      ========================= */}

      <h3>
        Upload Resume
      </h3>


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


      {/* =========================
          DETECTED SKILLS
      ========================= */}

      {detectedSkills.length > 0 && (

        <div>

          <h3>
            Detected Skills
          </h3>


          {detectedSkills.map(
            skill => (

              <span
                key={skill}
                style={{
                  display:
                    "inline-block",

                  padding:
                    "8px 12px",

                  margin:
                    "5px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "20px"
                }}
              >
                {skill}
              </span>

            )
          )}

        </div>

      )}


      {/* =========================
          USER SKILLS
      ========================= */}

      <h3>
        Your Skills
      </h3>


      <input
        type="text"
        placeholder="Python, SQL, Git"
        value={userSkills}
        onChange={
          e =>
            setUserSkills(
              e.target.value
            )
        }
        style={{
          width: "100%",
          padding: "12px",
          boxSizing: "border-box"
        }}
      />


      {/* =========================
          JOB
      ========================= */}

      <h3>
        Target Job
      </h3>


      <select
        value={job}
        onChange={
          e =>
            setJob(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px"
        }}
      >

        {Object.keys(jobs).map(
          jobName => (

            <option
              key={jobName}
              value={jobName}
            >
              {jobName}
            </option>

          )
        )}

      </select>


      {/* =========================
          JOB DESCRIPTION
      ========================= */}

      <h3>
        Job Description
      </h3>


      <textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={
          e =>
            setJobDescription(
              e.target.value
            )
        }
        style={{
          width: "100%",
          minHeight: "150px",
          padding: "12px",
          boxSizing: "border-box"
        }}
      />


      <br />
      <br />


      <button
        onClick={
          analyzeJobDescription
        }
      >
        Extract Required Skills
      </button>


      {/* =========================
          REQUIRED SKILLS
      ========================= */}

      {requiredSkills.length > 0 && (

        <div>

          <h3>
            Required Skills
          </h3>


          {requiredSkills.map(
            skill => (

              <span
                key={skill}
                style={{
                  display:
                    "inline-block",

                  padding:
                    "8px 12px",

                  margin:
                    "5px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "20px"
                }}
              >
                {skill}
              </span>

            )
          )}

        </div>

      )}


      <br />
      <br />


      <button
        onClick={analyze}
      >
        Analyze Skill Gap
      </button>


      {/* =========================
          RESULT
      ========================= */}

      {result && (

        <div>

          <div
  style={{
    marginTop: "25px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px"
  }}
>
  <h2>
    Skill Match: {result.match_percentage}%
  </h2>

  <div
    style={{
      width: "100%",
      height: "20px",
      background: "#e5e7eb",
      borderRadius: "10px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${result.match_percentage}%`,
        height: "100%",
        background: "#2563eb",
        borderRadius: "10px"
      }}
    />
  </div>

  <p>
    You match {result.match_percentage}% of the
    required skills for this role.
  </p>
</div>

<div
  style={{
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px"
  }}
>
  <h2>Career Readiness</h2>

  <h1>
    {result.match_percentage}%
  </h1>

  <div
  style={{
    width: "100%",
    height: "14px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "15px"
  }}
>
  <div
    style={{
      width: `${result.match_percentage}%`,
      height: "100%",
      background: "#2563eb",
      borderRadius: "10px"
    }}
  />
</div>

  <p>
    Your current skills match {result.match_percentage}% of the
    required skills for this role.
  </p>
</div>

          {/* SUMMARY */}

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              border:
                "1px solid #ddd",
              borderRadius: "12px"
            }}
          >
            <div
  style={{
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px"
  }}
>
  <h2>Skill Priority Summary</h2>

  <div
    style={{
      display: "flex",
      gap: "15px",
      flexWrap: "wrap"
    }}
  >
    {["Critical", "High", "Medium", "Low"].map(priority => (
      <div
        key={priority}
        style={{
          flex: 1,
          minWidth: "120px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          textAlign: "center"
        }}
      >
        <h3>{priority}</h3>

        <h2>
          {
            result.roadmap.filter(
              item => item.priority === priority
            ).length
          }
        </h2>

        <p>Missing skills</p>
      </div>
    ))}
  </div>
</div>

            <h3>
              Skill Gap Summary
            </h3>


            <p>
              <b>
                Total Required Skills:
              </b>{" "}
              {
                result.matched.length +
                result.missing.length
              }
            </p>


            <p>
              <b>
                Skills You Have:
              </b>{" "}
              {result.matched.length}
            </p>


            <p>
              <b>
                Skills to Learn:
              </b>{" "}
              {result.missing.length}
            </p>


            <p>
              <b>
                Match Percentage:
              </b>{" "}
              {result.match_percentage}%
            </p>

          </div>


          {/* MATCHED */}

          <h3>
            Matched Skills
          </h3>


          {result.matched.map(
            skill => (

              <p key={skill}>
                ✓ {skill}
              </p>

            )
          )}
          const [searchSkill, setSearchSkill] = useState("");


          {/* MISSING */}

          <h3>
            Missing Skills
          </h3>
          <input
  type="text"
  placeholder="Search missing skills..."
  value={searchSkill}
  onChange={e => setSearchSkill(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  }}
/>


          {result.roadmap.map(item => (
  <div
    key={item.skill}
    style={{
      padding: "15px",
      marginTop: "10px",
      border: "1px solid #ddd",
      borderRadius: "10px"
    }}
  >
    <strong>{item.skill}</strong>

    <p>
      Priority: <b>{item.priority}</b>
    </p>

    <p>
      Next Step: Learn {item.skill} basics
    </p>
  </div>
))}

          <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap"
  }}
>
  <div
    style={{
      flex: 1,
      minWidth: "200px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px"
    }}
  >
    <h3>Matched Skills</h3>

    <h2>
      {result.matched.length}
    </h2>

    <p>
      Skills you already have
    </p>
  </div>

  <div
    style={{
      flex: 1,
      minWidth: "200px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px"
    }}
  >
    <h3>Missing Skills</h3>

    <h2>
      {result.missing.length}
    </h2>

    <p>
      Skills you need to learn
    </p>
  </div>
</div>

<div
  style={{
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px"
  }}
>
  <h2>Recommended Skills for {job}</h2>

  {result.missing.slice(0, 3).map(skill => (
    <div
      key={skill}
      style={{
        padding: "10px 0",
        borderBottom: "1px solid #eee"
      }}
    >
      <strong>{skill}</strong>
      <p style={{ margin: "5px 0" }}>
        Learn this skill to improve your readiness for this role.
      </p>
    </div>
  ))}
</div>

<div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap"
  }}
>
  <div
    style={{
      flex: 1,
      minWidth: "180px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      textAlign: "center"
    }}
  >
    <h3>Matched Skills</h3>
    <h1>{result.matched.length}</h1>
    <p>Skills you already have</p>
  </div>

  <div
    style={{
      flex: 1,
      minWidth: "180px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      textAlign: "center"
    }}
  >
    <h3>Missing Skills</h3>
    <h1>{result.missing.length}</h1>
    <p>Skills to improve</p>
  </div>

  <div
    style={{
      flex: 1,
      minWidth: "180px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      textAlign: "center"
    }}
  >
    <h3>Readiness</h3>
    <h1>{result.match_percentage}%</h1>
    <p>Current skill readiness</p>
  </div>
</div>

          {/* =========================
              LEARNING ROADMAP
          ========================= */}

          <h2>
            Learning Roadmap
          </h2>


          {result.roadmap.map(
            item => (

              <div
                key={item.skill}
                style={{
                  border:
                    "1px solid #ccc",

                  padding:
                    "15px",

                  marginTop:
                    "10px",

                  borderRadius:
                    "10px"
                }}
              >

                <h3>
                  {item.skill}
                </h3>


                <p>
  Priority:{" "}
  <span
    style={{
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "15px",
      border: "1px solid #ccc"
    }}
  >
    {item.priority}
  </span>
</p>

<p>
  {item.priority === "Critical" &&
    "🔥 Learn this skill first"}
  {item.priority === "High" &&
    "⚡ Important skill for this role"}
  {item.priority === "Medium" &&
    "📌 Recommended to improve your profile"}
  {item.priority === "Low" &&
    "💡 Useful additional skill"}
</p>

                <h4>
                  Learning Steps
                </h4>


                {item.steps.map(
                  step => (

                    <p key={step}>
                      → {step}
                    </p>

                  )
                )}


                {/* DEPENDENCY */}

                {item.dependencies &&
                  item.dependencies.length > 0 && (

                    <div>

                      <h4>
                        Skill Dependencies
                      </h4>


                      {item.dependencies.map(
                        dependency => (

                          <span
                            key={dependency}
                            style={{
                              display:
                                "inline-block",

                              padding:
                                "7px 10px",

                              margin:
                                "4px",

                              background:
                                "#f1f5f9",

                              borderRadius:
                                "15px"
                            }}
                          >
                            {dependency}
                          </span>

                        )
                      )}

                    </div>

                  )}

              </div>

            )
          )}


          {/* =========================
    SKILL DEPENDENCY GRAPH
========================= */}

<h2>
  Skill Dependency Graph
</h2>

<div
  style={{
    marginTop: "20px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px"
  }}
>
  {result.roadmap.map(item => (
    <div
      key={item.skill}
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "10px"
      }}
    >
      <strong>{item.skill}</strong>

      {item.dependencies &&
      item.dependencies.length > 0 ? (
        <div style={{ marginTop: "10px" }}>
          {item.dependencies.map(dep => (
            <span
              key={dep}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                margin: "5px",
                border: "1px solid #2563eb",
                borderRadius: "20px"
              }}
            >
              → {dep}
            </span>
          ))}
        </div>
      ) : (
        <p>No dependencies available</p>
      )}
    </div>
  ))}
</div>

        </div>

      )}

    </div>

  );

}