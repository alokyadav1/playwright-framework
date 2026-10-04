Feature: End To End E-Commerce Flow

  @e2e @severity:critical
  Scenario: E2E_1 - Complete E2E flow from Login to Order Placement
    Given User is on the home page
    When User navigates to sign in page
    And User enters email "loginEmail" in Username field
    And User clicks on Continue button
    Then User is navigated to the Password page
    When User enters password "validPassword" in Password field
    And User clicks on Sign In button
    Then User welcome message "welcomeMsg" should be visible
    When User searches for product "productName"
    And User selects product "productName" from PLP
    Then User is on PDP for product "productName"
    When User clicks on Add To Cart button
    Then Add to cart success message should be displayed
    When User navigates to cart page
    Then Cart items details should be visible
    When User clicks on Checkout button
    Then Checkout page should be displayed
    When User opens shipping method section
    And User clicks on Continue to Payment button
    Then Payment section should be expanded
    When User authorizes payment using credit card "creditCardData"
    And User clicks on Place Order button
    Then Order confirmation page should be displayed
