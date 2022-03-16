require 'json'
package = JSON.parse(File.read('package.json'))
repository = package["repository"]["url"]

Pod::Spec.new do |s|
  s.name           = package["name"]
  s.version        = package["version"]
  s.description    = package["description"]
  s.homepage       = package["homepage"]
  s.summary        = package["summary"]
  s.license        = package["license"]
  s.authors        = package["author"]
  s.platforms      = { :ios => "10.0" }
  
  s.source         = { :git => repository, :tag => s.version }
  s.preserve_paths = 'README.md', 'package.json', '*.js'
  s.source_files   = "ios/**/*.{h,m}"
  
  s.dependency        'React'
  s.xcconfig       = { 'HEADER_SEARCH_PATHS' => '../../../ios/Pods/** ' }
  s.dependency 'TealeafReactNativeDebug', '10.6.156'
end
