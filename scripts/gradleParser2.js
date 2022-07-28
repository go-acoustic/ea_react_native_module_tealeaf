const fs = require('fs');

const path = require('path')


const { exit } = require('process');

const { isValid } = require('./util');

const directoryPath = path.join(__dirname,"..","..","..")

if(!isValid(`${directoryPath}/android`)){
  exit(0)
}

const gradleCode = `mavenLocal()
        maven {
            // All of Tealeaf SDK libraries
                        url "https://raw.githubusercontent.com/acoustic-analytics/Android_Maven/master"
        }`

let gradleData = ''
const filePath = `${directoryPath}/android/build.gradle`
try {
    gradleData = fs.readFileSync(filePath, 'utf8');
    const re = new RegExp(/acoustic-analytics/, "g");
    const found = re.test(gradleData);
    if(!found){
        gradleData = gradleData.replace("mavenLocal()",gradleCode)
        fs.writeFileSync(filePath, gradleData);
    }
  
} catch (err) {
  console.error(err);
}