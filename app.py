import json
import numpy as np
import pandas as pd
from flask import Flask, render_template, request
from algorithm import Matching

SEPARATOR = 80 * "-"


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.post('/calculate')
def calculate():
    message = None
    group_size = request.form['group_size']
    persons_prefs = request.form['personsPrefs']
    
    groups = get_groups(persons_prefs, group_size)

    context = {
        "groups": groups,
        "message": message,
    }
    return render_template('groups.html', context=context)


def create_prefs_matrix(prefs):
    students = [pref[0] for pref in prefs]
    print(f"{students=}")

    # students_len = len(students)
    # array = np.zeros((students_len, students_len), dtype=np.int16)          
    df_with_headers = pd.DataFrame(0, index=students, columns=students)

    for pref in prefs:
        for_student = pref.pop(0)
        weights = list(reversed(range(11)))
        print(f"Setting preferences for {for_student=}")
        for student in pref:
            print(f"{student=}")
            df_with_headers.at[for_student, student] = weights.pop(0)

    print("df_with_headers:")
    print(df_with_headers)

    np_prefs_array = df_with_headers.to_records(index=False)
    print("np_prefs_array:")
    print(np_prefs_array)

    return np_prefs_array


def get_groups(prefs, group_size):
    prefs = json.loads(prefs)
    print(f"{prefs=}")
    print(f"{group_size=}")
    
    prefs_matrix = create_prefs_matrix(prefs)

    matching = Matching(
        prefs_matrix,
        group_size=int(group_size),
        iter_count=2,
        final_iter_count=2,
    )
    score, groups = matching.solve()

    print(f"{groups=}")

    return {
        "groups": groups,
        "score": score,
    }
