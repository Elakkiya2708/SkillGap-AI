import { useEffect, useState } from "react";

function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {

    fetch("http://127.0.0.1:8000/history")
      .then(response => response.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

  };

  useEffect(() => {
    loadHistory();
  }, []);


  const deleteHistory = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this analysis?"
    );

    if (!confirmDelete) return;

    await fetch(
      `http://127.0.0.1:8000/history/${id}`,
      {
        method: "DELETE"
      }
    );

    loadHistory();
  };


  const clearHistory = async () => {

    const confirmDelete = window.confirm(
      "Delete all analysis history?"
    );

    if (!confirmDelete) return;

    await fetch(
      "http://127.0.0.1:8000/history",
      {
        method: "DELETE"
      }
    );

    loadHistory();
  };


  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <div>

          <h1>
            Analysis History
          </h1>

          <p>
            View your previous skill gap analyses
          </p>

        </div>


        {history.length > 0 && (

          <button
            onClick={clearHistory}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Clear All History
          </button>

        )}

      </div>


      {loading && (
        <p>Loading history...</p>
      )}


      {!loading && history.length === 0 && (

        <div
          style={{
            marginTop: "30px",
            padding: "30px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            textAlign: "center"
          }}
        >

          <h2>
            No Analysis History
          </h2>

          <p>
            Analyze a job to create your first history record.
          </p>

        </div>

      )}


      {history.map(item => (

        <div
          key={item.id}
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >

            <div>

              <h2>
                {item.job}
              </h2>

              <p>
                {item.created_at}
              </p>

            </div>


            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold"
              }}
            >
              {item.match_percentage}%
            </div>

          </div>


          <hr />


          <h3>
            Matched Skills
          </h3>


          {item.matched.length > 0 ? (

            <div>

              {item.matched.map(skill => (

                <span
                  key={skill}
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    margin: "5px",
                    border: "1px solid #22c55e",
                    borderRadius: "20px"
                  }}
                >
                  {skill}
                </span>

              ))}

            </div>

          ) : (

            <p>
              No matched skills
            </p>

          )}


          <h3
            style={{
              marginTop: "20px"
            }}
          >
            Missing Skills
          </h3>


          {item.missing.length > 0 ? (

            <div>

              {item.missing.map(skill => (

                <span
                  key={skill}
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    margin: "5px",
                    border: "1px solid #ef4444",
                    borderRadius: "20px"
                  }}
                >
                  {skill}
                </span>

              ))}

            </div>

          ) : (

            <p>
              No missing skills
            </p>

          )}


          <button
            onClick={() => deleteHistory(item.id)}
            style={{
              marginTop: "20px",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default History;