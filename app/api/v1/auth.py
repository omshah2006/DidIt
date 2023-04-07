from __main__ import app

@app.route('/test', methods=['GET', 'POST'])
def test():
    return "test"