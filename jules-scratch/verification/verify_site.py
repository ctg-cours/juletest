from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Get the absolute path to the index.html file
    file_path = os.path.abspath('index.html')

    # Navigate to the local HTML file
    page.goto(f'file://{file_path}')

    # Wait for the page to load completely (optional, but good practice)
    page.wait_for_load_state('networkidle')

    # Take a screenshot
    page.screenshot(path='jules-scratch/verification/verification.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
