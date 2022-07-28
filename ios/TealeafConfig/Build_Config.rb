#!/usr/bin/env ruby
require 'json'

#--------------------------------------------------------------------------------------------
# Copyright (C) 2022 Acoustic, L.P. All rights reserved.
#
# NOTICE: This file contains material that is confidential and proprietary to
# Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
# industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
# Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
# prohibited.
#--------------------------------------------------------------------------------------------
  
pods_root = ARGV[0]
config_file = ARGV[1]
$useRelease = false
$dependencyName = "TealeafReactNativeDebug"
$podFolder = "DebugTealeafReactNative"

def update_config(module_name, key, value)
    
    if value.class.eql?("Hash") || !module_name.eql?("Tealeaf")
        return false
    end
    
    plist_path = "#{ARGV[0]}/#{$dependencyName}/SDKs/iOS/#{$podFolder}/TLFResources.bundle/TealeafBasicConfig.plist"
    
    if File.exist?(plist_path)
        `/usr/libexec/PlistBuddy -c \"Set :#{key} #{value}" #{plist_path}`
    end
end

def update_layout(jsonData)
    tealeafConfigOverride = jsonData["Tealeaf"]["layoutConfig"]

    path = "../../ios/Pods/#{$dependencyName}/SDKs/iOS/#{$podFolder}/TLFResources.bundle/TealeafLayoutConfig.json"
    puts "Has new layoutConfig:#{tealeafConfigOverride}, then update TealeafLayoutConfig.json at #{path}"
    
    if(tealeafConfigOverride)
      tealeafConfigOverrideJson = JSON.generate(tealeafConfigOverride)
      File.write(path,tealeafConfigOverrideJson)
      puts JSON.pretty_generate(tealeafConfigOverrideJson)
    end
end

begin 
    config_path = "#{pods_root}/../../#{config_file}"
    if File.exist?(config_path)
        json = JSON.parse(File.read(config_path))
    else
        exit
    end

    $useRelease = json["Tealeaf"]["useRelease"]
    $dependencyName = $useRelease ? "TealeafReactNative" : $dependencyName

    json.map do |module_name, value|
        if value.class.eql?("Hash")
            next
        end
        
        value.map do |config|
            config_key, config_value = config
            update_config(module_name, config_key, config_value)
        end
    end

    update_layout(json)
    
    rescue Errno::ENOENT
        exit
end
