import json
import urllib.request


primes_url = "http://www.oggtechnologies.com/api/ducatsorplat/v2/ItemPriceData.json"
missions_url = "http://www.oggtechnologies.com/api/lootr/v2/rewards.json"


def download_json(url):
    with urllib.request.urlopen(url) as req:
        data = json.loads(req.read().decode())
    return data


def write_data_as_js(file_name, data):
    with open("data/"+file_name+".js", "w") as f:
        data_str = "var " + file_name + " = "
        data_str += json.dumps(data)
        f.write(data_str)


# Download the primes
primes_json = download_json(primes_url)
primes_json = primes_json["data"]
# Download the mission
missions_json = download_json(missions_url)

# Write the primes
write_data_as_js("primesDataJson", primes_json)
# Write the missions
write_data_as_js("missionsDataJson", missions_json)
