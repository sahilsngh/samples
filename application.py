from flask import Flask
import json
import requests

application = Flask(__name__)


# with open('./final.json') as f:
#   data = json.load(f)

# url = 'https://raw.githubusercontent.com/sahilsngh/samples/main/final.json'
# resp = requests.get(url)
# data = json.loads(resp.text)
# print(data)

# Access Route

# @application.route('/<variable>', methods=['GET'])
# def return_metadata(variable):
# 	# return {"new": f"file {variable}"}
# 	metadata = data[variable]
# 	return metadata

@application.route('/<variable>', methods=['GET'])
def return_on_each_call(variable):
	github_url = f'https://raw.githubusercontent.com/sahilsngh/samples/main/metadata/{variable}.json'
	response = requests.get(github_url)
	metadata = json.loads(response.text)
	return metadata


# Default Route
@application.route('/')
def index():
	return "Please use endpoint as https://xyz/||PLACEHOLDER|| \n  ---------------> replace ||PLACEHOLDER|| with the integer value ranging from 1 to 10000 for metadata"

if __name__ == '__main__':
	application.run(debug=True)
