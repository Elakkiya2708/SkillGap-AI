import { useEffect, useState } from "react";


export default function History() {

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================
  // LOAD HISTORY
  // =========================

  const loadHistory = async () => {

    setLoading(true);

    setError("");


    try {

      const controller =
        new AbortController();


      const timeout =
        setTimeout(
          () => controller.abort(),
          5000
        );


      const response =
        await fetch(
          "http://127.0.0.1:8000/history",
          {
            method: "GET",
            signal:
              controller.signal
          }
        );


      clearTimeout(timeout);


      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "History:",
        data
      );


      if (Array.isArray(data)) {

        setHistory(data);

      } else {

        setHistory([]);

      }


    } catch (err) {

      console.error(
        "History error:",
        err
      );


      setError(
        "Unable to load history. Make sure backend is running."
      );


      setHistory([]);


    } finally {

      setLoading(false);

    }

  };


  // =========================
  // LOAD ON PAGE OPEN
  // =========================

  useEffect(() => {

    loadHistory();

  }, []);


  // =========================
  // DELETE ONE
  // =========================

  const deleteItem = async (id) => {

    try {

      const response =
        await fetch(
          `http://127.0.0.1:8000/history/${id}`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Delete failed"
        );

      }


      await loadHistory();


    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete history"
      );

    }

  };


  // =========================
  // CLEAR ALL
  // =========================

  const clearHistory = async () => {

    if (
      !window.confirm(
        "Delete all analysis history?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(
          "http://127.0.0.1:8000/history",
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Clear history failed"
        );

      }


      setHistory([]);


    } catch (err) {

      console.error(err);

      alert(
        "Failed to clear history"
      );

    }

  };


  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "40px",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <h1>
        Analysis History
      </h1>


      <p>
        View your previous skill gap analyses
      </p>


      {/* LOADING */}

      {loading && (

        <div
          style={{
            padding: "30px",
            textAlign: "center"
          }}
        >

          <h3>
            Loading history...
          </h3>

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div
          style={{
            padding: "20px",
            border:
              "1px solid #ef4444",
            borderRadius: "10px"
          }}
        >

          <p>
            {error}
          </p>


          <button
            onClick={loadHistory}
            style={{
              padding:
                "10px 16px",
              cursor:
                "pointer"
            }}
          >
            Retry
          </button>

        </div>

      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        history.length === 0 && (

          <div
            style={{
              padding: "30px",
              border:
                "1px solid #ddd",
              borderRadius: "12px",
              textAlign:
                "center"
            }}
          >

            <h2>
              No Analysis History
            </h2>

            <p>
              Complete a skill gap
              analysis to see it here.
            </p>

          </div>

        )}


      {/* HISTORY */}

      {!loading &&
        !error &&
        history.length > 0 && (

          <>

            <button
              onClick={clearHistory}
              style={{
                padding:
                  "10px 16px",
                marginBottom:
                  "20px",
                cursor:
                  "pointer"
              }}
            >
              🗑 Clear All History
            </button>


            {history.map(item => (

              <div
                key={item.id}
                style={{
                  padding: "20px",
                  marginBottom: "15px",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "12px",
                  background:
                    "#ffffff"
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center"
                  }}
                >

                  <h2>
                    {item.job}
                  </h2>


                  <button
                    onClick={() =>
                      deleteItem(
                        item.id
                      )
                    }
                    style={{
                      padding:
                        "8px 12px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Delete
                  </button>

                </div>


                <h3>
                  Skill Match:
                  {" "}
                  {item.match_percentage}%
                </h3>


                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background:
                      "#e5e7eb",
                    borderRadius:
                      "10px",
                    overflow:
                      "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${item.match_percentage}%`,
                      height: "100%",
                      background:
                        "#2563eb"
                    }}
                  />

                </div>


                <p>
                  <b>
                    Date:
                  </b>{" "}
                  {item.created_at}
                </p>


                <p>
                  <b>
                    Matched Skills:
                  </b>{" "}
                  {item.matched?.length || 0}
                </p>


                <p>
                  <b>
                    Missing Skills:
                  </b>{" "}
                  {item.missing?.length || 0}
                </p>


                {item.matched?.length > 0 && (

                  <p>

                    <b>
                      Matched:
                    </b>{" "}

                    {item.matched.join(
                      ", "
                    )}

                  </p>

                )}


                {item.missing?.length > 0 && (

                  <p>

                    <b>
                      Missing:
                    </b>{" "}

                    {item.missing.join(
                      ", "
                    )}

                  </p>

                )}

              </div>

            ))}

          </>

        )}

    </div>

  );

}