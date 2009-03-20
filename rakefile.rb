require "sprockets"

task :build do
  secretary = Sprockets::Secretary.new(
    :asset_root   => "public",
    :load_path    => ["vendor/sprockets/*/src", "vendor/prototype/dist", "vendor/scriptaculous/src", "vendor/plugins/*/javascripts"],
    :source_files => ["public/javascripts/document.js", "public/javascripts/**/*.js"]
  )
  
  # Generate a Sprockets::Concatenation object from the source files
  concatenation = secretary.concatenation
  
  # Write the concatenation to disk
  concatenation.save_to("public/javascripts/application.js")
  
  # Install provided assets into the asset root
  secretary.install_assets
end
