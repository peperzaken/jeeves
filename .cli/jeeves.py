"""Jeeves.

Usage:
  jeeves.py create_slide <name>...

Options:
  -h --help     Show this screen.
  --version     Show version.

"""
from docopt import docopt
import io, os

def create_slide(name):
    #1: Create dir with name of slide as slide
    directory = '../client/slides/' + name
    if not os.path.exists(directory):
        os.makedirs(directory)
    public_directory = '../public/slides/' + name
    if not os.path.exists(public_directory):
        os.makedirs(public_directory)
        touch(public_directory + "/.gitkeep")

    #2: Create html/css/js files with template code in it.
    create_file_from_template(directory, name, '.css')
    create_file_from_template(directory, name, '.js')
    create_file_from_template(directory, name, '.html')
    print("Done creating files for \"" + name +  "\" slide.")

    #3: Add the slide to the routes.
    line_to_add = "    this.route('" + name + "');" + "\n"

    with open("../lib/routes.js", 'r') as file:
        lines = file.readlines()

    duplicate = False
    # Loop over all lines, find the last line with a route
    for index, line in enumerate(lines):
        if duplicate:
            break
        if(line_to_add in line):
            duplicate = True
        if('this.route' in line):
            last_line = index

    # Add our route to the array.
    lines.insert(last_line + 1, line_to_add)

    # Open the routes file and write our new configuration in it.
    if not duplicate:
        with open("../lib/routes.js", 'w') as file:
        # read a list of lines into data
            file.writelines( lines )
    else:
        print("Found a duplicate route in lib/routes.js, ignoring.")

def create_file_from_template(directory, name, extension):
    # Create the new config file for writing
    template = io.open(directory + "/" + name + extension, 'w')

    # Read the lines from the template, substitute the values, and write to the new config file
    for line in io.open('templates/template' + extension, 'r'):
        line = line.replace('$NAME', name)
        template.write(line)

        # Close the files
    template.close()

def touch(path):
    with open(path, 'a'):
        os.utime(path, None)

if __name__ == '__main__':
    args = docopt(__doc__, version='Jeeves 1.0')
    functions = {
        'create_slide': create_slide
    }
    if(args['create_slide']):
        create_slide(args['<name>'][0])

