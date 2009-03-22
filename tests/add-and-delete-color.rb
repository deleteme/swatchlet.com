require "selenium"
require "test/unit"

class NewTest < Test::Unit::TestCase
  def setup
    @verification_errors = []
    if $selenium
      @selenium = $selenium
    else
      @selenium = Selenium::SeleniumDriver.new("localhost", 4444, "*firefox", "http://swatchlet.com", 10000);
      @selenium.start
    end
    @selenium.set_context("test_new")
  end
  
  def teardown
    @selenium.stop unless $selenium
    assert_equal [], @verification_errors
  end
  
  def test_new
    @selenium.click "add"
    sleep 500
    begin
        assert @selenium.is_visible("colorpicker")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
    @selenium.type "cp1_Hex", ""
    @selenium.type_keys "cp1_Hex", "F91616"
    @selenium.key_up "cp1_Hex", "6"
    sleep 200
    @selenium.click "cp_ok"
    sleep 500
    begin
        assert !@selenium.is_visible("colorpicker")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
    begin
        assert_equal "#F91616xeditmove", @selenium.get_text("//div[@id='stage']/div")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
    @selenium.click_at "link=x", "1,1"
    sleep 500
    begin
        assert !@selenium.is_text_present("//div[@id='stage']/div")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
  end
end
