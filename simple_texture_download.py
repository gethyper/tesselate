#!/usr/bin/env python3

import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_driver():
    """Setup Chrome driver for texture browsing"""
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Set download directory
    download_dir = os.path.join(os.getcwd(), "src", "assets", "textures")
    os.makedirs(download_dir, exist_ok=True)
    
    prefs = {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    # Don't run headless so you can see what's happening
    # chrome_options.add_argument("--headless")
    
    return webdriver.Chrome(options=chrome_options)

def main():
    print("🚀 Opening TextureLabs for manual texture download...")
    print("📋 This will open the page and keep it open for you to download manually")
    
    driver = setup_driver()
    download_dir = os.path.join(os.getcwd(), "src", "assets", "textures")
    
    try:
        print("🌐 Loading TextureLabs page...")
        driver.get("https://texturelabs.org/?ct=665&st=800")
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        print("\n📋 MANUAL DOWNLOAD INSTRUCTIONS:")
        print("="*50)
        print("1. The TextureLabs page is now open in your browser")
        print("2. For each texture on the page:")
        print("   - Click on the texture thumbnail")
        print("   - Click 'Download Small' (usually around 960px)")
        print("   - Save with these exact names:")
        print()
        
        textures = [
            "grunge_135.jpg", "paper_164.jpg", "paper_124.jpg", "grunge_267.jpg",
            "grunge_127.jpg", "paper_313.jpg", "grunge_340.jpg", "lensfx_213.jpg",
            "fabric_178.jpg", "paper_207.jpg", "paper_174.jpg", "paper_237.jpg",
            "sky_145.jpg", "film_181.jpg", "inkpaint_182.png", "film_146.jpg",
            "paper_361.jpg", "fabric_124.jpg", "metal_244.jpg", "paper_320.jpg",
            "film_120.jpg", "lensfx_191.jpg", "grunge_318.jpg", "metal_232.jpg"
        ]
        
        for i, filename in enumerate(textures, 1):
            print(f"   {i:2d}. {filename}")
        
        print()
        print(f"3. Save all files to: {download_dir}")
        print("4. When done, press Ctrl+C here to close browser")
        print("5. Then run: node generate_texture_index.js")
        print("="*50)
        
        # Keep the browser open
        try:
            while True:
                time.sleep(5)
                # Check if any files have been downloaded
                downloaded_files = [f for f in os.listdir(download_dir) if f.endswith(('.jpg', '.png'))]
                if downloaded_files:
                    print(f"✅ Found {len(downloaded_files)} downloaded files: {', '.join(downloaded_files[:3])}{'...' if len(downloaded_files) > 3 else ''}")
        
        except KeyboardInterrupt:
            print("\n👋 Closing browser...")
            
    except Exception as e:
        print(f"💥 Error: {e}")
        
    finally:
        driver.quit()
        
        # Check final results
        downloaded_files = [f for f in os.listdir(download_dir) if f.endswith(('.jpg', '.png'))]
        print(f"\n📊 Final count: {len(downloaded_files)} files downloaded")
        
        if len(downloaded_files) > 0:
            print("🔧 Run this next: node generate_texture_index.js")

if __name__ == "__main__":
    main()