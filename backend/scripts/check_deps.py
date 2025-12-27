import ast, os, re, sys

ROOT = os.path.dirname(os.path.dirname(__file__))  # backend/
EXCLUDE_PKGS = {"app"}  # اسم الحزمة المحلية ليُستبعد
req_file = os.path.join(ROOT, "requirements.txt")

def find_imports(root):
    mods = set()
    for dirpath, dirnames, filenames in os.walk(root):
        if ".venv" in dirpath or "__pycache__" in dirpath:
            continue
        for fn in filenames:
            if not fn.endswith(".py"):
                continue
            path = os.path.join(dirpath, fn)
            try:
                with open(path, "r", encoding="utf8") as f:
                    tree = ast.parse(f.read(), filename=path)
            except Exception:
                continue
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for n in node.names:
                        mods.add(n.name.split(".")[0])
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        mods.add(node.module.split(".")[0])
    return mods

def read_requirements(path):
    pkgs = set()
    if not os.path.exists(path):
        return pkgs

    encodings = ("utf-8-sig", "utf-8", "utf-16", "latin-1")
    for enc in encodings:
        try:
            with open(path, "r", encoding=enc) as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    m = re.match(r"^([A-Za-z0-9_\-\.]+)", line)
                    if m:
                        pkgs.add(m.group(1).lower())
            return pkgs
        except UnicodeDecodeError:
            continue

    # Fallback: read as binary and decode permissively
    try:
        with open(path, "rb") as f:
            text = f.read().decode("latin-1", errors="replace")
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            m = re.match(r"^([A-Za-z0-9_\-\.]+)", line)
            if m:
                pkgs.add(m.group(1).lower())
    except Exception:
        pass

    return pkgs

def normalize_mod(m):
    return m.replace("_", "-").lower()

if __name__ == "__main__":
    imports = find_imports(os.path.join(ROOT, "app"))
    stdlib = getattr(sys, "stdlib_module_names", set())  # py3.10+
    stdlib = {s.lower() for s in stdlib} if stdlib else set()
    imports = {m for m in imports if m and m not in EXCLUDE_PKGS and m.lower() not in stdlib}
    reqs = read_requirements(req_file)
    missing = sorted([m for m in imports if normalize_mod(m) not in reqs])
    print("Detected import top-level modules:")
    print(", ".join(sorted(imports)))
    print("\nRequirements packages (from requirements.txt):")
    print(", ".join(sorted(reqs)))
    print("\nLikely missing (module -> not in requirements.txt):")
    for m in missing:
        print(f"- {m}  (try package name: {normalize_mod(m)})")