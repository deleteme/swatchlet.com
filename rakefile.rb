require "sprockets"
require "rubygems"
require "selenium/client"

task :copy_tests do
  sh 'rm -R public/tests'
  sh 'cp -R tests/ public/tests'
end

task :copy_selenium do
  sh 'rm -R public/core'
  sh 'cp -R vendor/selenium-core/src/main/resources/core/ public/core'
end

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


task :start_server do
  sh 'java -jar "vendor/selenium-server-1.0-beta-2/selenium-server.jar" -interactive'
end

task :test_swatchlet do

  # begin
  #   @browser = Selenium::Client::Driver.new("localhost", 4444, "*firefox", "http://www.google.com", 10000);
  #   @browser.start_new_browser_session
  #   @browser.open "/"
  #   @browser.type "q", "Selenium"
  #   @browser.click "btnG", :wait_for => :page
  #   puts @browser.text?("selenium.openqa.org")
  # ensure
  #   @browser.close_current_browser_session
  # end
  
  
  
  begin
    @selenium = Selenium::Client::Driver.new("localhost", 4444, "*firefox", "http://swatchlet.com", 10000);
    @selenium.start_new_browser_session
    # @selenium.open "/"
  
    @selenium.click "add"
    sleep 0.5
    begin
        assert @selenium.is_visible("colorpicker")
    # rescue Test::Unit::AssertionFailedError
    #     @verification_errors << $!
    end
    @selenium.type "cp1_Hex", ""
    @selenium.type_keys "cp1_Hex", "F91616"
    @selenium.key_up "cp1_Hex", "6"
    sleep 0.2
    @selenium.click "cp_ok"
    sleep 0.500
    begin
        assert !@selenium.is_visible("colorpicker")
    # rescue Test::Unit::AssertionFailedError
    #     @verification_errors << $!
    end
    begin
        assert_equal "#F91616xeditmove", @selenium.get_text("//div[@id='stage']/div")
    # rescue Test::Unit::AssertionFailedError
    #     @verification_errors << $!
    end
    @selenium.click_at "link=x", "1,1"
    sleep 0.500
    begin
        assert !@selenium.is_text_present("//div[@id='stage']/div")
    # rescue Test::Unit::AssertionFailedError
    #     @verification_errors << $!
    end
  ensure
    @selenium.close_current_browser_session
  end
  
  
  
  
end

# require 'selenium/rake/tasks'


# task :start_test_server do
#   Selenium::Rake::RemoteControlStartTask.new do |rc|
#     rc.port = 4444
#     rc.timeout_in_seconds = 3 * 60
#     rc.background = true
#     rc.wait_until_up_and_running = true
#     rc.jar_file = "/vendor/selenium-server-1.0-beta-2/selenium-server.jar"
#     rc.additional_args << "-singleWindow"
#   end
# end

# task :stop_test_server do
#   Selenium::Rake::RemoteControlStopTask.new do |rc|
#     rc.host = "localhost"
#     rc.port = 4444
#     rc.timeout_in_seconds = 3 * 60
#   end
# end