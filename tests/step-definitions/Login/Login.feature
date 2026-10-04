Feature: Login Functionality

  Background:
    Given User is on the home page

  @login @severity:critical
  Scenario: LGN_1 - Verify user sign in with valid credentials
    When User navigates to sign in page
    And User enters email "loginEmail" in Username field
    And User clicks on Continue button
    Then User is navigated to the Password page
    When User enters password "validPassword" in Password field
    And User clicks on Sign In button
    Then User welcome message "welcomeMsg" should be visible
