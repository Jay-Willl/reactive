import subprocess

# process = subprocess.Popen(['conda', '--version'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
# stdout, stderr = process.communicate()
# print(stdout)


# cmd = ('conda --version && '
#        'conda info')
# result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
# print(result.stdout)
#
# cmd = ('conda activate base')
# result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
# print(result.stdout)
#
# cmd = ('conda info')
# result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
# print(result.stdout)


cmd = ('conda activate base'
       ' && '
       'sleep 1'
       ' && '
       'conda info')

result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print(result.stdout)
