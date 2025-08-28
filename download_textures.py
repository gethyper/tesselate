#!/usr/bin/env python3

import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urljoin
import re

def setup_driver():
    """Setup Chrome driver with download preferences"""
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Set download directory
    download_dir = os.path.join(os.getcwd(), "src", "assets", "textures")
    os.makedirs(download_dir, exist_ok=True)
    
    prefs = {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    return webdriver.Chrome(options=chrome_options)

def download_texture_direct(url, filename, download_dir):
    """Download texture directly using requests"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        filepath = os.path.join(download_dir, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return False

def main():
    print("🚀 Starting texture download from TextureLabs...")
    
    driver = setup_driver()
    download_dir = os.path.join(os.getcwd(), "src", "assets", "textures")
    
    # Texture mappings from the website analysis
    textures = [
        ("grunge_135", "Grunge 135"),
        ("paper_164", "Paper 164"),
        ("paper_124", "Paper 124"),
        ("grunge_267", "Grunge 267"),
        ("grunge_127", "Grunge 127"),
        ("paper_313", "Paper 313"),
        ("grunge_340", "Grunge 340"),
        ("lensfx_213", "LensFX 213"),
        ("fabric_178", "Fabric 178"),
        ("paper_207", "Paper 207"),
        ("paper_174", "Paper 174"),
        ("paper_237", "Paper 237"),
        ("sky_145", "Sky 145"),
        ("film_181", "Film 181"),
        ("inkpaint_182", "InkPaint 182"),
        ("film_146", "Film 146"),
        ("paper_361", "Paper 361"),
        ("fabric_124", "Fabric 124"),
        ("metal_244", "Metal 244"),
        ("paper_320", "Paper 320"),
        ("film_120", "Film 120"),
        ("lensfx_191", "LensFX 191"),
        ("grunge_318", "Grunge 318"),
        ("metal_232", "Metal 232")
    ]
    
    try:
        print("🌐 Loading TextureLabs page...")
        driver.get("https://texturelabs.org/?ct=665&st=800")
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        time.sleep(3)  # Let page fully load
        
        successful_downloads = 0
        
        for filename, display_name in textures:
            print(f"🔍 Looking for {display_name}...")
            
            try:
                # Find all texture links on the page
                links = driver.find_elements(By.TAG_NAME, "a")
                
                for link in links:
                    link_text = link.text.strip()
                    if display_name.lower() in link_text.lower():
                        # Found the texture, look for small download link
                        href = link.get_attribute("href")
                        if href:
                            print(f"📍 Found texture link: {href}")
                            
                            # Try to navigate to texture page and find small download
                            driver.execute_script("window.open('');")
                            driver.switch_to.window(driver.window_handles[-1])
                            
                            try:
                                driver.get(href)
                                time.sleep(2)
                                
                                # Look for "small" download link
                                small_links = driver.find_elements(By.PARTIAL_LINK_TEXT, "small")
                                if not small_links:
                                    small_links = driver.find_elements(By.PARTIAL_LINK_TEXT, "Small")
                                
                                if small_links:
                                    download_url = small_links[0].get_attribute("href")
                                    print(f"📥 Found small download: {download_url}")
                                    
                                    # Determine file extension
                                    extension = ".png" if "inkpaint" in filename.lower() else ".jpg"
                                    full_filename = f"{filename}{extension}"
                                    
                                    # Download directly
                                    if download_texture_direct(download_url, full_filename, download_dir):
                                        successful_downloads += 1
                                        
                                else:
                                    print(f"⚠️  Could not find small download link for {display_name}")
                                    
                            except Exception as e:
                                print(f"❌ Error processing {display_name}: {e}")
                            
                            finally:
                                # Close the tab and return to main page
                                driver.close()
                                driver.switch_to.window(driver.window_handles[0])
                            
                            break
                else:
                    print(f"❌ Could not find {display_name} on the page")
                
                # Small delay between downloads
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Error with {display_name}: {e}")
                continue
        
        print(f"\n🎉 Download complete! Successfully downloaded {successful_downloads}/{len(textures)} textures")
        
        if successful_downloads > 0:
            print("\n🔧 Now run: node generate_texture_index.js")
        
    except Exception as e:
        print(f"💥 Script failed: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()