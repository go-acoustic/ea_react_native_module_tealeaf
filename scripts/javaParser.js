const prettier = require("prettier");
const fs = require("fs");
const path = require("path");
const javaPaserPlugin = require("prettier-plugin-java");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const { exit } = require("process");

const { isValid } = require('./util');

const directoryPath = path.join(__dirname, "..", "..", "..");

if (!isValid(`${directoryPath}/android`)) {
  exit(0);
}

const xmlFilePath = `${directoryPath}/android/app/src/main/AndroidManifest.xml`;

const options = {
  ignoreAttributes: false,
  format: true,
  preserveOrder: false,
};

const parser = new XMLParser(options);

let xmlData = "";
try {
  xmlData = fs.readFileSync(xmlFilePath, "utf8");
} catch (err) {
  console.error(err);
}

const jsonObj = parser.parse(xmlData);

const packageName = jsonObj["manifest"]["@_package"];

const upperJavaPath = packageName.replace(/\./g, "/");

const upperJavaCode =  `package ${packageName};`;

const filePath = `${directoryPath}/android/app/src/main/java/${upperJavaPath}/MainActivity.java`;

let javaData = "";
try {
  javaData = fs.readFileSync(filePath, "utf8");
} catch (err) {
  console.error(err);
}

const javaCode = `public boolean dispatchTouchEvent(MotionEvent e) {
                    Tealeaf.dispatchTouchEvent(this, e);
                    return super.dispatchTouchEvent(e);
                }`;


const javaCode2 =`${upperJavaCode}\nimport com.tl.uic.Tealeaf;`

const re = new RegExp(/dispatchTouchEvent/, "g");

const re2 = new RegExp("import com.tl.uic.Tealeaf", "g");

const found = re.test(javaData);

if (!found) {
  let result = prettier.format(javaData, {
    parser: "java",
    plugins: [javaPaserPlugin],
    tabWidth: 2,
  });

  result = `${result.substring(0, result.length - 2)}${javaCode} }`;


  const found2 = re2.test(result);

  if(!found2){
    result = result.replace(upperJavaCode,javaCode2); 
  }


  result = prettier.format(result, {
    parser: "java",
    plugins: [javaPaserPlugin],
    tabWidth: 2,
  });

  try {
    fs.writeFileSync(filePath, result);
  } catch (err) {
    console.error(err);
  }
}
