#!/usr/bin/env python3
"""Compile and inspect the Personal room iOS specimen in an isolated simulator."""
import argparse
import json
import platform
import plistlib
import subprocess
import tempfile
import time
from lib.source_snapshot import SourceSnapshot
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = 'dev.flavius.taste.cycle15'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=ROOT / '.artifacts/native-room')
parser.add_argument('--source', type=Path, default=ROOT / 'eval/cycles/15/NativeRoom.swift')
parser.add_argument('--without-font', action='store_true', help='Omit Schoolbell from the app bundle and verify the native fallback.')
parser.add_argument('--device', help='Use a dedicated test simulator instead of creating one.')
args = parser.parse_args()
output = args.output.resolve()
output.mkdir(parents=True, exist_ok=True)
reports, failures, live_updates, interactions = [], [], [], []
device = args.device
environment = {'platform': platform.system(), 'architecture': platform.machine()}
created = device is None
snapshot = None

def run(*command, **kwargs):
    return subprocess.run(command, check=True, text=True, capture_output=True, **kwargs).stdout.strip()

def audit(report):
    issues = []
    width = report['viewport']['width']
    if report['contentSize']['width'] > width + 1:
        issues.append('Content exceeds viewport width')
    for label in report['labels']:
        frame = label['frame']
        if frame['height'] + 1 < label['requiredHeight']:
            issues.append(f"{label['id']}: label height clips text")
        if frame['width'] > width - 40 + 1:
            issues.append(f"{label['id']}: text exceeds content width")
    for button in report['controls']:
        frame, label = button['frame'], button['labelFrame']
        if frame['width'] < 44 or frame['height'] < 44:
            issues.append(f"{button['id']}: target below 44 points")
        if button['requiredTextHeight'] + 16 > frame['height'] + 1:
            issues.append(f"{button['id']}: target clips scaled text or removes padding")
        if label['y'] < -1 or label['y'] + label['height'] > frame['height'] + 1:
            issues.append(f"{button['id']}: button label extends outside target")
    return issues

try:
    sources = [args.source.resolve(), ROOT / 'scripts/verify-native-room.py', ROOT / 'scripts/lib/source_snapshot.py', ROOT / 'LICENSE', ROOT / 'skills/personal-room/assets/fonts/LICENSE.txt', ROOT / 'skills/personal-room/assets/fonts/NOTICE.txt', ROOT / 'skills/personal-room/assets/tokens.json', ROOT / 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf']
    snapshot = SourceSnapshot(ROOT, sources)
    if platform.system() != 'Darwin':
        raise RuntimeError('This verification requires macOS, Xcode and an installed iOS simulator runtime.')
    if created:
        runtimes = json.loads(run('xcrun', 'simctl', 'list', 'runtimes', '--json'))['runtimes']
        available = [runtime for runtime in runtimes if runtime['isAvailable'] and runtime['identifier'].startswith('com.apple.CoreSimulator.SimRuntime.iOS-')]
        if not available:
            raise RuntimeError('No available iOS simulator runtime')
        runtime = max(available, key=lambda item: tuple(map(int, item['version'].split('.'))))
        device = run('xcrun', 'simctl', 'create', 'Design taste native verification', 'com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation', runtime['identifier'])
        run('xcrun', 'simctl', 'boot', device)
        run('xcrun', 'simctl', 'bootstatus', device, '-b', timeout=180)
    devices = json.loads(run('xcrun', 'simctl', 'list', 'devices', '--json'))['devices']
    runtime_id, device_info = next((runtime, item) for runtime, items in devices.items() for item in items if item['udid'] == device)
    environment.update({'device': device_info['name'], 'deviceType': device_info.get('deviceTypeIdentifier'), 'animations': 'disabled for snapshots', 'fontBundled': not args.without_font, 'runtime': runtime_id, 'xcode': run('xcodebuild', '-version'), 'sdkVersion': run('xcrun', '--sdk', 'iphonesimulator', '--show-sdk-version')})
    with tempfile.TemporaryDirectory(prefix='taste-native-room-') as directory:
        app = Path(directory) / 'Room.app'
        app.mkdir()
        info = {'CFBundleExecutable': 'Room', 'CFBundleIdentifier': BUNDLE, 'CFBundleName': 'Repair notes', 'CFBundlePackageType': 'APPL', 'CFBundleVersion': '1', 'CFBundleShortVersionString': '1.0', 'LSRequiresIPhoneOS': True, 'MinimumOSVersion': '17.0', 'UIDeviceFamily': [1, 2], 'UILaunchScreen': {}, 'UIAppFonts': [] if args.without_font else ['Schoolbell-Regular.ttf'], 'UISupportedInterfaceOrientations': ['UIInterfaceOrientationPortrait']}
        (app / 'Info.plist').write_bytes(plistlib.dumps(info))
        snapshot.write_to(ROOT / 'skills/personal-room/assets/tokens.json', app / 'tokens.json')
        if not args.without_font:
            snapshot.write_to(ROOT / 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf', app / 'Schoolbell-Regular.ttf')
        snapshot.write_to(ROOT / 'skills/personal-room/assets/fonts/LICENSE.txt', app / 'Schoolbell-LICENSE.txt')
        snapshot.write_to(ROOT / 'skills/personal-room/assets/fonts/NOTICE.txt', app / 'Schoolbell-NOTICE.txt')
        snapshot.write_to(ROOT / 'LICENSE', app / 'LICENSE.txt')
        source = Path(directory) / 'NativeRoom.swift'
        snapshot.write_to(args.source, source)
        sdk = run('xcrun', '--sdk', 'iphonesimulator', '--show-sdk-path')
        architecture = 'arm64' if platform.machine() == 'arm64' else 'x86_64'
        run('xcrun', '--sdk', 'iphonesimulator', 'swiftc', '-parse-as-library', '-sdk', sdk, '-target', f'{architecture}-apple-ios17.0-simulator', str(source), '-o', str(app / 'Room'))
        run('xcrun', 'simctl', 'install', device, str(app))
        data = Path(run('xcrun', 'simctl', 'get_app_container', device, BUNDLE, 'data'))
        layout = data / 'Documents/layout.json'
        for appearance in ['light', 'dark']:
            run('xcrun', 'simctl', 'ui', device, 'appearance', appearance)
            for category, expected in [('large', 'UICTContentSizeCategoryL'), ('accessibility-extra-extra-extra-large', 'UICTContentSizeCategoryAccessibilityXXXL')]:
                run('xcrun', 'simctl', 'ui', device, 'content_size', category)
                for position in ['top', 'bottom']:
                    subprocess.run(['xcrun', 'simctl', 'terminate', device, BUNDLE], capture_output=True)
                    layout.unlink(missing_ok=True)
                    arguments = ['--snapshot', '--bottom'] if position == 'bottom' else ['--snapshot']
                    run('xcrun', 'simctl', 'launch', '--stderr=' + str(output / 'app-stderr.log'), device, BUNDLE, *arguments)
                    deadline = time.monotonic() + 20
                    report = None
                    while time.monotonic() < deadline:
                        try:
                            candidate = json.loads(layout.read_text())
                            viewport = candidate['viewport']
                            expected_bottom = max(0, candidate['contentSize']['height'] - viewport['height'])
                            position_ok = viewport['y'] >= expected_bottom - 1 if position == 'bottom' else abs(viewport['y']) < 1
                            if candidate['category'] == expected and position_ok and candidate['controls'][0]['frame']['width'] > 0:
                                report = candidate
                                break
                        except (FileNotFoundError, json.JSONDecodeError):
                            pass
                        time.sleep(0.1)
                    if report is None:
                        raise RuntimeError(f'No matching layout report for {appearance}/{category}/{position}')
                    name = f'{appearance}-{category}-{position}'
                    issues = audit(report)
                    reports.append({'name': name, 'layout': report, 'issues': issues})
                    failures.extend({'name': name, 'message': issue} for issue in issues)
                    run('xcrun', 'simctl', 'io', device, 'screenshot', str(output / f'{name}.png'))
        for category, expected, expected_axis in [('large', 'UICTContentSizeCategoryL', 'horizontal'), ('accessibility-extra-extra-extra-large', 'UICTContentSizeCategoryAccessibilityXXXL', 'vertical')]:
            run('xcrun', 'simctl', 'ui', device, 'content_size', category)
            deadline = time.monotonic() + 10
            matching = None
            last_match = None
            changed_at = time.monotonic()
            reference = next(item['layout'] for item in reports if item['name'] == f'dark-{category}-top')
            expected_body = next(label['fontSize'] for label in reference['labels'] if label['id'] == 'body')
            while time.monotonic() < deadline:
                candidate = json.loads(layout.read_text())
                if candidate['category'] == expected and candidate['actionsAxis'] == expected_axis:
                    sizes = {label['id']: label['fontSize'] for label in candidate['labels']}
                    if sizes['body'] == expected_body and all(button['fontSize'] == sizes['body'] for button in candidate['controls']):
                        if candidate != last_match:
                            last_match = candidate
                            changed_at = time.monotonic()
                        elif time.monotonic() - changed_at >= 0.3:
                            matching = candidate
                            break
                time.sleep(0.1)
            if matching is None:
                failures.append({'name': f'live {category}', 'message': 'Running app did not update text and control layout'})
            else:
                issues = audit(matching)
                live_updates.append({'category': category, 'layout': matching, 'issues': issues})
                failures.extend({'name': f'live {category}', 'message': issue} for issue in issues)
        subprocess.run(['xcrun', 'simctl', 'terminate', device, BUNDLE], capture_output=True)
        layout.unlink(missing_ok=True)
        run('xcrun', 'simctl', 'launch', '--stderr=' + str(output / 'app-stderr.log'), device, BUNDLE, '--snapshot', '--exercise-controls', '--bottom')
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            try:
                candidate = json.loads(layout.read_text())
                if len(candidate.get('eventChecks', [])) == 3 and not audit(candidate):
                    interactions = candidate['eventChecks']
                    failures.extend({'name': item['name'], 'message': 'Control action failed'} for item in interactions if not item['passed'])
                    reports.append({'name': 'dark-accessibility-next-note', 'layout': candidate, 'issues': []})
                    run('xcrun', 'simctl', 'io', device, 'screenshot', str(output / 'dark-accessibility-next-note.png'))
                    break
            except (FileNotFoundError, json.JSONDecodeError):
                pass
            time.sleep(0.1)
        if len(interactions) != 3:
            failures.append({'name': 'control events', 'message': 'No complete control event report'})
        large = next(item['layout'] for item in reports if item['name'] == 'light-large-top')
        enlarged = next(item['layout'] for item in reports if item['name'] == 'light-accessibility-extra-extra-extra-large-top')
        for identifier in ['title', 'body']:
            base = next(label for label in large['labels'] if label['id'] == identifier)
            scaled = next(label for label in enlarged['labels'] if label['id'] == identifier)
            if scaled['fontSize'] <= base['fontSize']:
                failures.append({'name': 'Dynamic Type scaling', 'message': f'{identifier} did not grow'})
        for report in reports:
            for label in report['layout']['labels']:
                if label['id'] in ['title', 'note-title']:
                    custom = label['fontName'] == 'Schoolbell-Regular'
                    if custom == args.without_font:
                        failures.append({'name': report['name'], 'message': 'Unexpected title font for bundle mode'})
except Exception as error:
    if (output / 'app-stderr.log').exists():
        failures.append({'name': 'app stderr', 'message': (output / 'app-stderr.log').read_text()[-8000:]})
    failures.append({'name': 'native runner', 'message': str(error) + ('\n' + error.stderr if isinstance(error, subprocess.CalledProcessError) and error.stderr else '')})
finally:
    (output / 'checks.json').write_text(json.dumps({'environment': environment, 'sourceMode': 'captured bytes compiled and bundled', 'sources': snapshot.hashes if snapshot else {}, 'reports': reports, 'liveUpdates': live_updates, 'interactions': interactions, 'failures': failures, 'limitations': 'iOS simulator layout and captures with animations disabled by the snapshot launch flag. Programmatic scrolling and UIControl event dispatch, not gesture, keyboard or VoiceOver testing. Text sizing checks use actual UILabel and UIButton measurements; they do not certify every glyph or accessibility behavior.'}, indent=2) + '\n')
    if created and device:
        subprocess.run(['xcrun', 'simctl', 'shutdown', device], capture_output=True)
        subprocess.run(['xcrun', 'simctl', 'delete', device], capture_output=True)
print(json.dumps({'output': str(output), 'layouts': len(reports), 'liveUpdates': len(live_updates), 'interactions': len(interactions), 'failures': len(failures)}))
raise SystemExit(1 if failures else 0)
