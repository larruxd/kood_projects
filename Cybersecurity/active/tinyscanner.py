import argparse
import socket
import ipaddress
from concurrent.futures import ThreadPoolExecutor
import socket
import sys


def main():
    parser = argparse.ArgumentParser(description="Tiny scanner", usage="tinyscanner.py [OPTIONS] [HOST] [PORT]")
    parser.add_argument("-t", dest="tcp", help="TCP scan", type=str)
    parser.add_argument("-u", dest="udp", help="UDP scan", type=str)
    parser.add_argument("-p", dest="port", help="Range of ports to scan", type=str)

    args = parser.parse_args()

    if args.tcp:
        if args.port:
            scan_port(args.tcp, args.port, "tcp")
        else:
            parser.print_help()
    elif args.udp:
        if args.port:
            scan_port(args.udp, args.port, "udp")
        else:
            parser.print_help()
    else:
        parser.print_help()


def scan_port(target_ip, port, protocol):

    # validate or get ip
    target_ip = validate_or_resolve_host(target_ip)

    # Todo: port range validation 0-65535
    if port_validation(port):
        print("Invalid port or port range")
        exit(1)

    # check if port is a range
    if "-" in port:
        port_range = port.split("-")
        try:
            start_port = int(port_range[0])
            end_port = int(port_range[1])
            with ThreadPoolExecutor(max_workers=10) as executor:  # Limiting to 10 concurrent threads
                for p in range(start_port, end_port + 1):
                    executor.submit(check_port, target_ip, p, protocol)
        except ValueError:
            print("Invalid port range")
    else:
        try:
            check_port(target_ip, int(port), protocol)
        except ValueError:
            print("Invalid port number")


def check_port(target_ip, port, protocol):
    if protocol == "tcp":
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        service_name = get_service_name(port)
        try:
            s.connect((target_ip, port))
            print(f"Port {port} is open - [{service_name if service_name else 'Unknown'}]")
        except socket.error:
            print(f"Port {port} is closed - [{service_name if service_name else 'Unknown'}]")
        finally:
            s.close()
    elif protocol == "udp":
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(1)
        service_name = get_service_name(port)
        try:
            s.sendto(b"", (target_ip, port))
            print(f"Port {port} is open/filtered - [{service_name if service_name else 'Unknown'}]")
        except:
            print(f"Port {port} is closed - [{service_name if service_name else 'Unknown'}]")
        finally:
            s.close()


def get_service_name(port):
    try:
        service_name = socket.getservbyport(port)
        return service_name
    except:
        return None


def validate_or_resolve_host(ip):
    try:
        ipaddress.ip_address(ip)
        return ip
    except ValueError:
        try:
            resolved_ip = socket.gethostbyname(ip)
            return resolved_ip
        except socket.gaierror:
            print("Error: Invalid IP or hostname")
            sys.exit(0)


def port_validation(port):
    try:
        if "-" in port:
            port_range = port.split("-")
            if int(port_range[0]) > int(port_range[1]):
                return 1
            if int(port_range[0]) < 0 or int(port_range[1]) > 65535:
                return 1
        else:
            if int(port) < 0 or int(port) > 65535:
                return 1
    except ValueError:
        return 1

    return 0


if __name__ == "__main__":
    main()
