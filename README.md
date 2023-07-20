# groupus

Generates balanced groups from a set of individuals while attempting to maximize the satisfaction of weighted preferences (friendship) among them.

Basically a web based interface for *Stable Roommate Generalised* by *[Anjay Goel](anjaygoel.github.io)*.

*Definitely a ROTS\* project*

## 🛝 Demo instance

https://groupus.fly.dev/

Enter some comma-separated names (don't forget the comma after the last name), set the desired size of the resulting groups/clusters, drag the names to the preference fields and click "Create groups". 

The maximum score for friendship preferences is 10.0. 

Groups can be regenerated, often resulting in different compositions and different scores.

Hosted on/by [fly.io](https://fly.io/)

## 🦘 Setup

```bash
(venv) pip install -r requirements.txt
(venv) flask run --debug
```

Static assets for production are currently included in the repo. To regenerate these files:

```bash
npm run build
# or
npm run watch
```

## 👏 Thanks

I can't thank the people enough who make my work possible through their awesome and free ("free" as in "free speech") software and free projects. 

My special thanks go to:

* [Anjay Goel/Owner avatar
Stable-Roommate-Generalised](https://github.com/AnjayGoel/Stable-Roommate-Generalised)
* [htmx](https://htmx.org/)
* [Flask](https://flask.palletsprojects.com/)
* [Bootstrap](https://getbootstrap.com/)
* ...and countless other (see `requirements.txt` and `packages.json`)

## ☄ Need help?

Please fill an issue or contact [Thomas Breitner via his website](https://thms.de/).

---

**\*** **R**idiculous **O**verengineered **T**echnology **S**tack
