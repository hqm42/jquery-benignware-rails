# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'benignware-jquery-rails/version'

Gem::Specification.new do |gem|
  gem.name          = "benignware-jquery-rails"
  gem.version       = Benignware::Jquery::Rails::VERSION
  gem.authors       = ["rexblack"]
  gem.email         = ["mail@benignware.com"]
  gem.description   = %q{gem description}
  gem.summary       = %q{gem summary}
  gem.homepage      = ""

  #gem.add_dependency "railties", ">= 3.2.0", "< 5.0"
  
  gem.files         = `git ls-files`.split($/)
  gem.files         = Dir["{lib,vendor}/**/*"]
  
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
