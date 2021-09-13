# app.py
import flask
import os
app = flask.Flask(__name__)
#TV show list
tv_shows = ["Code Geass", "Supernatural","Lucifer","Evil","Legion"]
@app.route('/')
def index():
    print
    return flask.render_template("index.html",len = len(tv_shows), tv_shows = tv_shows)
app.run(
       debug=True , use_reloader = True
        )