import requests
from bs4 import BeautifulSoup


def username_search(username: str):
    print("Searching with username...")

    if username[0] == "@":
        username = username[1:]

    results = [
        "Result for username: " + username,
        "Facebook: " + facebook_search(username),
        "Reddit: " + reddit_search(username),
        "Youtube: " + youtube_search(username),
        "Instagram: " + instagram_search(username),
        "Github: " + github_search(username),
    ]

    return results


def reddit_search(username: str):
    url = f"https://old.reddit.com/u/{username}"
    r = requests.get(url)

    if r.status_code != 200:
        return "No"
    else:
        if "page not found" in r.text.lower():
            return "No"

    return "Yes"


def youtube_search(username: str):
    url = f"https://www.youtube.com/@{username}"
    r = requests.get(url)
    if r.status_code == 404:
        return "No"
    return "Yes"


def instagram_search(username: str):
    url = f"https://www.instagram.com/{username}"
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    if username in soup.text:
        return "Yes"
    return "No"


def github_search(username: str):
    url = f"https://www.github.com/{username}"
    r = requests.get(url)
    if r.status_code == 404:
        return "No"
    return "Yes"


def facebook_search(username: str):
    url = f"https://www.facebook.com/{username}"
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")

    meta_element = soup.find("meta", {"property": "og:url"})

    if meta_element:
        if username.lower() in meta_element["content"].lower():
            return "Yes"

    return "No"
