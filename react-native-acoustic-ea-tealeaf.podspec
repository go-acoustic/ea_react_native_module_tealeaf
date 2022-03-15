require 'json'
package = JSON.parse(File.read('package.json'))
repository = package["repository"]["url"]

Pod::Spec.new do |s|
  s.name		       = package["name"]
  s.version	       = package["version"]
  s.description    = package["description"]
  s.homepage       = package["homepage"]
  s.summary        = package["summary"]
  s.license        = package["license"]
  s.authors        = package["author"]
  s.platforms      = { :ios => "9.0" }
  
  s.source         = { :git => repository, :tag => s.version }
  s.preserve_paths = 'README.md', 'package.json', '*.js'
  s.source_files   = "ios/**/*.{h,m}"
  
  s.dependency        'React'
  s.xcconfig       = { 'HEADER_SEARCH_PATHS' => '../../../ios/Pods/** ' }
	
  s.default_subspec = 'Core'
  s.subspec 'Core' do |core|
	  core.frameworks = 'SystemConfiguration', 'CoreTelephony', 'CoreLocation', 'WebKit'
	  core.library = 'z'
	  core.resource = "ios/Tealeaf/TLFResources.bundle"
	  core.xcconfig = { 'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/react-native-acoustic-ea-tealeaf/Tealeaf/TealeafReactNative.xcframework/*/Tealeaf.framework/Headers/"/**' }
	  core.vendored_frameworks = 'ios/Tealeaf/TealeafReactNative.xcframework'
	  core.dependency 'EOCore', '2.3.185'
  end
end