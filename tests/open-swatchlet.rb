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
    @selenium.open "http://swatchlet.com"
    begin
        assert_equal "swatchlet.com : share colors and color swatches easily.", @selenium.get_title
    rescue Test::Unit::AssertionFailedError
        @verification_errors << $!
    end
  end
end
