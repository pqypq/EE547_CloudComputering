import sys
import math

def swap(string, i, j):
    string = list(string)
    tmp = string[i]
    string[i] = string[j]
    string[j] = tmp
    string = "".join(string)
    return string

def Permutation(anagrams, string, index, length):
    if index == length - 1:
        anagrams.add(string)
        return
    for i in range(index, length):
        string = swap(string,index,i)
        if string in anagrams:
            string = swap(string,index,i)
            continue
        else:
            Permutation(anagrams, string, index+1, length)
            string = swap(string, index, i)

def main():
    """
        python commend line
    """
    str = sys.argv[1]
    for i in range(2, len(sys.argv)):
        str = str + " " + sys.argv[i]
    
    # empty string case
    if len(str) == 0:
        sys.stdout.write("empty")
        return 0
        
    # invide case
    for i in range(len(str)):
        if ord(str[i]) < 65 or (ord(str[i]) > 90 and ord(str[i]) < 97) or ord(str[i]) >122:
            print("invalid", file = sys.stderr)
            return 0

    # counting anagrams
    # transfer all letters to lower letters
    str = str.lower()
    characters = {}
    for ch in str:
        if ch in characters:
            characters[ch] += 1
        else:
            characters[ch] = 1

    res = math.factorial(len(str))
    for val in characters.values():
        res = res // math.factorial(val)
    
    print(res)
    return res

if __name__ == "__main__":
    main()