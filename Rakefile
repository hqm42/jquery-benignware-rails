require "bundler/gem_tasks"

task :update do
  sh 'git submodule update --init' unless File.exist?('checkview/README.md')
end

desc "Remove the vendor directory"
task :clean do
  rm_rf 'vendor'
end

desc "Generate the JavaScript assets"
task :assets => :update do
  target_dir = "vendor/assets/javascripts/benignware"
  
  mkdir_p target_dir
  
  Dir.glob("checkview/src/js/*.js").each do |path|
    basename = File.basename(path)
    Rake.rake_output_message 'asset ' + basename
    File.open("#{target_dir}/#{basename}", "w") do |out|
      out.write("\n")
      source_code = File.read(path)
      out.write(source_code)
    end
  end
end


desc 'Builds the gem'
task :build => [:clean, :assets] do
  sh "gem build benignware-jquery-rails.gemspec"
end

desc 'Tags version, pushes to remote, and pushes gem'
task :release => :build do
  sh "gem push benignware-jquery-rails-#{Benignware::Jquery::Rails::VERSION}.gem"
end

task :default => :build