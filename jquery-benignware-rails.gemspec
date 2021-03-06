# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'jquery-benignware-rails/version'

Gem::Specification.new do |gem|
  gem.name          = "jquery-benignware-rails"
  gem.version       = Jquery::Benignware::Rails::VERSION
  gem.authors       = ["rexblack"]
  gem.email         = ["mail@benignware.com"]
  gem.description   = %q{gem description}
  gem.summary       = %q{gem summary}
  gem.homepage      = ""

  gem.add_dependency "railties", ">= 3.2.0", "< 5.0"
  
  gem.files         = `git ls-files`.split($/)
  
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
