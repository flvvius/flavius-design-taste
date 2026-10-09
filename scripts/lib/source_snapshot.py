from hashlib import sha256
from pathlib import Path


class SourceSnapshot:
    def __init__(self, root, paths):
        self.root = Path(root).resolve()
        self.files = {Path(path).resolve(): Path(path).read_bytes() for path in paths}
        self.hashes = {
            str(path.relative_to(self.root) if path.is_relative_to(self.root) else path): sha256(data).hexdigest()
            for path, data in self.files.items()
        }

    def write_to(self, source, destination):
        destination = Path(destination)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(self.files[Path(source).resolve()])

    def materialize(self, destination):
        for path in self.files:
            if path.is_relative_to(self.root):
                self.write_to(path, Path(destination) / path.relative_to(self.root))
