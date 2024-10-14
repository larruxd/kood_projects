import sys
import argparse
from src.fullname import full_name_search
from src.ip import ip_search
from src.username import username_search
import os


def main():
    parser = argparse.ArgumentParser(description="Passive Reconnaissance Tool")
    parser.add_argument("-fn", "--full-name", help="Search with full name", type=str)
    parser.add_argument("-ip", "--ip-address", help="Search with ip address", type=str)
    parser.add_argument("-u", "--username", help="Search with username", type=str)
    args = parser.parse_args()

    result = []

    if args.full_name:
        result = full_name_search(args.full_name)
    elif args.ip_address:
        result = ip_search(args.ip_address)
    elif args.username:
        result = username_search(args.username)
    else:
        print("Error: No arguments provided")
        sys.exit(1)

    if result:
        write_to_file(result)
    else:
        print("No results found")


def write_to_file(results):
    directory = "results"
    if not os.path.exists(directory):
        os.makedirs(directory)
    index = 0
    while True:
        file_name = os.path.join(directory, f"result{index}.txt")
        if not os.path.exists(file_name):
            break
        index += 1
    with open(file_name, "w") as file:

        if isinstance(results[0], list):
            for index, item in enumerate(results):
                file.write(f"Result {index}:\n")
                for sub_item in item:
                    file.write(str(sub_item) + "\n")
                file.write("\n")
        else:
            for item in results:
                file.write(str(item) + "\n")

    print(f"Results written to {file_name}")


if __name__ == "__main__":
    main()
