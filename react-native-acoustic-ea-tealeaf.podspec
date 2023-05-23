require 'json'
package = JSON.parse(File.read('package.json'))
teaLeafConfig = JSON.parse(File.read('../../TealeafConfig.json'))
repository = package["repository"]["url"]
useRelease = teaLeafConfig["Tealeaf"]["useRelease"]
dependencyName = useRelease ? 'TealeafReactNative' : 'TealeafReactNativeDebug'
iOSVersion = teaLeafConfig["Tealeaf"]["iOSVersion"]
dependencyVersion = iOSVersion.to_s.empty? ? "" : ", '#{iOSVersion}'"

puts "*********react-native-acoustic-ea-tealeaf.podspec*********"
puts "teaLeafConfig:"
puts JSON.pretty_generate(teaLeafConfig)
puts "repository:#{repository}"
puts "useRelease:#{useRelease}"
puts "dependencyName:#{dependencyName}"
puts "dependencyVersion:#{dependencyVersion}"
puts "tlDependency:#{dependencyName}#{dependencyVersion}"
puts "***************************************************************"

Pod::Spec.new do |s|
  s.name           = package["name"]
  s.version        = package["version"]
  s.description    = package["description"]
  s.homepage       = package["homepage"]
  s.summary        = package["summary"]
  s.license        = package["license"]
  s.authors        = package["author"]
  s.platforms      = { :ios => "12.0" }
  
  s.source         = { :git => repository, :tag => s.version }
  s.preserve_paths = 'README.md', 'package.json', '*.js'
  s.source_files   = "ios/**/*.{h,m}"
  
  s.dependency       'React'
  s.xcconfig       = { 'HEADER_SEARCH_PATHS' => '../../../ios/Pods/** ' }
  s.dependency       "#{dependencyName}#{dependencyVersion}"
  s.script_phase = {
    name: 'Build Config',
    script: %(
      "${PODS_TARGET_SRCROOT}/ios/TealeafConfig/Build_Config.rb" "$PODS_ROOT" "TealeafConfig.json"
    ), 
    execution_position: :before_compile,
  }
end