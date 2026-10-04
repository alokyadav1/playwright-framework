Feature: Checkout Page Functionality

  Background:
    Given User is on the home page

  @checkout @severity:critical
  Scenario: CHK_1 - Verify logged in user can navigate to checkout and open shipping method
    When User logs in using email "checkoutEmail" and password "validPassword"
    And User adds product "plpProductName" to cart if cart is empty
    And User navigates to checkout page
    Then Checkout page should be displayed
    When User opens shipping method section
    And User clicks on Continue to Payment button
    Then Payment section should be expanded
