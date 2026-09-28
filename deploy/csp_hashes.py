"""Print the CSP script-src hashes for every inline <script> in a page.

Usage: python3 deploy/csp_hashes.py index.html
Paste the output into deploy/nginx.conf and _headers after editing any <script> block.
"""
import base64, hashlib, re, sys

html = open(sys.argv[1] if len(sys.argv) > 1 else "index.html", encoding="utf-8").read()
for body in re.findall(r"<script>(.*?)</script>", html, re.S):
    print("'sha256-" + base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode() + "'", end=" ")
print()
