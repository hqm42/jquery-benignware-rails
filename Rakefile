require "bundler/gem_tasks"

task :update do
  Rake.rake_output_message 'update modules'
  sh 'git submodule foreach git pull origin master'  
end

desc "Remove the vendor directory"
task :clean do
  rm_rf 'vendor'
end

desc "Generate the JavaScript assets"
task :assets do
  
  
  js_dir = "vendor/assets/javascripts/benignware"
  mkdir_p js_dir
  
  Dir.glob("submodules/*/dist/js/*.js").each do |path|
    basename = File.basename(path)
    Rake.rake_output_message 'asset ' + basename
    File.open("#{js_dir}/#{basename}", "w") do |out|
      out.write("\n")
      source_code = File.read(path)
      out.write(source_code)
    end
  end
  
  css_dir = "vendor/assets/stylesheets/benignware"
  mkdir_p css_dir
  
  Dir.glob("submodules/*/dist/css/*.css").each do |path|
    basename = File.basename(path)
    Rake.rake_output_message 'asset ' + basename
    File.open("#{css_dir}/#{basename}", "w") do |out|
      out.write("\n")
      source_code = File.read(path)
      out.write(source_code)
    end
  end
  
end


# desc 'Builds the gem'
# task :build => [:update, :clean, :assets] do
  # sh "gem build jquery-benignware-rails.gemspec"
# end


#task :default => :build