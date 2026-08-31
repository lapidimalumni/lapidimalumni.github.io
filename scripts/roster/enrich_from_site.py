# -*- coding: utf-8 -*-
"""Fill in English names from the official Lapidim alumni pages.

    python scripts/roster/enrich_from_site.py

The program's own site publishes the alumni list in both languages, and the two
pages carry the same people in the same order, so the English spelling each
person actually uses can be paired to their Hebrew name by position:

    https://lapidim.cs.technion.ac.il/people/alumni/
    https://lapidim.cs.technion.ac.il/he/people/alumni/

This rewrites full_name_en in members_do_not_commit/import_review.csv for
everyone found there, which is far better than transliterating. Rows it cannot
match keep whatever they had and stay flagged for review.

The previous CSV is kept as import_review.csv.bak.
"""
import csv
import difflib
import io
import os
import re
import shutil
import sys
import unicodedata
import urllib.request

ROSTER_DIR = 'members_do_not_commit'
REVIEW_CSV = os.path.join(ROSTER_DIR, 'import_review.csv')
URL_EN = 'https://lapidim.cs.technion.ac.il/people/alumni/'
URL_HE = 'https://lapidim.cs.technion.ac.il/he/people/alumni/'

# Each person is one card; the display name is the span inside .hdrc
NAME_RE = re.compile(r'<div class="hdrc">\s*<span>(.*?)</span>', re.S)
HEBREW_RE = re.compile(r'[֐-׿]')
LATIN_RE = re.compile(r'[A-Za-z]')

# A name matches across the two sources despite punctuation and spelling drift,
# so compare on a stripped-down form: no nikud, no apostrophes (ג'אבר), and
# hyphens treated as spaces (לסר-ניצן).
FUZZY_RATIO = 0.80


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'lapidim-roster-import/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read()
    return raw.decode('utf-8', errors='replace')


def extract_names(html):
    return [re.sub(r'\s+', ' ', m).strip() for m in NAME_RE.findall(html)]


def normalize(name):
    name = unicodedata.normalize('NFKC', name)
    name = re.sub(r'[֑-ׇ]', '', name)                  # nikud
    name = re.sub(r"['\"‘’׳״`]", '', name)   # apostrophes
    name = re.sub(r'[-‐-―]', ' ', name)                # hyphen as space
    return re.sub(r'\s+', ' ', name).strip()


def build_site_map(html_en, html_he):
    names_en, names_he = extract_names(html_en), extract_names(html_he)
    if len(names_en) != len(names_he):
        sys.exit('the two pages list %d and %d people; positional pairing is not safe'
                 % (len(names_en), len(names_he)))
    if not names_en:
        sys.exit('no names found -- the site markup has probably changed')

    mapping = {}
    for english, hebrew in zip(names_en, names_he):
        # Entries the site has not translated repeat the Hebrew; skip those.
        if LATIN_RE.search(english) and HEBREW_RE.search(hebrew):
            mapping[normalize(hebrew)] = (english, hebrew)
    return mapping, len(names_en)


def find_match(hebrew_name, site_map):
    """Exact on the normalized form, else the best close spelling."""
    key = normalize(hebrew_name)
    if key in site_map:
        return site_map[key], 'exact'

    tokens = set(key.split())
    best, best_score = None, None
    for candidate, value in site_map.items():
        shared = len(tokens & set(candidate.split()))
        ratio = difflib.SequenceMatcher(None, key, candidate).ratio()
        if shared >= 2 or ratio >= FUZZY_RATIO:
            score = (shared, ratio)
            if best_score is None or score > best_score:
                best, best_score = value, score
    return (best, 'fuzzy') if best else (None, None)


def main():
    if not os.path.exists(REVIEW_CSV):
        sys.exit('%s not found -- run extract_roster.py first' % REVIEW_CSV)

    print('fetching the alumni pages...')
    site_map, total = build_site_map(fetch(URL_EN), fetch(URL_HE))
    print('site lists %d people, %d of them with an English name' % (total, len(site_map)))

    with io.open(REVIEW_CSV, encoding='utf-8-sig', newline='') as handle:
        rows = list(csv.DictReader(handle))

    fields = list(rows[0].keys()) if rows else []
    for column in ('site_name_he', 'match'):
        if column not in fields:
            fields.append(column)

    exact = fuzzy = 0
    for row in rows:
        found, kind = find_match(row['full_name_he'], site_map)

        if found:
            english, hebrew_on_site = found
            row['full_name_en'] = english
            row['source'] = 'lapidim-site'
            row['site_name_he'] = hebrew_on_site
            row['match'] = kind
            # An exact hit is the person's own published spelling; a fuzzy hit
            # matched a differently spelled name, so a human confirms it.
            if kind == 'exact':
                row['needs_review'] = 'no'
                exact += 1
            else:
                row['needs_review'] = 'yes'
                fuzzy += 1
        else:
            row['site_name_he'] = ''
            row['match'] = 'none'
            row['needs_review'] = 'yes'

    shutil.copyfile(REVIEW_CSV, REVIEW_CSV + '.bak')
    try:
        with io.open(REVIEW_CSV, 'w', encoding='utf-8-sig', newline='') as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)
    except PermissionError:
        # Excel takes an exclusive lock on an open workbook.
        sys.exit('cannot write %s -- close it in Excel and run this again' % REVIEW_CSV)

    unmatched = len(rows) - exact - fuzzy
    print()
    print('names taken from the site : %d' % (exact + fuzzy))
    print('  exact                   : %d  (needs_review=no)' % exact)
    print('  close spelling          : %d  (needs_review=yes -- compare site_name_he)' % fuzzy)
    print('not on the site           : %d  (needs_review=yes -- still transliterated)' % unmatched)
    print()
    print('updated %s (previous kept as .bak)' % REVIEW_CSV)


if __name__ == '__main__':
    main()
