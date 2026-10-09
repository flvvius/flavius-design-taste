from pathlib import Path
import plistlib
import shutil


def create_project(root: Path, base: Path):
    base.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(root / 'eval/cycles/15/NativeRoom.swift', base / 'NativeRoom.swift')
    shutil.copyfile(root / 'eval/cycles/16/RoomUITests.swift', base / 'RoomUITests.swift')
    for name, source in [('tokens.json', 'skills/personal-room/assets/tokens.json'), ('Schoolbell-Regular.ttf', 'skills/personal-room/assets/fonts/Schoolbell-Regular.ttf'), ('Schoolbell-LICENSE.txt', 'skills/personal-room/assets/fonts/LICENSE.txt'), ('Schoolbell-NOTICE.txt', 'skills/personal-room/assets/fonts/NOTICE.txt'), ('LICENSE.txt', 'LICENSE')]:
        shutil.copyfile(root / source, base / name)
    (base / 'Info.plist').write_bytes(plistlib.dumps({'CFBundleExecutable': '$(EXECUTABLE_NAME)', 'CFBundleIdentifier': '$(PRODUCT_BUNDLE_IDENTIFIER)', 'CFBundleName': '$(PRODUCT_NAME)', 'CFBundlePackageType': 'APPL', 'CFBundleVersion': '1', 'CFBundleShortVersionString': '1.0', 'LSRequiresIPhoneOS': True, 'UILaunchScreen': {}, 'UIAppFonts': ['Schoolbell-Regular.ttf'], 'UISupportedInterfaceOrientations': ['UIInterfaceOrientationPortrait']}))
    objects={};counter=0
    def obj(isa,**values):
     nonlocal counter
     counter+=1;k=f'{counter:024X}';objects[k]={'isa':isa,**values};return k
    appref=obj('PBXFileReference',explicitFileType='wrapper.application',path='Room.app',sourceTree='BUILT_PRODUCTS_DIR')
    testref=obj('PBXFileReference',explicitFileType='wrapper.cfbundle',path='RoomUITests.xctest',sourceTree='BUILT_PRODUCTS_DIR')
    def file(name,kind):return obj('PBXFileReference',lastKnownFileType=kind,path=name,sourceTree='<group>')
    appsource=file('NativeRoom.swift','sourcecode.swift');testsource=file('RoomUITests.swift','sourcecode.swift');tokens=file('tokens.json','text.json');font=file('Schoolbell-Regular.ttf','file');info=file('Info.plist','text.plist.xml')
    licenses=[file(name,'text') for name in ['Schoolbell-LICENSE.txt','Schoolbell-NOTICE.txt','LICENSE.txt']]
    def phase(isa,refs):return obj(isa,buildActionMask=2147483647,files=[obj('PBXBuildFile',fileRef=r) for r in refs],runOnlyForDeploymentPostprocessing=0)
    def configlist(settings):
     cs=[obj('XCBuildConfiguration',name=n,buildSettings=settings) for n in ['Debug','Release']]
     return obj('XCConfigurationList',buildConfigurations=cs,defaultConfigurationIsVisible=0,defaultConfigurationName='Debug')
    settings={'SDKROOT':'iphoneos','IPHONEOS_DEPLOYMENT_TARGET':'17.0','SWIFT_VERSION':'5.0','CODE_SIGNING_ALLOWED':'NO','TARGETED_DEVICE_FAMILY':'1,2','PRODUCT_NAME':'$(TARGET_NAME)','SWIFT_OPTIMIZATION_LEVEL':'-Onone','DEBUG_INFORMATION_FORMAT':'dwarf','ALWAYS_SEARCH_USER_PATHS':'NO'}
    app=obj('PBXNativeTarget',name='Room',productName='Room',productReference=appref,productType='com.apple.product-type.application',buildConfigurationList=configlist({**settings,'PRODUCT_BUNDLE_IDENTIFIER':'dev.flavius.taste.cycle15','INFOPLIST_FILE':'Info.plist','GENERATE_INFOPLIST_FILE':'NO'}),buildPhases=[phase('PBXSourcesBuildPhase',[appsource]),phase('PBXResourcesBuildPhase',[tokens,font,*licenses]),phase('PBXFrameworksBuildPhase',[])],buildRules=[],dependencies=[])
    project_id=obj('PBXProject')
    proxy=obj('PBXContainerItemProxy',containerPortal=project_id,proxyType=1,remoteGlobalIDString=app,remoteInfo='Room')
    dep=obj('PBXTargetDependency',target=app,targetProxy=proxy)
    test=obj('PBXNativeTarget',name='RoomUITests',productName='RoomUITests',productReference=testref,productType='com.apple.product-type.bundle.ui-testing',buildConfigurationList=configlist({**settings,'PRODUCT_BUNDLE_IDENTIFIER':'dev.flavius.taste.uitests','GENERATE_INFOPLIST_FILE':'YES','TEST_TARGET_NAME':'Room'}),buildPhases=[phase('PBXSourcesBuildPhase',[testsource]),phase('PBXFrameworksBuildPhase',[]),phase('PBXResourcesBuildPhase',[])],buildRules=[],dependencies=[dep])
    products=obj('PBXGroup',children=[appref,testref],name='Products',sourceTree='<group>');group=obj('PBXGroup',children=[appsource,testsource,tokens,font,info,*licenses,products],sourceTree='<group>')
    objects[project_id].update(attributes={'LastUpgradeCheck':'2660','TargetAttributes':{test:{'TestTargetID':app}}},buildConfigurationList=configlist(settings),compatibilityVersion='Xcode 14.0',developmentRegion='en',knownRegions=['en','Base'],mainGroup=group,productRefGroup=products,projectDirPath='',projectRoot='',targets=[app,test])
    proj=base/'Room.xcodeproj';proj.mkdir(exist_ok=True);(proj/'project.pbxproj').write_bytes(plistlib.dumps({'archiveVersion':'1','classes':{},'objectVersion':'56','objects':objects,'rootObject':project_id},sort_keys=False))
    scheme=proj/'xcshareddata/xcschemes';scheme.mkdir(parents=True,exist_ok=True)
    def ref(identifier,name):return f'<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{identifier}" BuildableName="{name}" BlueprintName="{name.split(".")[0]}" ReferencedContainer="container:Room.xcodeproj"/>'
    (scheme/'Room.xcscheme').write_text(f'''<?xml version="1.0" encoding="UTF-8"?><Scheme LastUpgradeVersion="2660" version="1.3"><BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">{ref(app,'Room.app')}</BuildActionEntry><BuildActionEntry buildForTesting="YES" buildForRunning="NO" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">{ref(test,'RoomUITests.xctest')}</BuildActionEntry></BuildActionEntries></BuildAction><TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO">{ref(test,'RoomUITests.xctest')}</TestableReference></Testables></TestAction><LaunchAction buildConfiguration="Debug"><BuildableProductRunnable runnableDebuggingMode="0">{ref(app,'Room.app')}</BuildableProductRunnable></LaunchAction></Scheme>''')
    return proj
