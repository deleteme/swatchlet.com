require "selenium"
require "test/unit"

class NewTest < Test::Unit::TestCase
  def setup
    @verification_errors = []
    if $selenium
      @selenium = $selenium
    else
      @selenium = Selenium::SeleniumDriver.new("localhost", 4444, "*chrome", "http://change-this-to-the-site-you-are-testing/", 10000);
      @selenium.start
    end
    @selenium.set_context("test_new")
  end
  
  def teardown
    @selenium.stop unless $selenium
    assert_equal [], @verification_errors
  end
  
  def test_new
    @selenium.drag_and_drop_to_object "//div[@id='stage']/div[2]/ul/li[3]/a", "//div[@id='stage']/div[1]/ul/li[3]/a"
    begin
        assert_equal "#184B54", @selenium.get_text("//div[@id='stage']/div[1]/strong")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
    begin
        assert_equal "#87F5FF", @selenium.get_text("//div[@id='stage']/div[2]/strong")
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
  end
end
