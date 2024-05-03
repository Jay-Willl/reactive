import encodings
import time

from flask import Flask, g, request
from flask_cors import CORS


def create_app():
    app = Flask('sandevistan')
    CORS(app)
    app.config.from_object("config.Config")

    @app.before_request
    def before_request():
        """Prepare some things before the application handles a request."""
        g.request_start_time = time.time()
        g.request_time = lambda: '%.5fs' % (time.time() - g.request_start_time)
        g.pjax = 'X-PJAX' in request.headers

    @app.route('/test', methods=['GET'])
    def index():
        for header, value in request.headers.items():
            print(header + " " + value)
        """Returns the applications index page."""
        return "don't panic"

    @app.route('/upload/test', methods=['POST'])
    def upload_code():
        print(request.files)
        file = request.files['file']
        print(file)
        if file:
            file_content = file.read()
            file_name = file.filename

            print('file_name: ', file_name)
            print('file_content: ', file_content)
            # temp_frame = frame.Frame(name=file_name, code=file_content)
        return 'File uploaded successfully', 200

    return app


app = create_app()
app.run(debug=True, host='0.0.0.0', port=5174)
