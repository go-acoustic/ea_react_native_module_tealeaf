
const fs = require('fs');
const path = require('path');

const { exit } = require('process');

const { isValid } = require('./util');

const directoryPath = path.join(__dirname,"..","..","..")

if(!isValid(`${directoryPath}/android`)){
  exit(0)
}

const gradleCode = `apply from: project(':react-native-acoustic-ea-tealeaf').projectDir.getPath() + "/config.gradle"`

let gradleData = '';
try {
  const filePath = `${directoryPath}/android/app/build.gradle`
    gradleData = fs.readFileSync(filePath, 'utf8');
    const re = new RegExp(/react-native-acoustic-ea-tealeaf/, "g");
    const found = re.test(gradleData);
    if(!found){
        gradleData = `${gradleData}\n${gradleCode}\n`
        fs.writeFileSync(filePath, gradleData);
    }
  
} catch (err) {
  console.error(err);
}








