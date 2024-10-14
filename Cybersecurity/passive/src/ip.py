import requests


def ip_search(ip_address: str):
    print(f"Searching with ip address {ip_address}...")

    # ip_address = get_ip()
    response = requests.get(f"https://ipinfo.io/{ip_address}/json")

    if response.status_code != 200:
        print(f"Error: {data['reason']}")
        return

    data = response.json()

    if "bogon" in data:
        print("Info: bogon IP address detected, using public IP address...")
        response = requests.get("https://ipinfo.io/json")

        if response.status_code != 200:
            print(f"Error: {data['reason']}")
            return

        data = response.json()

    location_data = [
        f"IP: {data['ip']}",
        f"ISP: {data['org']}",
        f"City: {data['city']}",
        f"Region: {data['region']}",
        f"Country: {data['country']}",
        f"Location: {data['loc']}",
    ]

    return location_data
