import sqlite3
from datetime import datetime


DB = "skillgap.db"


def init_db():

    conn = sqlite3.connect(DB)

    cursor = conn.cursor()


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job TEXT,
            match_percentage REAL,
            matched TEXT,
            missing TEXT,
            created_at TEXT
        )
    """)


    conn.commit()

    conn.close()


def save_analysis(
    job,
    match_percentage,
    matched,
    missing
):

    conn = sqlite3.connect(DB)

    cursor = conn.cursor()


    cursor.execute("""
        INSERT INTO analysis_history
        (
            job,
            match_percentage,
            matched,
            missing,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
    """, (

        job,

        match_percentage,

        ",".join(matched),

        ",".join(missing),

        datetime.now().strftime(
            "%d-%m-%Y %H:%M"
        )

    ))


    conn.commit()

    conn.close()


def get_history():

    conn = sqlite3.connect(DB)

    cursor = conn.cursor()


    cursor.execute("""
        SELECT
            id,
            job,
            match_percentage,
            matched,
            missing,
            created_at
        FROM analysis_history
        ORDER BY id DESC
    """)


    rows = cursor.fetchall()


    conn.close()


    history = []


    for row in rows:

        history.append({

            "id": row[0],

            "job": row[1],

            "match_percentage":
                row[2],

            "matched":
                row[3].split(",")
                if row[3]
                else [],

            "missing":
                row[4].split(",")
                if row[4]
                else [],

            "created_at":
                row[5]

        })


    return history


def delete_analysis(
    analysis_id
):

    conn = sqlite3.connect(DB)

    cursor = conn.cursor()


    cursor.execute(
        """
        DELETE FROM analysis_history
        WHERE id = ?
        """,
        (analysis_id,)
    )


    deleted = cursor.rowcount > 0


    conn.commit()

    conn.close()


    return deleted


def clear_history():

    conn = sqlite3.connect(DB)

    cursor = conn.cursor()


    cursor.execute(
        "DELETE FROM analysis_history"
    )


    conn.commit()

    conn.close()