import json
from pandas import read_json
df = read_json('./genetic-hello-world-results.json')
corr = df.corr()

with open('./corr-matrix.json', 'w') as file:
  jsonified = corr.to_json()
  stringified = json.dumps(json.loads(jsonified), indent=2)
  file.write(stringified)
