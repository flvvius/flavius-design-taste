import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from lib.native_project import create_project
from lib.source_snapshot import SourceSnapshot


class NativeSnapshotTests(unittest.TestCase):
    def test_project_uses_captured_bytes_after_workspace_changes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'workspace'
            contents = {
                'eval/cycles/15/NativeRoom.swift': b'original app',
                'eval/cycles/16/RoomUITests.swift': b'original tests',
                'skills/personal-room/assets/tokens.json': b'{"original": true}',
                'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf': b'original font',
                'skills/personal-room/assets/fonts/LICENSE.txt': b'font licence',
                'skills/personal-room/assets/fonts/NOTICE.txt': b'font notice',
                'LICENSE': b'repository licence',
            }
            for path, data in contents.items():
                file = root / path
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_bytes(data)
            snapshot = SourceSnapshot(root, [root / path for path in contents])
            (root / 'eval/cycles/15/NativeRoom.swift').write_bytes(b'edited app')
            (root / 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf').unlink()
            captured_root = Path(directory) / 'captured'
            snapshot.materialize(captured_root)
            for omitted in [False, True]:
                project_root = Path(directory) / ('fallback' if omitted else 'bundled')
                create_project(captured_root, project_root, without_font=omitted)
                self.assertEqual((project_root / 'NativeRoom.swift').read_bytes(), b'original app')
                self.assertEqual((project_root / 'RoomUITests.swift').read_bytes(), b'original tests')
                self.assertEqual((project_root / 'tokens.json').read_bytes(), b'{"original": true}')
                font = project_root / 'Schoolbell-Regular.ttf'
                self.assertEqual(font.exists(), not omitted)
                if font.exists():
                    self.assertEqual(font.read_bytes(), b'original font')
            self.assertEqual(snapshot.hashes['eval/cycles/15/NativeRoom.swift'], hashlib.sha256(b'original app').hexdigest())

    def test_external_baseline_source_is_captured_without_relocating_its_identity(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'workspace'
            root.mkdir()
            external = Path(directory) / 'baseline.swift'
            external.write_bytes(b'baseline')
            snapshot = SourceSnapshot(root, [external])
            external.write_bytes(b'changed')
            destination = root / 'compiled.swift'
            snapshot.write_to(external, destination)
            self.assertEqual(destination.read_bytes(), b'baseline')
            self.assertEqual(snapshot.hashes[str(external.resolve())], hashlib.sha256(b'baseline').hexdigest())

    def test_missing_baseline_still_writes_a_failed_report(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'output'
            runner = Path(__file__).resolve().parents[1] / 'verify-native-room.py'
            result = subprocess.run([sys.executable, str(runner), '--source', str(Path(directory) / 'missing.swift'), '--output', str(output)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            report = json.loads((output / 'checks.json').read_text())
            self.assertEqual(report['reports'], [])
            self.assertEqual(report['sources'], {})
            self.assertTrue(report['failures'])
            self.assertIn('missing.swift', report['failures'][0]['message'])


if __name__ == '__main__':
    unittest.main()
