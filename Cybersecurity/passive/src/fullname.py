import requests
from bs4 import BeautifulSoup
import json


def full_name_search(full_name: str):
    print(f"Searching with full name: {full_name}...")

    if " " not in full_name:
        print("Error: Need both first and last name to search with full-name")
        return

    if len(full_name.split(" ")) > 2:
        print("Error: Only two names are allowed")
        return

    first_name = full_name.split(" ")[0]
    last_name = full_name.split(" ")[1]

    url = (
        f"https://www.whitepages.be/Search/Person/?what={first_name}+{last_name}&where="
    )

    response = requests.get(url)

    result_list = []

    if response.status_code == 200:
        # parse the html
        soup = BeautifulSoup(response.text, "html.parser")
        # get div for each result
        names = soup.find_all("div", class_="wg-results-list__item")

        # loop through each result
        for name in names:
            # get the data attribute
            data_small_result = name.get("data-small-result")
            # convert to json
            data = json.loads(data_small_result)

            # check if the title is the same as the full name
            if data["title"].lower() == full_name.lower():

                # get the address
                address = name.find("span", class_="wg-address").text.strip()
                data["address"] = address

                # Create new array with all needed data
                result = [
                    f"First name: {data['title'].split(' ')[0]}",
                    f"Last name: {data['title'].split(' ')[1]}",
                    f"Address: {address.split(',')[0]}",
                    f"{address.split(',')[1].strip()}",
                    f"Number: {data['phone']}",
                ]

                # Append to the result list
                result_list.append(result)

    return result_list
