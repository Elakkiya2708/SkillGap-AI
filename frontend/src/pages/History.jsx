import { useEffect, useState } from "react";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadHistory = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/history"
      );

      const data = await response.json();

      setHistory(data);

    } catch (error) {

      console.error(error);

      alert("Failed to load history");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadHistory();

  }, []);


  const deleteItem = async (id) => {

    try {

      await fetch(
        `http://127.0.0.1:8000/history/${id}`,
        {
          method: "DELETE"
        }
      );

      loadHistory();

    } catch (error) {

      console.error(error);

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

      loadHistory();

    } catch (error) {

      console.error(error);

      alert("Failed to clear history");

    }

  };


  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >

      <h1>
        Analysis History
      </h1>


      <p>
        View your previous skill gap analyses
      </p>


      {loading && (

        <p>
          Loading history...
        </p>

      )}


      {!loading &&
        history.length === 0 && (

          <div
            style={{
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

        )}


      {!loading &&
        history.length > 0 && (

          <>

            <button
              onClick={clearHistory}
              style={{
                padding: "10px 16px",
                marginBottom: "20px",
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
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "12px"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center"
                  }}
                >

                  <h2>
                    {item.job}
                  </h2>


                  <button
                    onClick={() =>
                      deleteItem(item.id)
                    }
                    style={{
                      padding:
                        "8px 12px",
                      cursor: "pointer"
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
                    background: "#e5e7eb",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${item.match_percentage}%`,
                      height: "100%",
                      background: "#2563eb"
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

                  <div>

                    <b>
                      Matched:
                    </b>

                    <p>
                      {item.matched.join(
                        ", "
                      )}
                    </p>

                  </div>

                )}


                {item.missing?.length > 0 && (

                  <div>

                    <b>
                      Missing:
                    </b>

                    <p>
                      {item.missing.join(
                        ", "
                      )}
                    </p>

                  </div>

                )}

              </div>

            ))}

          </>

        )}

    </div>

  );

}