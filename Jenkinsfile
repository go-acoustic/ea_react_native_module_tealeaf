/**********************************************************************************************
* Copyright (C) 2022 Acoustic, L.P. All rights reserved.
*
* NOTICE: This file contains material that is confidential and proprietary to
* Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
* industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
* Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
* prohibited.
**********************************************************************************************/

def modules = [:]
pipeline {
    agent {
        label 'osx'
    }

    environment {
        SONAR_HOME = "/Users/Shared/Developer/sonar-scanner-4.6.0.2311-macosx/bin"
        SONAR_BUILD_WRAPPER = "/Users/Shared/Developer/build-wrapper-macosx-x86/build-wrapper-macosx-x86"
        PATH="${PATH}:${GEM_HOME}/bin"
    }

    stages {
        stage('Setup Beta') {
            when { anyOf { branch 'feature/*'; branch 'develop' } }
            steps {
                echo 'Set up settings..'
                script{
                    createBuild("Beta ${name} build")
                    checkoutRepo()
                    // setupEmulator("RN_30")
                }
            }
        }
        stage('Setup Release') {
            when { branch 'master' }
            steps {
                echo 'Set up settings..'
                script{
                    createBuild("Release ${name} build")
                    checkoutReleaseRepo()
                }
            }
        }
        // stage('Build iOS - xcode') {
        //     when { anyOf { branch 'feature/*'; branch 'develop'; branch 'master' } }
        //     steps {
        //         echo 'Building..'
        //         script{
        //             runIosTests(true, false)
        //         }
        //     }
        // }
        // Issue starting simulator
        // stage('Build iOS - yarn ios') {
        //     when { anyOf { branch 'feature/*'; branch 'develop'; branch 'master' } }
        //     steps {
        //         echo 'Building..'
        //         script{
        //             echo "run using react native"
        //             runCMD("cd ${testAppDir} && yarn")
        //             runCMD("cd ${testAppDir} && yarn ios")
        //             killIosSim()
        //         }
        //     }
        // }
        // stage('Build Android - gradle') {
        //     when { anyOf { branch 'feature/*'; branch 'develop'; branch 'master' } }
        //     steps {
        //         echo 'Building..'
        //         // build errors need to review how to build
        //         // script{
        //         //     runAndroidTests(true, false)
        //         // }
        //     }
        // }
        // stage('Build Android - react native cmd') {
        //     when { anyOf { branch 'feature/*'; branch 'develop'; branch 'master' } }
        //     steps {
        //         echo 'Building..'
        //         script{
        //             checkEmulatorReady()
        //             echo "run using react native"
        //             runCMD("cd ${testAppDir} && react-native run-android")
        //         }
        //     }
        // }
        stage('Test') {
            when { anyOf { branch 'feature/*'; branch 'develop'; branch 'master' } }
            steps {
                echo 'Testing..'
            }
        }
        stage('Publish Beta') {
            when { branch 'develop'}
            steps {
                echo 'Publish Beta....'
                script{
                    if (genBuild) {
                        publishBeta()
                    }
                }
            }
        }
        stage('Publish Release') {
            when { branch 'master' }
            steps {
                echo 'Publish Release....'
                script{
                    if (genBuild) {
                        publishRelease()
                    }
                }
            }
        }
    }
    post {
        always {
            script{
                getSlackReport(false)
            }
        }
        // // Clean after build
        // success {
        //     cleanWs cleanWhenNotBuilt: false, cleanWhenFailure: false, cleanWhenUnstable: false, deleteDirs: true, disableDeferredWipeout: true, patterns: [[pattern: "**/Reports/**", type: 'EXCLUDE']]
        // }
        // aborted {
        //     cleanWs cleanWhenNotBuilt: false, cleanWhenFailure: false, cleanWhenUnstable: false, deleteDirs: true, disableDeferredWipeout: true, patterns: [[pattern: "**/Reports/**", type: 'EXCLUDE']]
        // }
    }
}

import groovy.transform.Field
import groovy.json.JsonOutput
import java.util.Optional
import hudson.tasks.test.AbstractTestResultAction
import hudson.model.Actionable
import hudson.tasks.junit.CaseResult
import hudson.model.Action
import hudson.model.AbstractBuild
import hudson.model.HealthReport
import hudson.model.HealthReportingAction
import hudson.model.Result
import hudson.model.Run
import hudson.plugins.cobertura.*
import hudson.plugins.cobertura.targets.CoverageMetric
import hudson.plugins.cobertura.targets.CoverageTarget
import hudson.plugins.cobertura.targets.CoverageResult
import hudson.util.DescribableList
import hudson.util.Graph
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import groovy.util.slurpersupport.*
import java.text.SimpleDateFormat

// Global variables
@Field def name              = "ReactNativeTealeaf"

// Slack reporting
@Field def gitAuthor         = ""
@Field def lastCommitMessage = ""
@Field def testSummary       = "No tests found"
@Field def coverageSummary   = "No test coverage found"
@Field def lintSummary       = "Lint report is null"
@Field def total             = 0
@Field def failed            = 0
@Field def skipped           = 0

// Version stuff
@Field def currentVersion
@Field def srcBranch        = "develop"//"${env.GIT_BRANCH}"

// Commit stuff
@Field def commitDesciption = ""

// Directory paths
@Field def tempTestDir = "${name}Build"
@Field def testAppDir  = "Example/nativebase-v3-kitchensink"
@Field def buildDir    = "${tempTestDir}/ea_react_native_module_tealeaf"
@Field def releaseDir  = "${tempTestDir}/ea_react_native_module_tealeaf"
@Field def buildIosDir = "${testAppDir}/ios/derived"

// Build information
@Field def genBuild  = true

// Test platform
@Field def platform       = "iOS Simulator,name=iPhone 14 Plus,OS=16.0"
@Field def platformName   = platform.replaceAll(/\s|,|=|\./, "_")
@Field def platformLatest = "16.0"
@Field def emulatorId     = ""

def createBuild(findText) {
    def resullt = hasTextBasedOnLastCommit(findText)

    if (resullt == 0) {
        genBuild = false
    } else {
        genBuild = true
    }
    
    platformLatest = runCMD("xcrun simctl list | grep -w \"\\-\\- iOS\" | tail -1 | sed -r 's/[--]+//g' | sed -r 's/[iOS ]+//g' ")
    platform = "iOS Simulator,name=iPhone 14 Plus,OS=${platformLatest}"
}

def runIosTests(isJustBuild, runSonarQube) {
    String xcodebuildCMD   = "arch -x86_64 xcrun"
    String workspacePath   = "${testAppDir}/ios/KitchenSinkappnativebase.xcworkspace"
    String sonarWrapperDir = "${testAppDir}/ios/build_wrapper_output_directory"
    
    echo 'Install xcpretty if not installed - gem install xcpretty'
    runCMD("#!/bin/bash;gem install xcpretty")
    podUpdate()

    echo "Clean build dir: ${buildIosDir}"
    cleanMkDir("${buildIosDir}")

    if (runSonarQube) {
        echo "Setup and run for SonarQube"
        xcodebuildCMD = "$SONAR_BUILD_WRAPPER --out-dir $sonarWrapperDir"
        buildIosDir   = "${testAppDir}/ios/sonarbuild/derived"
        cleanMkDir("${buildIosDir}")
    }
    
    if (isJustBuild) {
        echo "the scheme for building is: KitchenSinkappnativebase"
        runCMD("${xcodebuildCMD} xcodebuild -workspace ${workspacePath} -scheme KitchenSinkappnativebase -derivedDataPath ${buildIosDir} -configuration Debug -destination 'platform=${platform}' -UseModernBuildSystem=YES SUPPORTS_MACCATALYST=NO")
    } else {
        // Not enabled for now - no unit tests
        // echo "the scheme for unit testing is: $scheme"
        // runCMD("${xcodebuildCMD} xcodebuild -workspace ${workspacePath} -scheme ${schemeUnitTest} -derivedDataPath ${buildIosDir} -configuration ${configurationUnitTest} -destination 'platform=${platform}' -enableCodeCoverage YES test -UseModernBuildSystem=YES SUPPORTS_MACCATALYST=NO | xcpretty -t -r junit")

        // echo "Copy over unit tests"
        // cleanMkDir("${reportsDir}/junit")

        // runCMD("mv build/reports ${reportsDir}/junit")
        // runCMD("rm -rf build/reports")
        // runCMD("mv ${reportsDir}/junit/reports/junit.xml ${reportsDir}/junit/${platformName}.xml")
        // runCMD("rm -rf ${reportsDir}/junit/reports")

        // slather()
    }
}

def podUpdate() {
    echo "Fix and install cocopods dependancies for workspace"
    runCMD("cd ${testAppDir} && yarn")
    runCMD("cd ${testAppDir}/ios && pod update")
    // runCMD("cd ${testAppDir}/ios && pod install")
}
def killIosSim() {
    echo "Kill iOS Simulator"
    sh script: "sleep 10"
    runCMD("xcrun simctl shutdown \"iPhone 13\"")
}

def runAndroidTests(isJustBuild, runSonarQube) {
    // echo "Clean build dir: ${buildDir}"
    // runCMD("rm -rf ${buildDir}")
    // runCMD("mkdir ${buildDir}")

    // if (runSonarQube) {
    //     echo "Setup and run for SonarQube"
    //     xcodebuildCMD = "$SONAR_BUILD_WRAPPER --out-dir $sonarWrapperDir"
    //     buildDir = "${tempTestDir}/${name}/sonarbuild/derived"
    //     runCMD("rm -rf ${buildDir}")
    //     runCMD("mkdir -p ${buildDir}")
    // }

    echo "Run Gradle"
    String gradleLine = ""
    if (isJustBuild) {
        runCMD("/Users/Shared/Developer/gradle-6.7/bin/gradle -b \"${testAppDir}/android/build.gradle\" --stacktrace --continue --no-daemon --warning-mode all clean build -Dorg.gradle.jvmargs=-Xmx1536m -Duser.country=US -Duser.language=en")
    } else {
        // checkEmulatorReady()

        // // jacoco tests
        // runCMD("gradle -b \"${androidStudioProjectTestAppPath}/build.gradle\" --stacktrace --continue --no-daemon --warning-mode all jacocoTestReport -Dorg.gradle.jvmargs=-Xmx1536m -Duser.country=US -Duser.language=en")
        // reportsJacoco()

        // // checkstyle
        // runCMD("gradle -b \"${androidStudioProjectNamePath}/build.gradle\" --stacktrace --continue --no-daemon --warning-mode all checkstyle -Dorg.gradle.jvmargs=-Xmx1536m -Duser.country=US -Duser.language=en")
        // reportsCheckstyle()
    }
}

def setupEmulator(deviceId) {
    emulatorId = deviceId

    runCMD("adb start-server")
    // launch emulator
    String cmmmd = "${ANDROID_HOME}/emulator/emulator -avd ${deviceId} -engine auto -wipe-data -no-cache -memory 3072 -no-snapshot-save -no-window&sleep 60s"
    runCMD(cmmmd)
}

def shutdownEmulator() {
    sh script: 'adb -s emulator-5554 emu kill'
}

def checkEmulatorReady() {
    sh script: "adb start-server"

    if (!sh(script: "adb devices", returnStdout: true).contains("emulator")) {
        setupEmulator emulatorId
    }

    def counter = 0
    while (!sh(script: "adb shell getprop sys.boot_completed", returnStdout: true).trim().equals("1")) {
      if (counter >= 60) {
        echo "The emulator has not started, exiting"
        return
      }
      sh script: "sleep 5"
      counter += 5
    }

    counter = 0
    while (!sh(script: "sh AndroidAutoSrc/GroovyUtils/psgrep.sh testapp", returnStdout: true).trim().isEmpty()) {
      if (counter == 0) {
        echo "Waiting for previous tests to finish..."
      }

      sh script: "sleep 5"
      counter += 5
    }

    echo "No tests running, emulator ready"
}

// "Update library build version number and example app package.json"
def getLibVersion() {
    def packageFile = "${buildDir}/package.json"

    echo "Get version from:${packageFile}"
    // Get file to update and save
    def fileContent = readFile "${packageFile}"
    Map jsonContent = (Map) new JsonSlurper().parseText(fileContent)
    currentVersion = jsonContent.version
    echo "Current version ${currentVersion}"
}

// "Update library build version number and example app package.json"
def updateLibVersion() {
    def packageFile = "${buildDir}/package.json"

    echo "Get version from:${packageFile}"
    // Get file to update and save
    def fileContent = readFile "${packageFile}"
    Map jsonContent = (Map) new JsonSlurper().parseText(fileContent)
    currentVersion = jsonContent.version
    echo "Current version ${currentVersion}"

    def libVersionArray = currentVersion.split("\\.")
    def major = libVersionArray[0] 
    def minor = libVersionArray[1]
    int patch = libVersionArray[2].toInteger()
    patch = patch + 1
    currentVersion = "${major}.${minor}.${patch}"
    echo "Updated to library version ${currentVersion}"

    jsonContent.put("version", currentVersion)
    //convert maps/arrays to json formatted string
    def json = JsonOutput.toJson(jsonContent)
    json = JsonOutput.prettyPrint(json)
    writeFile(file:"${packageFile}", text: json)

    // Updated file
    def updatedFileContent = readFile "${packageFile}"
    echo "Updated file"
    echo "${updatedFileContent}"

    // Update example app package.json
    def examplePackageFile = "${buildDir}/Example/nativebase-v3-kitchensink/package.json"
    def exampleFileContent = readFile "${examplePackageFile}"
    Map exampleJsonContent = (Map) new JsonSlurper().parseText(exampleFileContent)
    exampleJsonContent.dependencies.put("react-native-acoustic-ea-tealeaf", currentVersion)
    def exampleJson = JsonOutput.toJson(exampleJsonContent)
    exampleJson = JsonOutput.prettyPrint(exampleJson)
    writeFile(file:"${examplePackageFile}", text: exampleJson)
    def updatedExamplePackageFile = readFile "${examplePackageFile}"
    echo "Updated file"
    echo "${updatedExamplePackageFile}"
}

def runCMD(commnd) {
    echo "${commnd}"
    OUUUTTPT = sh (
        script: "#!/bin/bash -l\n ${commnd}",
        returnStdout: true
    ).trim()
    echo "${OUUUTTPT}"
    return OUUUTTPT
}

def cleanMkDir(cmDir) {
    removeDir(cmDir)
    runCMD("mkdir -p ${cmDir}")
}

def removeDir(cmDir) {
    def exists = fileExists "${cmDir}"
    if (exists) {
        runCMD("rm -rf ${cmDir}")
    }
}

// "Checkout repo and also switch to beta branch"
def checkoutRepo() {
    // Setup temp directory for repos for publishing
    echo "Create test push location: ${tempTestDir}"
    cleanMkDir("${tempTestDir}")
    runCMD("cd ${tempTestDir} && git clone git@github.com:aipoweredmarketer/ea_react_native_module_tealeaf.git -b ${srcBranch}")
}

def checkoutReleaseRepo() {
    // Setup temp directory for repos for publishing
    echo "Create test push location: ${tempTestDir}"
    cleanMkDir("${tempTestDir}")
    runCMD("cd ${tempTestDir} && git clone git@github.com:aipoweredmarketer/ea_react_native_module_tealeaf.git -b master")
    runCMD("cd ${tempTestDir} && git clone git@github.com:acoustic-analytics/ea_react_native_module_tealeaf.git -b master")
}

def gitPush(path, commitMsg, tagMsg, branch, commitMsg2) {
    echo "Git Push for: ${path}"
    runCMD('''cd \"''' + path + '''\" && git add . -A''')
    runCMD('''cd \"''' + path + '''\" && git commit -a -m \"''' + commitMsg + '''\" -m \"''' + commitMsg2 + '''\"''')

    // Tag repos
    echo "Tag repos"
    runCMD('''cd \"''' + path + '''\" && git tag -f \"''' + tagMsg + '''\" -m \"''' + commitMsg2 + '''\"''')

    // Pull from git
    echo "Pull from git"
    runCMD('''cd \"''' + path + '''\" && git pull --rebase origin \"''' + branch + '''\"''')

    // Push to git
    echo "Push to git"
    runCMD('''cd \"''' + path + '''\" && git push -f --tags''')
    runCMD('''cd \"''' + path + '''\" && git push -f --set-upstream origin \"''' + branch + '''\"''')
}

// "Update files for beta"
def updateDescription() {
    def commitDesciptionTitle = "Beta ${name} Change Notes:"
    commitDesciption = readFile "latestChanges"
    commitDesciption = "${commitDesciptionTitle} \n" << commitDesciption
    commitDesciption = commitDesciption.replaceAll("\"", "\'")
}

def publishBeta() {
    updateLibVersion()
    
    withCredentials([string(credentialsId: 'NPMJS_TOKEN', variable: 'NPMJS_TOKEN')]) {
        sh 'echo "//registry.npmjs.org/:_authToken=${NPMJS_TOKEN}" >> ~/.npmrc'
        runCMD('''cd \"''' + buildDir + '''\" && npm publish''')
    }

    updateDescription()
    def commitMsg = "Beta ${name} build: ${currentVersion}"
    echo "push with:"
    echo commitMsg
    echo currentVersion
    echo commitDesciption

    // push repos
    gitPush("${buildDir}", commitMsg, currentVersion, srcBranch, commitDesciption)
}

def publishRelease() {
    getLibVersion()

    echo "Clean up directory in public repo"
    runCMD("cd ${releaseDir} && git rm -f -r .")

    echo "Copy over changes from beta to public repo"
    echo "rsync -av --exclude='.git' ${buildDir}/. ${releaseDir}"
    runCMD("rsync -av --exclude='.git' ${buildDir}/. ${releaseDir}")

    runCMD('''cd \"''' + releaseDir + '''\" && git add . -A''')

    sleep 30

    echo "Search and replace text to fix with public name at ea_react_native_module_tealeaf"
    runCMD("cd ${releaseDir} && git grep -l 'https:\\/\\/github.com\\/aipoweredmarketer\\/ea_react_native_module_tealeaf' | xargs sed -i '' -e 's/https:\\/\\/github.com\\/aipoweredmarketer\\/ea_react_native_module_tealeaf/https:\\/\\/github.com\\/acoustic-analytics\\/ea_react_native_module_tealeaf/g'")
    runCMD("cd ${releaseDir} && git grep -l 'ea_react_native_module_tealeaf' | xargs sed -i '' -e 's/ea_react_native_module_tealeaf/ea_react_native_module_tealeaf/g'")
    runCMD("cd ${releaseDir} && git grep -l 'tealeaf' | xargs sed -i '' -e 's/tealeaf/tealeaf/g'")
    runCMD("cd ${releaseDir} && git grep -l '' | xargs sed -i '' -e 's///g'")
    runCMD("cd ${releaseDir} && git grep -l 'react-native-acoustic-ea-tealeaf.podspec' | xargs sed -i '' -e 's/react-native-acoustic-ea-tealeaf.podspec/react-native-acoustic-ea-tealeaf.podspec/g'")
    runCMD("cd ${releaseDir} && git grep -l 'https://raw.githubusercontent.com/acoustic-analytics/Android_Maven/master' | xargs sed -i '' -e 's/https:\\/\\/raw.githubusercontent.com\\/acoustic-analytics\\/Android_Maven\\/beta/https:\\/\\/raw.githubusercontent.com\\/acoustic-analytics\\/Android_Maven\\/master/g'")
    runCMD("cd ${releaseDir} && git grep -l 'TealeafReactNativeDebug' | xargs sed -i '' -e 's/TealeafReactNativeDebug/TealeafReactNativeDebug/g'")
    runCMD("mv ${releaseDir}/react-native-acoustic-ea-tealeaf.podspec  ${releaseDir}/react-native-acoustic-ea-tealeaf.podspec")

    // Update package-lock.json
    def examplePackageFile = "${releaseDir}/package-lock.json"
    def exampleFileContent = readFile "${examplePackageFile}"
    Map exampleJsonContent = (Map) new JsonSlurper().parseText(exampleFileContent)
    exampleJsonContent.put("version", currentVersion)
    key = ''
    exampleJsonContent.packages."$key".put("version", currentVersion)
    def exampleJson = JsonOutput.toJson(exampleJsonContent)
    exampleJson = JsonOutput.prettyPrint(exampleJson)
    writeFile(file:"${examplePackageFile}", text: exampleJson)
    
    withCredentials([string(credentialsId: 'NPMJS_TOKEN', variable: 'NPMJS_TOKEN')]) {
        sh 'echo "//registry.npmjs.org/:_authToken=${NPMJS_TOKEN}" >> ~/.npmrc'
        runCMD('''cd \"''' + releaseDir + '''\" && npm publish''')
    }

    updateDescription()
    def commitMsg = "Release ${name} build: ${currentVersion}"
    echo "push with:"
    echo commitMsg
    echo currentVersion
    echo commitDesciption

    // push repos
    // gitPush("${buildDir}", commitMsg, currentVersion, srcBranch, commitDesciption) - there are no changes.
    gitPush("${releaseDir}", commitMsg, currentVersion, "master", commitDesciption)
}

def populateSlackMessageGlobalVariables() {
    getLastCommitMessage()
    getGitAuthor()
    getLibVersion()
}

def getGitAuthor() {
    def commit = sh(returnStdout: true, script: 'git rev-parse HEAD')
    gitAuthor = sh(returnStdout: true, script: "git --no-pager show -s --format='%an' ${commit}").trim()
}

def getLastCommitMessage() {
    lastCommitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
}

def hasTextBasedOnLastCommit(findText) {
    def resullt
    
    script {
        resullt = sh (script:'''git log -1 | grep -c \"''' + findText + '''\"
              ''', returnStatus: true)
    }
    return resullt
}

def getSlackReport(isRelease) {
    populateSlackMessageGlobalVariables()

    def releaseTitle = ""
    if (isRelease) {
        releaseTitle = "********************Release********************\n"
    }

    echo "currentBuild.result:${currentBuild.result}"

    def buildColor  = "good"
    def jobName     = "${env.JOB_NAME}"
    def buildStatus = "Success"

    if (currentBuild.result != null) {
        buildStatus = currentBuild.result
        if (buildStatus == "FAILURE") {
            failed = 9999
        }
    }

    // Strip the branch name out of the job name (ex: "Job Name/branch1" -> "Job Name")
    // echo "job name::;${jobName}"
    jobName = jobName.getAt(0..(jobName.lastIndexOf('/') - 1))



    if (failed > 0) {
        buildStatus = "Failed"
        buildColor  = "danger"
        def failedTestsString = "No current tests now"//getFailedTests()
    
        notifySlack([
            [
                title: "${jobName}, build #${env.BUILD_NUMBER}",
                title_link: "${env.BUILD_URL}",
                color: "${buildColor}",
                author_name: "${gitAuthor}",
                text: "${releaseTitle}${buildStatus}",
                fields: [
                    [
                        title: "Repo",
                        value: "${name}",
                        short: true
                    ],
                    [
                        title: "Branch",
                        value: "${env.GIT_BRANCH}",
                        short: true
                    ],
                    [
                        title: "Beta build",
                        value: "https://www.npmjs.com/package/react-native-acoustic-ea-tealeaf",
                        short: false
                    ],
                    [
                        title: "Version",
                        value: "${currentVersion}",
                        short: false
                    ],
                    [
                        title: "Test Results",
                        value: "${testSummary}",
                        short: true
                    ],
                    [
                        title: "Code Coverage Results",
                        value: "${coverageSummary}",
                        short: true
                    ],
                    [
                        title: "Lint Results",
                        value: "${lintSummary}",
                        short: true
                    ],
                    [
                        title: "Last Commit",
                        value: "${lastCommitMessage}",
                        short: false
                    ]
                ]
            ],
            [
                title: "Failed Tests",
                color: "${buildColor}",
                text: "${failedTestsString}",
                "mrkdwn_in": ["text"],
            ]
        ], buildColor)          
    } else {
        notifySlack([
            [
                title: "${jobName}, build #${env.BUILD_NUMBER}",
                title_link: "${env.BUILD_URL}",
                color: "${buildColor}",
                author_name: "${gitAuthor}",
                text: "${releaseTitle}${buildStatus}",
                fields: [
                    [
                        title: "Repo",
                        value: "${name}",
                        short: true
                    ],
                    [
                        title: "Branch",
                        value: "${env.GIT_BRANCH}",
                        short: true
                    ],
                    [
                        title: "Beta build",
                        value: "https://www.npmjs.com/package/react-native-acoustic-ea-tealeaf",
                        short: false
                    ],
                    [
                        title: "Version",
                        value: "${currentVersion}",
                        short: false
                    ],
                    [
                        title: "Test Results",
                        value: "${testSummary}",
                        short: true
                    ],
                    [
                        title: "Code Coverage Results",
                        value: "${coverageSummary}",
                        short: true
                    ],
                    [
                        title: "Lint Results",
                        value: "${lintSummary}",
                        short: true
                    ],
                    [
                        title: "Last Commit",
                        value: "${lastCommitMessage}",
                        short: false
                    ]
                ]
            ]
        ], buildColor)
    }
}

def notifySlack(attachments, buildColor) {    
    slackSend attachments: attachments, color: buildColor, channel: '#tl-sdk-github'
    slackSend attachments: attachments, color: buildColor, channel: '#tl-sdk-ci-ios-bender'
    slackSend attachments: attachments, color: buildColor, channel: '#tl-sdk-ci-android-bender'
}

return this


