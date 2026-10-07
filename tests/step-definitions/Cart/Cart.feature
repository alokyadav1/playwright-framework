Feature: Cart Page Functionality

  Background:
    Given User is on the home page

  @cart @severity:critical
  Scenario: CRT_1 - Verify product details in cart and proceed to checkout
    When User logs in using email "cartEmail" and password "validPassword"
    And User adds product "productName" to cart if cart is empty
    And User navigates to cart page
    Then Cart items details should be visible
    When User clicks on Checkout button
    Then User should be navigated to checkout page

  @cart @severity:critical @only
  Scenario: CRT_2 - Verify product details in cart and proceed to checkout
    When User logs in using email "loginEmail" and password "validPassword"
    And User adds product "productName" to cart if cart is empty
    And User navigates to cart page
    Then Cart items details should be visible

  @cart @severity:critical
  Scenario: CRT_3 - Verify product details in cart and proceed to checkout
    When User logs in using email "cartEmail" and password "validPassword"
    And User adds product "productName" to cart if cart is empty
    And User navigates to cart page
    Then Cart items details should be visible
    When User clicks on Checkout button
    Then User should be navigated to checkout page

  @cart @severity:critical
  Scenario: CRT_4 - Verify product details in cart and proceed to checkout
    When User logs in using email "loginEmail" and password "validPassword"
    And User adds product "productName" to cart if cart is empty
    And User navigates to cart page
    Then Cart items details should be visible
