import argparse
import sys
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


def main():
    parser = argparse.ArgumentParser(description="Inspector image")
    parser.add_argument("-m", "--map", help="Search with full name", type=str)
    parser.add_argument("-s", "--steg", help="Search with ip address", type=str)
    args = parser.parse_args()

    if args.map:
        location = get_gps_info(args.map)
        if location:
            print(location)
        else:
            print("No GPS data found")
    elif args.steg:
        key = get_key(args.steg)
        if key:
            print(key)
        else:
            print("No PGP public key found")
    else:
        parser.print_help()


def get_gps_info(path):
    try:
        image = Image.open(path)
        exifdata = image._getexif()
        if exifdata is None:
            return "Error: No EXIF data found in the image."

        for tag_id in exifdata:
            tag = TAGS.get(tag_id, tag_id)
            data = exifdata.get(tag_id)

            if tag == "GPSInfo":
                # get the tag name, instead of human unreadable tag id
                gps_data = {}

                for gps_tag in data:
                    gps_tag_name = GPSTAGS.get(gps_tag, gps_tag)
                    gps_data[gps_tag_name] = data[gps_tag]

                latitude = dms_to_decimal(
                    gps_data["GPSLatitude"][0],
                    gps_data["GPSLatitude"][1],
                    gps_data["GPSLatitude"][2],
                )
                longitude = dms_to_decimal(
                    gps_data["GPSLongitude"][0],
                    gps_data["GPSLongitude"][1],
                    gps_data["GPSLongitude"][2],
                )
                return f"Lat/Lon:    ({round(latitude, 6)}) / ({round(longitude, 6)})"

        return "No GPS data found"

    except Exception as e:
        return "An error occurred while retrieving GPS data: " + str(e)


# function to get pgp public key from image stenography
def get_key(path):
    output = ""
    with open(path, "rb") as file:
        inside_key_block = False
        for line in file:

            decoded_line = line.decode("utf-8", errors="ignore")

            if "-----END PGP PUBLIC KEY BLOCK-----" in decoded_line:
                output += "-----END PGP PUBLIC KEY BLOCK-----"
                inside_key_block = False
            if inside_key_block:
                output += decoded_line
            if "-----BEGIN PGP PUBLIC KEY BLOCK-----" in decoded_line:
                inside_key_block = True
                output += "-----BEGIN PGP PUBLIC KEY BLOCK-----\n"

    return output


def dms_to_decimal(degrees, minutes, seconds):
    decimal = float(degrees) + (float(minutes) / 60) + (float(seconds) / 3600)

    return decimal


if __name__ == "__main__":
    main()
