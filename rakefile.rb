require "sprockets"

task :build => [:copy_tests, :copy_selenium] do
  if File.exists?('public/javascripts/application.js')
    File.delete('public/javascripts/application.js')
  end
  secretary = Sprockets::Secretary.new(
    :asset_root   => "public",
    :load_path    => ["constants.yml", "vendor/sprockets/*/src", "vendor/prototype/dist", "vendor/scriptaculous/src", "vendor/colorpicker", "vendor/plugins/*/javascripts"],
    :source_files => ["public/javascripts/document.js", "public/javascripts/**/*.js"]
  )
  
  # Generate a Sprockets::Concatenation object from the source files
  concatenation = secretary.concatenation
  
  # Write the concatenation to disk
  concatenation.save_to("public/javascripts/application.js")
  
  # Install provided assets into the asset root
  secretary.install_assets
end

task :copy_tests do
  sh 'cp -R tests/ public/tests'
end

task :copy_selenium do
  sh 'cp -R vendor/selenium-core/src/main/resources/core/ public/core'
end

