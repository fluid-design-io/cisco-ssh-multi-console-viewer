import re


def clean_str(s):

    # Remove all non-word characters (everything except numbers and letters)
    s = re.sub(r"[^\w\s]", '', s)

    # Replace all runs of whitespace with nothing
    s = re.sub(r"\s+", '_', s)

    return s
