#!/usr/bin/env python3
"""Run native simulator swipes, taps and accessibility audits with XCTest."""
import argparse
import json
import platform
import subprocess
import tempfile
from pathlib import Path
from lib.native_project import create_project
from lib.source_snapshot import SourceSnapshot

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=ROOT / '.artifacts/native-interactions')
parser.add_argument('--without-font', action='store_true', help='Build without Schoolbell and test the native fallback.')
parser.add_argument('--device', help='Use a dedicated test simulator. Its appearance and text size will change.')
args = parser.parse_args()
output = args.output.resolve()
output.mkdir(parents=True, exist_ok=True)
device = args.device
created = device is None
reports, failures = [], []
snapshot = None

def run(*command, **kwargs):
    return subprocess.run(command, check=True, text=True, capture_output=True, **kwargs).stdout.strip()

try:
    paths = ['eval/cycles/15/NativeRoom.swift', 'eval/cycles/16/RoomUITests.swift', 'scripts/verify-native-interactions.py', 'scripts/lib/native_project.py', 'scripts/lib/source_snapshot.py', 'LICENSE', 'skills/personal-room/assets/fonts/LICENSE.txt', 'skills/personal-room/assets/fonts/NOTICE.txt', 'skills/personal-room/assets/tokens.json', 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf']
    snapshot = SourceSnapshot(ROOT, [ROOT / path for path in paths])
    if platform.system() != 'Darwin':
        raise RuntimeError('Native UI tests require macOS, Xcode and an iOS simulator runtime.')
    if created:
        runtimes = json.loads(run('xcrun', 'simctl', 'list', 'runtimes', '--json'))['runtimes']
        available = [item for item in runtimes if item['isAvailable'] and item['identifier'].startswith('com.apple.CoreSimulator.SimRuntime.iOS-')]
        runtime = max(available, key=lambda item: tuple(map(int, item['version'].split('.'))))
        device = run('xcrun', 'simctl', 'create', 'Design taste UI verification', 'com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation', runtime['identifier'])
        run('xcrun', 'simctl', 'boot', device)
        run('xcrun', 'simctl', 'bootstatus', device, '-b', timeout=180)
    with tempfile.TemporaryDirectory(prefix='taste-xctest-') as directory:
        base = Path(directory)
        snapshot_root = base / 'inputs'
        snapshot.materialize(snapshot_root)
        project = create_project(snapshot_root, base, without_font=args.without_font)
        for appearance in ['light', 'dark']:
            run('xcrun', 'simctl', 'ui', device, 'appearance', appearance)
            for category in ['large', 'accessibility-extra-extra-extra-large']:
                run('xcrun', 'simctl', 'ui', device, 'content_size', category)
                name = f'{appearance}-{category}'
                result = output / f'{name}.xcresult'
                if result.exists():
                    raise RuntimeError(f'Result already exists: {result}. Choose a fresh output directory.')
                with (output / f'{name}.log').open('w') as log:
                    completed = subprocess.run(['xcodebuild', 'test', '-project', str(project), '-scheme', 'Room', '-destination', f'platform=iOS Simulator,id={device}', '-derivedDataPath', str(base / 'DerivedData'), '-resultBundlePath', str(result), '-parallel-testing-enabled', 'NO'], stdout=log, stderr=subprocess.STDOUT)
                if result.exists():
                    summary = json.loads(run('xcrun', 'xcresulttool', 'get', 'test-results', 'summary', '--path', str(result)))
                    reports.append({'name': name, 'exitCode': completed.returncode, 'summary': summary})
                    run('xcrun', 'xcresulttool', 'export', 'attachments', '--path', str(result), '--output-path', str(output / f'{name}-attachments'))
                    if completed.returncode or summary['failedTests'] or summary['passedTests'] != 1 or summary['skippedTests']:
                        failures.append({'name': name, 'message': 'UI test or audit failed', 'summary': summary})
                else:
                    failures.append({'name': name, 'message': f'No result bundle. xcodebuild exited {completed.returncode}'})
except Exception as error:
    failures.append({'name': 'native UI runner', 'message': str(error) + ('\n' + error.stderr if isinstance(error, subprocess.CalledProcessError) and error.stderr else '')})
finally:
    (output / 'checks.json').write_text(json.dumps({'fontBundled': not args.without_font, 'sourceMode': 'captured bytes copied into the test project', 'sources': snapshot.hashes if snapshot else {}, 'reports': reports, 'failures': failures, 'limitations': 'XCTest simulator swipes and taps with native animations enabled. Each test runs unfiltered Apple accessibility audits at the opening, action area and next-note heading. This is not physical-device or VoiceOver certification.'}, indent=2) + '\n')
    if created and device:
        subprocess.run(['xcrun', 'simctl', 'shutdown', device], capture_output=True)
        subprocess.run(['xcrun', 'simctl', 'delete', device], capture_output=True)
print(json.dumps({'output': str(output), 'variants': len(reports), 'failures': len(failures)}))
raise SystemExit(1 if failures else 0)
