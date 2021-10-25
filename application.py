import json
import requests
from flask import Flask, send_from_directory

application = Flask(__name__)

@application.route('/<variable>', methods=['GET'])
def return_on_each_call(variable):
	github_url = f'https://raw.githubusercontent.com/sahilsngh/samples/main/metadata/{variable}.json'
	response = requests.get(github_url)
	metadata = json.loads(response.text)
	return metadata

@application.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(application.static_folder, 'favicon.ico')
    # return send_from_directory(os.path.join(application.root_path, 'static'), 'favicon.ico')



# Default Route
@application.route('/')
def index():
	return "Please use endpoint as https://xyz/||PLACEHOLDER|| \n  ---------------> replace ||PLACEHOLDER|| with the integer value ranging from 1 to 10000 for metadata"

if __name__ == '__main__':
	application.run(debug=True)
