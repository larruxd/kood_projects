import argparse
import os 
import sys
import pefile

def align_values(val_to_align, alingment):
    return ((val_to_align + alingment - 1) / alingment) * alingment


def injector(target_file, inject_file):
    print("Injecting {} into {}".format(inject_file, target_file))
    name            = ".axc"
    virtual_size    = 0x1000 		# 4096 octets
    raw_size        = 0x1000		# 4096 octets
    characteristics = 0xE0000020 	# READ | WRITE | EXECUTE | CODE | INITIALIZED_DATA

    pe = pefile.PE(target_file)
    number_of_sections = pe.FILE_HEADER.NumberOfSections
    last_section = number_of_sections - 1
    file_alignment = pe.OPTIONAL_HEADER.FileAlignment
    section_alignment = pe.OPTIONAL_HEADER.SectionAlignment

    raw_size = align_values(0x1000, file_alignment)
    virtual_size = align_values(0x1000, section_alignment)
    raw_offset = align_values((pe.sections[last_section].PointerToRawData + pe.sections[last_section].SizeOfRawData), file_alignment)
    virtual_offset = align_values(pe.sections[last_section].VirtualAddress + pe.sections[last_section].Misc_VirtualSize, section_alignment)

    for section in pe.sections:
        print(section)



    

def main():
    # Parse the arguments
    parser = argparse.ArgumentParser(description='Binary injector')
    parser.add_argument('target_file', type=str, help='Binary (.exe) file to inject other binary into')
    parser.add_argument('inject_file', type=str, help='Binary (.exe) file to inject into target file')
    args = parser.parse_args()

    # Validate the input
    if not args.target_file.endswith('.exe') or not args.inject_file.endswith('.exe'):
        print('Both files must be .exe files')
        sys.exit(1)
    if not args.target_file:
        print('Target file not provided')
        sys.exit(1)
    if not args.inject_file:
        print('Inject file not provided')
        sys.exit(1)
    if not os.path.exists(args.target_file):
        print('Target file does not exist')
        sys.exit(1)
    if not os.path.exists(args.inject_file):
        print('Inject file does not exist')
        sys.exit(1)
    
    # Inject the binary
    injector(args.target_file, args.inject_file)

if __name__ == '__main__':
    main()

