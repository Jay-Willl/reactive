import encodings
import time
import hashlib
import json
from icecream import ic

from flask import Flask, g, request, jsonify
from flask_cors import CORS

CODE_BASE = './codebase/'


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
    def upload_code_test():
        print(request.files)
        file = request.files['file']
        if file:
            file_name = file.filename
            file_content = file.read()
            current = str(time.time())
            current = current.split('.')[0]
            file_tag = file_name.removesuffix('.py') + '_' + current
            processed_file_name = file_tag + '.py'
            with open(CODE_BASE + processed_file_name, 'wb') as f:
                f.write(file_content)
                f.flush()

            # print('file_name: ', file_name)
            # print('file_content: ', file_content)
            # temp_frame = frame.Frame(name=file_name, code=file_content)
        return 'File uploaded successfully', 200

    @app.route('/upload/odd', methods=['POST'])
    def upload_code_odd():
        file = request.files['file']
        if file:
            file_name = file.filename
            file_content = file.read()
            current = str(time.time())
            current = current.split('.')[0]
            file_tag = file_name.removesuffix('.py') + '_' + current_time_str
            processed_file_name = file_tag + '.py'
            with open(CODE_BASE + processed_file_name, 'wb') as f:
                f.write(file_content)
                f.flush()

        return 'Simply upload and check'

    @app.route('/upload/test_multiple', methods=['POST'])
    def upload_code_test_multiple():
        file = request.files['file']
        name = request.form['name']
        email = request.form['email']
        print(file.filename)
        print(name)
        print(email)
        return jsonify({'message': f'{name} uploaded file {file.filename} with email {email}'})

    @app.route('/upload/multiple', methods=['POST'])
    def upload_code_multiple():
        file = request.files['file']
        data = request.form['form']
        testpayload = request.form['testpayload']
        print(testpayload)
        print(data)
        print(request.form)
        return ''

    return app


app = create_app()
app.run(debug=True, host='0.0.0.0', port=5174)
