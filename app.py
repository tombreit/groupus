import argparse
import csv
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


def create_prefs_matrix(students, prefs):
    # print("prefs:")
    # print(prefs)

    # students_len = len(students)
    # array = np.zeros((students_len, students_len), dtype=np.int16)          
    df_with_headers = pd.DataFrame(0, index=students, columns=students)

    for pref in prefs:
        for_student = pref.pop(0)
        weights = list(reversed(range(11)))
        # print(f"Setting preferences for {for_student=}")
        for student in pref:
            # print(f"{student=}")
            df_with_headers.at[for_student, student] = weights.pop(0)

    # print("df_with_headers:")
    # print(df_with_headers)
    # print(type(df_with_headers))

    np_prefs_array = df_with_headers.to_records(index=False)
    # print("np_prefs_array:")
    # print(np_prefs_array)

    return np_prefs_array


def get_groups_from_csv(csvfile, group_size):
    prefs = []
    with open(csvfile, encoding="utf-8") as csvfile_obj:
        csv_reader = csv.reader(csvfile_obj)
        for row in csv_reader:
            prefs.append(row)

    prefs_as_str = str(prefs)
    prefs_replaced = prefs_as_str.replace(" ", "")
    prefs_replaced = prefs_as_str.replace("\'", "\"")
    
    return get_groups(prefs_replaced, group_size)


def get_groups(prefs, group_size):
    print(f"{prefs=}")
    print(f"{type(prefs)=}")

    prefs = json.loads(prefs)
    # print(f"{group_size=}")

    students = [pref[0] for pref in prefs]
    prefs_matrix = create_prefs_matrix(students, prefs)
    # print("prefs_matrix: ")
    # print(prefs_matrix)

    matching = Matching(
        prefs_matrix,
        group_size=int(group_size),
        iter_count=2,
        final_iter_count=2,
    )
    score, groups = matching.solve()

    # print(f"{groups=}")
    # print(f"{prefs=}")
    named_groups = []

    for group in groups:
        named_group = [students[student_index] for student_index in group]
        print(f"{named_group=}")
        named_groups.append(named_group)

    return {
        "named_groups": named_groups,
        "score": score,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Partition in balanced groups while preserving preferences among each other',)
    parser.add_argument('csvfile')
    parser.add_argument('group_size', type=int)
    args = parser.parse_args()
    get_groups_from_csv(args.csvfile, args.group_size)