/********************************************************************************************
* Copyright (C) 2023 Acoustic, L.P. All rights reserved.
*
* NOTICE: This file contains material that is confidential and proprietary to
* Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
* industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
* Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
* prohibited.
********************************************************************************************/

/**
 * Used review TealeafConfig.json is present ot will need to add one.
 */
const fs = require('fs');
const filePathBaseTealeafConfig = "../../TealeafConfig.json"
const filePathTemplateTealeafConfig = "scripts/TealeafConfig.json"

if (fs.existsSync(filePathBaseTealeafConfig)) {
    console.log("TealeafConfig found in your project. You are ready to go!");
} else {
    console.log("TealeafConfig not found in your project. I will add one.");
    fs.copyFile(filePathTemplateTealeafConfig, filePathBaseTealeafConfig, (err) => {
      if (err) throw err;
      console.log(filePathTemplateTealeafConfig + ' was copied to ' + filePathBaseTealeafConfig);
    });
}