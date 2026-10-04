Feature: Place Order Functionality

  Background:
    Given User is on the home page

  @placeOrder @severity:critical
  Scenario: PLO_1 - Verify logged in user is able to place order using credit card
    When User logs in using email "placeOrderEmail" and password "validPassword"
    And User adds product "productName" to cart if cart is empty
    And User navigates to checkout page
    And User opens shipping method section
    And User clicks on Continue to Payment button
    Then Payment section should be expanded
    When User authorizes payment using credit card "creditCardData"
    And User clicks on Place Order button
    Then Order confirmation page should be displayed
