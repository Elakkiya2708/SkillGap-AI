import { useEffect, useState } from "react";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    fetch("http://127.0.0.1:8000/history")
      .then(response => {

        if (!response.ok) {
          throw new Error("Server error");
        }

        return response.json();
      })

      .then(data => {

        console.log("History:", data);

        setHistory(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })

      .catch(err => {

        console.error("History error:", err);

        setError(
          "Unable to load history. Please check backend."
        );

        setLoading(false);
      });

  }, []);

  const deleteHistory = async (id) => {

    try {

      await fetch(
        `http://127.0.0.1:8000/history/${id}`,
        {
          method: "DELETE"
        }
      );

      setHistory(
        history.filter(item => item.id !== id)
      );

    } catch (error) {

      alert("Delete failed");

    }
  };


  const clearHistory = async () => {

    if (
      !window.confirm(
        "Delete all analysis history?"
      )
    ) {
      return;
    }

    try {

      await fetch(
        "http://127.0.0.1:8000/history",
        {
          method: "DELETE"
        }
      );

      setHistory([]);

    } catch (error) {

      alert("Clear history failed");

    }
  };


  if (loading) {

    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "50px",
          textAlign: "center"
        }}
      >

        <h1>Analysis History</h1>

        <p>
          View your previous skill gap analyses
        </p>

        <h3>
          Loading history...
        </h3>

      </div>
    );
  }


  if (error) {

    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "50px",
          textAlign: "center"
        }}
      >

        <h1>Analysis History</h1>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>

      </div>
    );
  }


  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "40px"
      }}
    >

      <h1>
        Analysis History
      </h1>

      <p>
        View your previous skill gap analyses
      </p>


      {history.length === 0 ? (

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
            Complete a skill gap analysis
            to see it here.
          </p>

        </div>

      ) : (

        <>

          <button
            onClick={clearHistory}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              padding: "10px 18px",
              cursor: "pointer"
            }}
          >
            🗑 Clear All History
          </button>


          {history.map(item => (

            <div
              key={item.id}
              style={{
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                background: "#fff"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <h2>
                  {item.job}
                </h2>

                <button
                  onClick={() =>
                    deleteHistory(item.id)
                  }
                  style={{
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>

              </div>


              <h3>
                Skill Match: {item.match_percentage}%
              </h3>


              <div
                style={{
                  width: "100%",
                  height: "12px",
                  background: "#e5e7eb",
                  borderRadius: "10px"
                }}
              >

                <div
                  style={{
                    width:
                      `${item.match_percentage}%`,
                    height: "100%",
                    background: "#2563eb",
                    borderRadius: "10px"
                  }}
                />

              </div>


              <p>
                <b>Date:</b> {item.created_at}
              </p>


              <p>
                <b>Matched Skills:</b>{" "}
                {item.matched
                  ? item.matched.join(", ")
                  : "None"}
              </p>


              <p>
                <b>Missing Skills:</b>{" "}
                {item.missing
                  ? item.missing.join(", ")
                  : "None"}
              </p>

            </div>

          ))}

        </>

      )}

    </div>

  );
}