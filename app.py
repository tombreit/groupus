import argparse
import csv
import json
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
    df_with_headers = pd.DataFrame(0, index=students, columns=students)

    for pref in prefs:
        for_student = pref.pop(0)
        weights = list(reversed(range(11)))

        for student in pref:
            df_with_headers.at[for_student, student] = weights.pop(0)

    np_prefs_array = df_with_headers.to_records(index=False)
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
    prefs = json.loads(prefs)
    students = [pref[0] for pref in prefs]
    prefs_matrix = create_prefs_matrix(students, prefs)

    matching = Matching(
        prefs_matrix,
        group_size=int(group_size),
        iter_count=2,
        final_iter_count=2,
    )
    score, groups = matching.solve()

    named_groups = []
    for group in groups:
        named_group = [students[student_index] for student_index in group]
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