import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import argparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import csv



def urls_contents_scrap(url):
    print(f"Scraping URL: {url}")
    
    # Send GET request to the URL
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }
    
    # Send GET request with headers
    response = requests.get(url, headers=headers)
    time.sleep(20)

    if response.status_code == 403:
        print("Access forbidden, 403 error.")
        return []
    

    soup = BeautifulSoup(response.content, 'html.parser')
    print(soup)
    live = []
    scraped_titles = set()
    scraped_dates = set()
    # Find the section containing the event data
    main_container = soup.findAll('section',{'class': 'tribe-events-pg-template'})
    #print(main_container)

    for container in main_container:
        try:
            # Scrape the title
            title_elem = container.find(class_='tribe-events-single-event-title')
            title_text = title_elem.text.strip() if title_elem else 'not found'

            
            # Scrape the description
            des_elem = container.find(class_='tribe-events-single-event-description tribe-events-content')
            des_text = des_elem.text.strip() if des_elem else 'Description not found'

            # Scrape the image source
            image_elem = container.find(class_='wp-post-image')
            #print(f"image class name : {image_elem}")
            image_src = image_elem['src'] if image_elem and image_elem.get('src') else 'Images not found'

            # Scrape the date
            date_elem = container.find(class_='tribe-events-schedule tribe-clearfix')
            date = date_elem.text.strip() if date_elem else 'date not found'
            
            if title_text in scraped_titles and date in scraped_dates:
                continue  # Skip only if both title and date are duplicates

            # Scrape detailed date
            detail_date = container.find(class_='tribe-events-abbr tribe-events-start-date published dtstart')
            detail_date_text = detail_date.text.strip() if detail_date else 'Details Date not found'

            # Scrape detailed time
            detail_time = container.find(class_='tribe-events-abbr tribe-events-start-time published dtstart')
            detail_time_text = detail_time.text.strip() if detail_time else 'Detail time not found'

            # Scrape cost
            detail_cost = container.find(class_='tribe-events-event-cost')
            detail_cost_text = detail_cost.text.strip() if detail_cost else 'Detail cost not found'

            # Scrape event category
            detail_event_category = container.find(class_='tribe-events-event-categories')
            #detail_event_category_url = detail_event_category.text.strip() if detail_event_category else 'Detail event category not found'
            detail_event_category_url = detail_event_category.find('a')['href'] if detail_event_category and detail_event_category.find('a') else 'Details website link not found'

            # Scrape website URL
            detail_website = container.find('dd', class_='tribe-events-event-url')
            detail_website_url = detail_website.find('a')['href'] if detail_website and detail_website.find('a') else 'Details website link not found'

            # Scrape organizer details
            organizer_name = container.find(class_='tribe-organizer')
            organizer_name_text = organizer_name.text.strip() if organizer_name else 'Organizer name not found'

            organizer_name_link = container.find('dd', class_='tribe-organizer')
            organizer_name_link_url = organizer_name_link.find('a')['href'] if organizer_name_link and organizer_name_link.find('a') else 'Organizer name link not found'


            
            organizer_email = container.find(class_='tribe-organizer-email')
            organizer_email_text = organizer_email.text.strip() if organizer_email else 'Organizer email not found'

            organizer_website = container.find('dd' , class_='tribe-organizer-url')
            organizer_website_urls = organizer_website.find('a')['href'] if organizer_website and organizer_website.find('a') else 'Organizer website not found'
            #organizer_website_urls = organizer_website['href'] if organizer_website and organizer_website.get('href') else 'Organizer website not found'

            # Scrape venue details
            venue_galary_link = container.find('dd',class_='tribe-venue')
            venue_galary_link_urls = venue_galary_link.find('a')['href'] if venue_galary_link and venue_galary_link.find('a') else 'Venue gallery website not found'
            #venue_galary_link_urls = venue_galary_link['href'] if venue_galary_link and venue_galary_link.get('href') else 'Venue gallery website not found'

            venue_address = container.find(class_='tribe-address')
            venue_address_text = venue_address.text.strip() if venue_address else 'Venue address not found'

            venue_google_map_link = container.find(class_='tribe-events-gmap')
            venue_google_map_link_urls = venue_google_map_link['href'] if venue_google_map_link and venue_google_map_link.get('href') else 'Venue Google Map link not found'

            venue_website = container.find('dd',class_='tribe-venue-url')
            venue_website_link_urls = venue_website.find('a')['href'] if venue_website and venue_website.find('a') else 'Venue website not found'

            facebook_website_jc = container.find('div',class_='sf_fb_share')
            facebook_website_jc_link_urls = facebook_website_jc.find('a')['href'] if facebook_website_jc and facebook_website_jc.find('a') else 'facebook website jerseycityculture not found'

            x_website_js = container.find('div',class_='sf_twiter')
            x_website_js_link_urls = x_website_js.find('a')['href'] if x_website_js and x_website_js.find('a') else 'x website jerseycityculture not found'

            pintrast_website_js = container.find('div',class_='sf_pinit')
            pintrast_website_js_link_urls = pintrast_website_js.find('a')['href'] if pintrast_website_js and pintrast_website_js.find('a') else 'pintrast website jerseycityculture not found'
            #venue_website_link_urls = venue_website['href'] if venue_website and venue_website.get('href') else 'Venue website not found'

            live.append({
                "Title": title_text,
                "Description": des_text,
                "Image": image_src,
                "Date": date,
                "Detail_Date": detail_date_text,
                "Detail_Time": detail_time_text,
                "Detail_Cost": detail_cost_text,
                "Detail_Event_Category_Link": detail_event_category_url,
                "Detail_Website_URL": detail_website_url,
                "Organizer_Name": organizer_name_text,
                "Organizer_Name_Link": organizer_name_link_url,
                "Organizer_Email": organizer_email_text,
                "Organizer_Website": organizer_website_urls,
                "Venue_Gallery_Link": venue_galary_link_urls,
                "Venue_Address": venue_address_text,
                "Venue_Google_Map_Link": venue_google_map_link_urls,
                "Venue_Website": venue_website_link_urls,
                "facebook_js_link":facebook_website_jc_link_urls,
                "twitter_js_link":x_website_js_link_urls,
                "pintrast_js_link":pintrast_website_js_link_urls
            })
            
            #scraped_titles.add(title_text)

        except Exception as e:
            print(f"Error scraping an event: {e}")

    return live

def jersey_city_culture(date):
    url = f"https://www.jerseycityculture.org/events/category/kids/{date}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }
    
    # Send GET request with headers
    response = requests.get(url, headers=headers)
    time.sleep(20)

    if response.status_code == 403:
        print("Access forbidden, 403 error.")
        return []
    

    soup = BeautifulSoup(response.content, 'html.parser')
    print(soup)
    live = []
    #scraped_titles = set()
    #scraped_dates = set()
    # Find the section containing the event data
    main_container = soup.findAll('article',{'class': 'tribe-events-calendar-day__event'})
    #print(main_container)

    for container in main_container:
        try:
            # Scrape the title
            title_elem = container.find(class_='tribe-events-calendar-day__event-title')
            title_text = title_elem.text.strip() if title_elem else 'not found'

            date_wrapper_elem = container.find('time', class_='tribe-events-calendar-day__event-datetime')
            date = date_wrapper_elem['datetime'].strip().split('T')[0] if date_wrapper_elem and 'datetime' in date_wrapper_elem.attrs else 'not found'  # Extract the date in YYYY-MM-DD format

            # Scrape the visible start date and time as text, e.g., "November 7 @ 5:00 pm"
            event_date_time_start_elem = container.find('span', class_='tribe-event-date-start')
            event_date_time_start = event_date_time_start_elem.text.strip() if event_date_time_start_elem else 'not found'

            # Scrape the visible end time as text, e.g., "9:00 pm"
            event_date_time_end_elem = container.find('span', class_='tribe-event-time')
            event_date_time_end = event_date_time_end_elem.text.strip() if event_date_time_end_elem else 'not found'

            # Combine the start and end times for the full event date and time
            event_date_time = f"{event_date_time_start} - {event_date_time_end}"  # e.g., "November 7 @ 5:00 pm - 9:00 pm"

            # Define the time range separately if needed, such as "5:00 pm - 9:00 pm"
            time_range = f"{event_date_time_start.split('@')[1].strip()} - {event_date_time_end}" if event_date_time_start != 'not found' and '@' in event_date_time_start else 'not found'

            # Scrape the description
            des_elem = container.find(class_='tribe-events-calendar-day__event-description')
            des_text = des_elem.text.strip() if des_elem else 'Description not found'

            # Scrape the image source
            image_elem = container.find(class_='tribe-events-calendar-day__event-featured-image')
            #print(f"image class name : {image_elem}")
            image_src = image_elem['src'] if image_elem and image_elem.get('src') else 'Images not found'
            
            #if title_text in scraped_titles and date in scraped_dates:
            #    continue  # Skip only if both title and date are duplicates

            # Scrape detailed date
            address_city_hall = container.find(class_='tribe-events-calendar-day__event-venue-title')
            address_city_hall_text = address_city_hall.text.strip() if address_city_hall else 'city hall not found'

            # Scrape detailed time
            address_venue = container.find(class_='tribe-events-abbr tribe-events-start-time published dtstart')
            address_venue_text = address_venue.text.strip() if address_venue else 'address venue not found'

            
            live.append({
                "Title": title_text,
                "Description": des_text,
                "Image": image_src,
                "Date": date,
                "Date_and_time":event_date_time,
                "Time":time_range,
                "Address":[address_city_hall_text,address_venue_text]
                
            })
            
            #scraped_titles.add(title_text)

        except Exception as e:
            print(f"Error scraping an event: {e}")

    return live

def event_brite(date):
    url = f"https://www.eventbrite.ie/d/nj--jersey-city/{date}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }
    
    # Send GET request with headers
    response = requests.get(url, headers=headers)
    time.sleep(20)

    if response.status_code == 403:
        print("Access forbidden, 403 error.")
        return []
    

    soup = BeautifulSoup(response.content, 'html.parser')
    print(f'HTML parser Get {soup}')
    live = []
    #scraped_titles = set()
    #scraped_dates = set()
    # Find the section containing the event data
    main_container = soup.findAll('section',{'class': 'DiscoverHorizontalEventCard-module__cardWrapper___2_FKN'})
    #print(main_container)

    for container in main_container:
        try:
            # Scrape the title
            title_elem = container.find(class_='Typography_root__487rx')
            title_text = title_elem.text.strip() if title_elem else 'not found'

            try:
                date_time_start_elem = container[0].find('p')
                event_date_time_start = date_time_start_elem.text.strip() if date_time_start_elem else 'not found'
                print(f'{event_date_time_start} date and time')
            except IndexError:
                event_date_time_start = 'container[0] not found'

            try:
                address_elem = container[1].find('p')
                address_text = address_elem.text.strip() if address_elem else 'not found'
                print(f'{address_text} Address')
            except IndexError:
                address_text = 'container[1] not found'

            # Scrape the image source
            image_elem = container.find(class_='event-card-image')
            #print(f"image class name : {image_elem}")
            image_src = image_elem['src'] if image_elem and image_elem.get('src') else 'Images not found'
            
            #if title_text in scraped_titles and date in scraped_dates:
            #    continue  # Skip only if both title and date are duplicates

            
            
            live.append({
                "Title": title_text,
                "Image": image_src,
                "Date_and_time":event_date_time_start,
                "Address":address_text
                
            })
            
            #scraped_titles.add(title_text)

        except Exception as e:
            print(f"Error scraping an event: {e}")

    return live




def scroll_and_scrape(date):
    # Construct the URL based on the provided date
    url = f"https://www.jerseycityculture.org/events/{date}/"
    print(f"Scraping URL: {url}")
    chrome_options = Options()
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36"
    chrome_options.add_argument(f"user-agent={user_agent}")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--remote-debugging-port=9222")

    # Set up the WebDriver with Chrome options
    chrome_service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

    """chrome_options = Options()
    chrome_options.add_argument("--headless")  
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Set the binary location to Chromium
    chrome_options.binary_location = "/usr/bin/chromium-browser"

    # Set ChromeDriver path directly
    chrome_service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)"""
    live = []
    scraped_titles = set()  # To avoid duplicate titles

    # Scrolling parameters
    x = 0
    y = 250
    scroll_pause = 180  # Wait 3 minutes between scrolls
    total_time = 300  # Scrape for 5 minutes
    start_time = time.time()

    driver.get(url)

    try:
        # Locate and click the dropdown menu to select "Photo" view
        dropdown = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//button[contains(@class, 'tribe-events-c-view-selector__button')]"))
        )
        dropdown.click()

        # Select the "Photo" view option
        photo_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//li[contains(@class, 'tribe-events-c-view-selector__list-item tribe-events-c-view-selector__list-item--list')]"))
        )
        photo_option.click()

        time.sleep(5)  # Allow the page to reload in "Photo" view

    except Exception as e:
        print(f"Error selecting 'Photo' view: {e}")

    # Scroll and scrape the page
    while time.time() - start_time < total_time:
        try:
            driver.execute_script("window.scrollTo({}, {})".format(x, y))
            x = y
            y += 250

            time.sleep(2)  # Wait for the content to load

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, ".//article[contains(@class, 'tribe-events-calendar-list__event tribe-common-g-row')]"))
            )

            # Find all events on the page
            main = driver.find_elements(By.XPATH, ".//article[contains(@class, 'tribe-events-calendar-list__event tribe-common-g-row')]")

            for j in main:
                try:
                    title_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-title')]")
                    title_text = title_elem.text.strip() if title_elem else 'not found'

                    # Skip if the title has already been scraped
                    if title_text in scraped_titles:

                        continue

                    # Scrape description with increased wait time for Django environment
                    try:
                        des_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-description tribe-common-b2 tribe-common-a11y-hidden')]")
                        des_text = des_elem.text.strip() if des_elem.text else 'Description not found'
                    except (NoSuchElementException, TimeoutException):
                        des_text = 'Description not found'  # Default message if description is missing

                    """try:
                        des_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-description')]")
                        des_text = des_elem.text.strip() if des_elem.text else 'Description not found'
                    except (NoSuchElementException, TimeoutException):
                        des_text = 'Description not found'  # Default message if description is missing"""

                    # Scrape the event link
                    
                    anchor_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-title-link')]")
                    anchor_href = anchor_elem.get_attribute('href').strip() if anchor_elem else 'not found'

                    # Scrape event date
                    #date1_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-datetime-wrapper tribe-common-b2')]")
                    #date1_text = date1_elem.text.strip() if date1_elem else 'not found'
                    date_wrapper_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-datetime-wrapper tribe-common-b2')]//time")
                    date = date_wrapper_elem.get_attribute("datetime").strip().split("T")[0] if date_wrapper_elem else 'not found'  # Extract the date in YYYY-MM-DD format

                    # Scrape the visible start date and time as text, e.g., "November 7 @ 5:00 pm"
                    event_date_time_start_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-datetime-wrapper tribe-common-b2')]//span[@class='tribe-event-date-start']")
                    event_date_time_start = event_date_time_start_elem.text.strip() if event_date_time_start_elem else 'not found'

                    # Scrape the visible end time as text, e.g., "9:00 pm"
                    event_date_time_end_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-datetime-wrapper tribe-common-b2')]//span[@class='tribe-event-time']")
                    event_date_time_end = event_date_time_end_elem.text.strip() if event_date_time_end_elem else 'not found'

                    # Combine the start and end times for the full event date and time
                    event_date_time = f"{event_date_time_start} - {event_date_time_end}"  # e.g., "November 7 @ 5:00 pm - 9:00 pm"

                    # Define the time range separately if needed, such as "5:00 pm - 9:00 pm"
                    time_range = f"{event_date_time_start.split('@')[1].strip()} - {event_date_time_end}" if event_date_time_start != 'not found' else 'not found'

                    city_elem = j.find_element(By.XPATH, ".//address[contains(@class, 'tribe-common-b2')]")
                    city_text = city_elem.text.strip() if city_elem else 'address not found'
                    
                    address_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-venue-address')]")
                    address_text = address_elem.text.strip() if city_elem else 'address not found'


                    # Append the result to the list
                    live.append({
                        "Title": title_text,
                        "Description": des_text,
                        "Event_Link": anchor_href,
                        #"Event_date": date1_text,
                        "Date": date,
                        "Date_and_time":event_date_time,
                        "Time":time_range,
                        "CityName":city_text,
                        "FullAddress":address_text
                    })
                    scraped_titles.add(title_text)
                except Exception as e:
                    print(f"Error scraping an event: {e}")

        except Exception as e:
            print(f"Error during scrolling or loading: {e}")

        time.sleep(scroll_pause)  # Pause before the next scroll

    driver.quit()  # Quit the WebDriver after scraping

    return live  # Return the scraped data as a list

def jc_culture(date):
    return scroll_and_scrape(date)


def scroll_and_scrape_multiple(date):
    url = f"https://www.jerseycityculture.org/events/{date}/"
    print(f"Scraping URL: {url}")

    chrome_options = Options()
    #chrome_options.add_argument("--headless")  # Uncomment to run headless
    chrome_service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

    live = []
    scraped_titles = set()
    x, y = 0, 250
    scroll_pause = 180

    driver.get(url)

    try:
        # Select "Photo" view if available
        dropdown = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//button[contains(@class, 'tribe-events-c-view-selector__button')]"))
        )
        dropdown.click()

        photo_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, ".//li[contains(@class, 'tribe-events-c-view-selector__list-item tribe-events-c-view-selector__list-item--list')]"))
        )
        photo_option.click()
        time.sleep(5)

    except Exception as e:
        print(f"Error selecting 'Photo' view: {e}")

    while True:  # Infinite loop that stops when no more pages are found
        start_time = time.time()
        x, y = 0, 250

        while time.time() - start_time < scroll_pause:
            try:
                driver.execute_script(f"window.scrollTo({x}, {y});")
                x = y
                y += 250
                time.sleep(2)

                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, ".//article[contains(@class, 'tribe-events-calendar-list__event tribe-common-g-row')]"))
                )

                main = driver.find_elements(By.XPATH, ".//article[contains(@class, 'tribe-events-calendar-list__event tribe-common-g-row')]")

                for j in main:
                    try:
                        title_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-title')]")
                        title_text = title_elem.text.strip() if title_elem else 'not found'

                        if title_text in scraped_titles:
                            continue

                        try:
                            des_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-description tribe-common-b2 tribe-common-a11y-hidden')]")
                            des_text = des_elem.text.strip() if des_elem.text else 'Description not found'
                        except (NoSuchElementException, TimeoutException):
                            des_text = 'Description not found'

                        anchor_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-title-link')]")
                        anchor_href = anchor_elem.get_attribute('href').strip() if anchor_elem else 'not found'

                        date1_elem = j.find_element(By.XPATH, ".//*[contains(@class, 'tribe-events-calendar-list__event-datetime-wrapper tribe-common-b2')]")
                        date1_text = date1_elem.text.strip() if date1_elem else 'not found'

                        addr_elem = j.find_element(By.XPATH, ".//address[contains(@class, 'tribe-events-calendar-list__event-venue tribe-common-b2')]")
                        address_text = addr_elem.text.strip() if addr_elem else 'address not found'

                        live.append({
                            "Title": title_text,
                            "Description": des_text,
                            "Event_Link": anchor_href,
                            "Event_date": date1_text,
                            "Address": address_text
                        })
                        scraped_titles.add(title_text)
                    except Exception as e:
                        print(f"Error scraping an event: {e}")

            except Exception as e:
                print(f"Error during scrolling or loading: {e}")

            time.sleep(scroll_pause)

        try:
            next_button = driver.find_elements(By.XPATH, ".//a[contains(@class, 'tribe-events-c-nav__next tribe-common-b2 tribe-common-b1--min-medium')]")
            if next_button:
                next_button[0].click()
                time.sleep(5)  # Wait for the next page to load
            else:
                print("No more pages available.")
                break  # Exit the loop if no more pages are available

        except Exception as e:
            print(f"Error clicking 'Next' button: {e}")
            break

    driver.quit()
    return live






# Function to fetch and parse a URL
"""def fetch_and_parse(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except requests.RequestException as e:
        print(f"Failed to fetch {url}: {e}")
        return None


# Function to extract text content from a page
def extract_content(soup):
    if soup is None:
        return ""

    text_content = []
    for tag in ['p', 'div', 'span', 'section', 'article']:
        elements = soup.find_all(tag)
        for element in elements:
            text = element.get_text(strip=True)
            if len(text) > 100:  # Adjust threshold as needed
                text_content.append(text)

    return "\n".join(text_content)


# Function to find specific internal links
def find_specific_links(base_url, soup):
    specific_urls = set()
    keywords = ["about", "contact", "privacy", "terms"]  # Keywords to identify the specific pages
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href'].lower()
        text = a_tag.get_text().lower()
        if any(keyword in href or keyword in text for keyword in keywords):
            full_url = urljoin(base_url, href)
            specific_urls.add(full_url)
    return specific_urls


# Function to scrape the specified pages
def scrape_specific_pages(url):
    soup = fetch_and_parse(url)
    specific_links = find_specific_links(url, soup)

    scraped_data = {}
    for link in specific_links:
        print(f"Scraping {link}...")
        page_soup = fetch_and_parse(link)
        page_content = extract_content(page_soup)
        scraped_data[link] = page_content

    return scraped_data

# Example usage
urls = [
    'https://www.arthouseproductions.org/',
    'https://www.cadence-education.com',
]
scraped_data = main(urls)


for url, content in scraped_data.items():
    print(f"Data from {url}:")
    print(content)
    print("\n" + "-" * 50 + "\n")

print("Process finished successfully.")"""

# Function to fetch and parse a URL

keywords = [
    'education', 'activity', 'games', 'events', 'children', 'kids',
    'preschool', 'toddler', 'early learning', 'after school', 'summer camp', 'program'
]

# Function to check if a URL meets the criteria
def is_provider(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()  # Check for HTTP errors
        content = response.text
        soup = BeautifulSoup(content, 'html.parser')

        # Check if any keyword is present in the page content
        page_text = soup.get_text().lower()
        return any(keyword in page_text for keyword in keywords)
    
    except requests.RequestException as e:
        # print(f"Error fetching {url}: {e}")
        return False


def fetch_and_parse(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        # return response.content
        return BeautifulSoup(response.content, 'html.parser')
    except requests.RequestException as e:
        # print(f"Failed to fetch {url}: {e}")
        return None


# Function to extract text content from a page
def extract_content(soup):
    if soup is None:
        return ""

    text_content = []
    for tag in ['p', 'div', 'span', 'section', 'article']:
        elements = soup.find_all(tag)
        for element in elements:
            text = element.get_text(strip=True)
            if len(text) > 100:  # Adjust threshold as needed
                text_content.append(text)

    return "\n".join(text_content)


# Function to find specific internal links
def find_specific_links(base_url, soup):
    # soup = BeautifulSoup(soup, 'html.parser')
    specific_urls = set()
    # keywords = ["about", "contact", "privacy", "terms"]  # Keywords to identify the specific pages
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href'].lower()
        text = a_tag.get_text().lower()
           # if any(keyword in href or keyword in text for keyword in keywords):
        full_url = urljoin(base_url, href)
        specific_urls.add(full_url)
            
    specific_urls.add(base_url)    
    return specific_urls


# Function to scrape the specified pages
def scrape_specific_pages(url):
    soup = fetch_and_parse(url)
    specific_links = find_specific_links(url, soup)

    scraped_data = {}
    for link in specific_links:
        # print(f"Scraping {link}...")
        page_soup = fetch_and_parse(link)
        page_content = extract_content(page_soup)
        scraped_data[link] = page_content

    return scraped_data


def main(urls):
    all_data = {}
    for url in urls:
        if is_provider(url):
            all_data.update(scrape_specific_pages(url))
        else:
            #print(f"{url} is not a provider.")
            return all_data


# Example usage
# urls = [
#     'https://www.arthouseproductions.org/',
#     'https://www.cadence-education.com',
# ]

def scrape_url(url):
    if is_provider(url):
            data=scrape_specific_pages(url)
            return data
    else:
            #print(f"{url} is not a provider.")
            return None

    for url, content in scraped_data.items():
        print(f"Data from {url}:")
        print(content)
        print("\n" + "-" * 50 + "\n")

    print("Process finished successfully.")


# def fetch_html_and_text(url):
#     # Fetch the content from the URL
#     response = requests.get(url)
#     response.raise_for_status()  # Raise an exception if the request failed
    
#     # Parse the content with BeautifulSoup
#     soup = BeautifulSoup(response.content, "html.parser")
    
#     # # Extract all tags and their HTML and text
#     # elements = soup.find_all(True)  # Find all tags
#     # html_with_text = "\n\n".join([
#     #     "Tag: <{0}>\nHTML:\n{1}\nText:\n{2}".format(
#     #         element.name,
#     #         element.prettify(),
#     #         element.get_text(separator='\n', strip=True)
#     #     ) for element in elements
#     # ])
    
#     # return html_with_text

#     elements = soup.find_all(True)  # Find all tags
#     html_with_text = "\n\n".join([
#         "Tag: <{0}>\nHTML:\n{1}\nText:\n{2}".format(
#             element.name,
#             element.prettify(),
#             element.get_text(separator='\n', strip=True)
#         ) for element in elements
#     ])
    
#     return html_with_text

def fetch_html_and_text(url):
    # Fetch the content from the URL
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception if the request failed

    # Parse the content with BeautifulSoup
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Extract specific pieces of information
    description_tag = soup.find('h1', class_='text-2xl font-bold leading-tight')
    description = description_tag.get_text(strip=True) if description_tag else "Description not found"
    
    review_tag = soup.find('div', class_='flex items-center justify-between gap-2')
    review = review_tag.get_text(strip=True) if review_tag else "Review not found"
    
    rating_tag = soup.find('div', class_='font-bold text-base')
    rating = rating_tag.get_text(strip=True) if rating_tag else "Rating not found"

    # Extract teaching hours
    teaching_hours_tag = soup.find('div', class_='border-bottom mt-6 flex flex-col gap-2 pb-4')
    teaching_hours = "Teaching hours not found"
    if teaching_hours_tag:
        teaching_hours_entries = teaching_hours_tag.find_all('div', class_='mb-2 flex justify-between gap-1')
        if teaching_hours_entries:
            teaching_hours = "\n".join(
                [f"{entry.find('div').get_text(strip=True)}: {entry.find_all('div', class_='text-right')[0].get_text(separator=' | ', strip=True)}"
                 for entry in teaching_hours_entries]
            )
    
    # Extract timing
    timing_tag = soup.find('div', class_='text-xs text-text-secondary mt-5')
    timing = "Timing not found"
    if timing_tag:
        timing = timing_tag.get_text(strip=True)

    # Extract price
    price_tag = soup.find('div', class_='SideBarPrice_tutorPricing__Tj38P')
    price = "Price not found"
    if price_tag:
        price_entries = price_tag.find_all('div', class_='SideBarPrice_priceRates__PUrVs')
        if price_entries:
            price = "\n".join(
                [f"{entry.find('div', class_='SideBarPrice_priceMinute__PqAIl').get_text(strip=True)}: {entry.find('div', class_='SideBarPrice_discount__8_M7r').get_text(strip=True)}"
                 for entry in price_entries]
            )
    
    # Extract the 'About' section
    about_section_tag = soup.find('div', id='about-is-below-fold')
    if about_section_tag:
        about_title_tag = about_section_tag.find('h4', {'data-testid': 'profile-name'})
        about_title = about_title_tag.get_text(strip=True) if about_title_tag else "About section title not found"

        about_text_tag = about_section_tag.find('div', class_='whitespace-pre-line')
        about_text = about_text_tag.get_text(separator='\n', strip=True) if about_text_tag else "About section text not found"
    else:
        about_title = "About section not found"
        about_text = ""

    # Extract the 'Experience' section
    experience_section_tag = soup.find('details', id='experience')
    experience_entries = []
    if experience_section_tag:
        experience_items = experience_section_tag.find_all('div', class_='flex flex-col gap-3')
        for item in experience_items:
            title_tag = item.find('h3', class_='text-md font-bold 2md:text-lg')
            title = title_tag.get_text(strip=True) if title_tag else "Title not found"
            
            date_tag = item.find('span')
            date_range = date_tag.get_text(strip=True) if date_tag else "Date range not found"
            
            description_paragraphs = item.find_all('p')
            description_text = "\n".join([p.get_text(strip=True) for p in description_paragraphs if p.get_text(strip=True)])
            
            experience_entries.append({
                'title': title,
                'date_range': date_range,
                'description': description_text if description_text else "Description not found"
            })
    else:
        experience_entries = "Experience section not found"

    # Extract the 'Education' section
    education_section_tag = soup.find('details', id='education')
    education_entries = []
    if education_section_tag:
        education_items = education_section_tag.find_all('div', class_='flex flex-col gap-3')
        for item in education_items:
            title_tag = item.find('h3', class_='text-md font-bold 2md:text-lg')
            title = title_tag.get_text(strip=True) if title_tag else "Title not found"
            
            date_tag = item.find('span')
            date_range = date_tag.get_text(strip=True) if date_tag else "Date range not found"
            
            school_tag = item.find('p')
            school = school_tag.get_text(strip=True) if school_tag else "School not found"
            
            education_entries.append({
                'title': title,
                'date_range': date_range,
                'school': school
            })
    else:
        education_entries = "Education section not found"
    
    # Extract languages
    languages_section_tag = soup.find('div', class_='languages-section')
    languages = []
    if languages_section_tag:
        language_tags = languages_section_tag.find_all('span', class_='language')
        languages = [language.get_text(strip=True) for language in language_tags]
    else:
        languages = "Languages section not found"

    # Extract gallery images
    gallery_section_tag = soup.find('div', class_='gallery')
    gallery_images = []
    if gallery_section_tag:
        image_tags = gallery_section_tag.find_all('img')
        gallery_images = [img['src'] for img in image_tags if 'src' in img.attrs]
    else:
        gallery_images = "Gallery section not found"

    # Return the extracted information in a structured format
    return {
        'description': description,
        'review': review,
        'rating': rating,
        'teaching_hours': teaching_hours,
        'timing': timing,
        'price': price,
        'about_title': about_title,
        'about_text': about_text,
        'experience': experience_entries,
        'education': education_entries,
        'languages': languages,
        'gallery_images': gallery_images
    }

def print_data(data):
    # Print the data line by line
    print(f"Description: {data['description']}")
    print(f"Review: {data['review']}")
    print(f"Rating: {data['rating']}")
    print(f"Teaching Hours: {data['teaching_hours']}")
    print(f"Timing: {data['timing']}")
    print(f"Price: {data['price']}")
    print(f"About Title: {data['about_title']}")
    print(f"About Text: {data['about_text']}\n")
    
    print("Experience:")
    if isinstance(data['experience'], list):
        for i, experience in enumerate(data['experience'], start=1):
            print(f"  Experience {i}:")
            print(f"    Title: {experience['title']}")
            print(f"    Date Range: {experience['date_range']}")
            print(f"    Description: {experience['description']}\n")
    else:
        print(f"  {data['experience']}")  # In case there's no experience section

    print("Education:")
    if isinstance(data['education'], list):
        for i, education in enumerate(data['education'], start=1):
            print(f"  Education {i}:")
            print(f"    Title: {education['title']}")
            print(f"    Date Range: {education['date_range']}")
            print(f"    School: {education['school']}\n")
    else:
        print(f"  {data['education']}")    

    print("Languages:")
    if isinstance(data['languages'], list):
        for i, language in enumerate(data['languages'], start=1):
            print(f"  Language {i}: {language}")
    else:
        print(f"  {data['languages']}")  # In case there's no languages section

    print("Gallery Images:")
    if isinstance(data['gallery_images'], list):
        for i, image_url in enumerate(data['gallery_images'], start=1):
            print(f"  Image {i}: {image_url}")
    else:
        print(f"  {data['gallery_images']}")  # In case there's no gallery section

def scrape_url_to_text(url):
            data=fetch_html_and_text(url)
            return data



def fetch_and_extract_info(url):
    # Fetch the content from the URL
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return
    
    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Print the entire HTML content to debug (optional)
    # print(soup.prettify())

    # Define the CSS selector for the section container
    selector = '.section-container.relative.mb-10.mt-0.px-0.lg\\:mb-20'
    sections = soup.select(selector)

    print(f"Found {len(sections)} sections.")

    # Initialize lists to store names and image URLs
    data = []

    # Extract names and images
    for section in sections:
        # Print section HTML for debugging
        print(section.prettify())
        
        # Extract names from <span> elements
        spans = section.find_all('span', class_='absolute bottom-3 left-3 z-20 font-bold text-core-secondary')
        names = [span.get_text(strip=True) for span in spans]
        
        # Extract images within the same section
        images = section.find_all('img')
        image_urls = [
            urljoin(url, img.get('src'))
            for img in images
            if img.get('src') and not img.get('src').startswith('data:image/')
        ]

        # Assuming each name corresponds to an image, pair them
        for name, img_url in zip(names, image_urls):
            data.append({'name': name, 'image_url': img_url})

    return data

def scrape_url_to_subject(url):
            data=fetch_and_extract_info(url)
            return data

# # Example usage
# url = 'https://takelessons.com/health-and-wellness-lessons'  # Replace with your URL
# data = fetch_and_extract_info(url)

# if data:
#     print("\nExtracted Data:")
#     for entry in data:
#         print(f"Name: {entry['name']}, Image URL: {entry['image_url']}")
# else:
#     print("No data extracted.")


def fetch_all_tags(url):
    # Fetch the content from the URL
    response = requests.get(url)
    
    if response.status_code == 200:
        # Parse the content with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all <li> elements under the relevant <ul>
        list_items = soup.select('#panel-1 > ul > li')

        # Initialize a list to store tag data
        tag_data = []

        # Extract the name and URL from each <li>
        for item in list_items:
            a_tag = item.find('a')
            name = a_tag.get_text(strip=True)
            url = a_tag.get('href')

            # Append the extracted data to the tag_data list
            tag_data.append({
                'name': name,
                'url': url
            })

            # Print the results in the console
            print(f'Name: {name}')
            print(f'URL: {url}')
            print('---')
        
        # Return the collected tag data
        return tag_data
    
    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}')
        return None

def scrape_url_to_tags(url):
    # Fetch all tags from the given URL
    data = fetch_all_tags(url)

    # Print the collected data
    print("Scraped data:", data)

    return data



def fetch_all_provider_profile(url):
    # Set the desired User-Agent
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36"

# Set up Chrome options to include the User-Agent
    chrome_options = Options()
    chrome_options.binary_location = "/snap/bin/chromium"
    chrome_options.add_argument(f"user-agent={user_agent}")
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    chrome_options.add_argument("--remote-debugging-port=9222")  # Avoid DevToolsActivePort file error

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    providers = []  # List to store tutor profile data

    try:
        # Open the URL
        
        driver.get(url)

        # Wait for the page to load
        driver.implicitly_wait(10)

        # Scroll down until no new content is loaded
        last_height = driver.execute_script("return document.body.scrollHeight")

        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)  # Wait for new content to load
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        # Find tutor names
        tutor_name_elements = driver.find_elements(By.CSS_SELECTOR, 'div[data-testid="tutor-name"] a')

        # Loop through each tutor name and retrieve more details
        for tutor in tutor_name_elements:
            tutor_data = {}
            tutor_data['tutor_name'] = tutor.text
            tutor_data['profile_link'] = tutor.get_attribute('href')

            # Find the parent element of the tutor
            parent_element = tutor.find_element(By.XPATH, './ancestor::div[contains(@class, "bg-white h-full")]')

            # Get the image URL
            try:
                image_element = WebDriverWait(parent_element, 10).until(
                    EC.presence_of_element_located((By.XPATH, './/div[contains(@class, "inline-block")]/span/img'))
                )
                image_url = image_element.get_attribute('src')
                tutor_data['image_url'] = image_url if not image_url.startswith('data:image') else "Base64 Image"
            except Exception as e:
                tutor_data['image_url'] = "Image not found"

            # Get rating and review count
            try:
                rating_element = parent_element.find_element(By.CSS_SELECTOR, 'div.flex.items-center.gap-1 div.font-bold.text-base')
                review_count_element = parent_element.find_element(By.CSS_SELECTOR, 'div.flex.items-center.gap-1 div:nth-child(3)')
                tutor_data['rating'] = rating_element.text
                tutor_data['review_count'] = review_count_element.text
            except NoSuchElementException:
                tutor_data['rating'] = tutor_data['review_count'] = "Not available"

            # Get lesson description
            try:
                lesson_description_element = parent_element.find_element(By.CSS_SELECTOR, 'h2.font-bold.text-lg a')
                tutor_data['lesson_description'] = lesson_description_element.text
            except NoSuchElementException:
                tutor_data['lesson_description'] = "Not available"

            # Get lesson type (e.g., Private Lessons)
            try:
                lesson_type_element = parent_element.find_element(By.XPATH, './/div[contains(text(), "Private Lessons")]')
                tutor_data['lesson_type'] = lesson_type_element.text
            except NoSuchElementException:
                tutor_data['lesson_type'] = "Not available"

            # Get skill levels (Beginner, Intermediate, Advanced)
            try:
                skill_level_element = parent_element.find_element(By.XPATH, './/div[contains(text(), "Beginner, Intermediate, Advanced")]')
                tutor_data['skill_levels'] = skill_level_element.text
            except NoSuchElementException:
                tutor_data['skill_levels'] = "Not available"

            # Extract location information (e.g., Online/In-person)
            try:
                location_element = parent_element.find_element(By.XPATH, './/div[contains(@class, "text-text-secondary") and (contains(text(), "Online") or contains(text(), "In person"))]')
                tutor_data['location'] = location_element.text
            except NoSuchElementException:
                tutor_data['location'] = "Not available"

            # Get price and duration
            try:
                price_element = parent_element.find_element(By.XPATH, './/span[@class="headline2 text-lg"]')
                duration_element = price_element.find_element(By.XPATH, './following-sibling::span')
                tutor_data['price'] = price_element.text
                tutor_data['duration'] = duration_element.text
            except NoSuchElementException:
                tutor_data['price'] = tutor_data['duration'] = "Not available"

            # Add the tutor data to the providers list
            providers.append(tutor_data)

    finally:
        # Close the WebDriver after scraping
        driver.quit()

    return providers

def scrape_url_to_provider(url):
    return fetch_all_provider_profile(url)



def scrape_pricing(url):
    # Set the desired User-Agent
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36"

    # Set up Chrome options to include the User-Agent
    chrome_options = Options()
    chrome_options.binary_location = "/snap/bin/chromium"
    chrome_options.add_argument(f"user-agent={user_agent}")
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    chrome_options.add_argument("--remote-debugging-port=9222")  # Avoid DevToolsActivePort file error

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    pricing_info = []
    try:
        driver.get(url)
        
        price_elements = driver.find_elements(By.CSS_SELECTOR, '.SideBarPrice_priceRates__PUrVs')
        seen = set()

        for element in price_elements:
            time_duration = element.find_element(By.CSS_SELECTOR, '.SideBarPrice_priceMinute__PqAIl').text.strip()
            price = element.find_element(By.CSS_SELECTOR, '.SideBarPrice_discount__8_M7r').text.strip()
            
            identifier = (time_duration, price)
            
            # Check if both time and price are valid
            if time_duration and price and identifier not in seen:
                seen.add(identifier)
                pricing_info.append({'time': time_duration, 'price': price})

    finally:
        # Close the WebDriver after scraping
        driver.quit()
    
    return pricing_info

def scrape_provider_profile_to_pricing(url):
    return scrape_pricing(url)



# def find_event_link(url):
#     # Set the desired User-Agent
#     user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36"

#     # Set up Chrome options to include the User-Agent
#     chrome_options = Options()
#     chrome_options.binary_location = "/snap/bin/chromium"
#     chrome_options.add_argument(f"user-agent={user_agent}")
#     chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
#     chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
#     chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
#     chrome_options.add_argument("--remote-debugging-port=9222")  # Avoid DevToolsActivePort file error

#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
#     event_details = []
#     try:
#         driver.get(url)
        
#         # Wait for the specific elements to be present
#         WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.CSS_SELECTOR, '[data-v-6bfca9b5]'))
#         )

#         # Scroll down to the footer to load all events
#         last_height = driver.execute_script("return document.body.scrollHeight")
        
#         while True:
#             # Scroll down
#             driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#             time.sleep(2)  # Wait for new content to load

#             # Calculate new scroll height and compare with last scroll height
#             new_height = driver.execute_script("return document.body.scrollHeight")
#             if new_height == last_height:
#                 break
#             last_height = new_height

#         # Parse the page source with BeautifulSoup
#         soup = BeautifulSoup(driver.page_source, 'html.parser')

#         # Find all event containers with the specified data-v attribute
#         events = soup.find_all('div', {'data-v-6bfca9b5': True})

#         # Extract details from the event containers
        
#         for event in events:
#             # Extract image URL
#             image_div = event.find('div', class_='csimg')
#             image_url = None
#             if image_div and 'style' in image_div.attrs:
#                 image_url = image_div['style'].split('url("')[1].split('")')[0]

#             # Extract title
#             title_span = event.find('div', class_='csOneLine')
#             title = title_span.get_text(strip=True) if title_span else None
            
#             # Extract venue
#             venue_div = event.find('div', class_='cityVenue')
#             venue = venue_div.get_text(separator=' | ', strip=True) if venue_div else None
            
#             # Extract time
#             time_span = event.find('span', style='white-space: nowrap;')
#             event_time = time_span.get_text(strip=True) if time_span else None
            
#             # Extract distance
#             distance_span = event.find('span', string=lambda t: t and 'mi' in t)
#             distance = distance_span.get_text(strip=True) if distance_span else None
            
#             # Extract href link
#             link_tag = event.find('a')
#             href_link = link_tag['href'] if link_tag and 'href' in link_tag.attrs else None

#             event_details.append({
#                 'image_url': image_url,
#                 'title': title,
#                 'venue': venue,
#                 'time': event_time,
#                 'distance': distance,
#                 'href': href_link
#             })

#         # return event_details

#     finally:
#         # Close the driver
#         driver.quit()
    
#     return event_details

def find_event_link(url):
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36"

    # Set up Chrome options to include the User-Agent
    chrome_options = Options()
    chrome_options.binary_location = "/snap/bin/chromium"
    chrome_options.add_argument(f"user-agent={user_agent}")
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    chrome_options.add_argument("--remote-debugging-port=9222")  # Avoid DevToolsActivePort file error

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    event_details = []
    try:
        driver.get(url)

        # Wait for event elements to load
        print("Waiting for the event elements to load...")
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '.csEvWrap'))
        )
        print("Event elements loaded.")

        # Scroll down to load all events
        last_height = driver.execute_script("return document.body.scrollHeight")
        
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        events = soup.find_all('div', class_='csEvWrap')

        for event in events:
            # Extract image URL
            image_div = event.find('div', class_='csimg')
            image_url = None
            if image_div and 'style' in image_div.attrs:
                try:
                    image_url = image_div['style'].split('url("')[1].split('")')[0]
                except IndexError:
                    image_url = None

            # Extract title
            title_span = event.find('div', class_='csOneLine')
            title = title_span.get_text(strip=True) if title_span else "N/A"

            # Extract venue
            venue_div = event.find('div', class_='cityVenue')
            venue = venue_div.get_text(separator=' | ', strip=True) if venue_div else "N/A"

            # Extract time
            time_span = event.find('span', style=lambda style: style and 'white-space: nowrap;' in style)
            event_time = time_span.get_text(strip=True) if time_span and time_span.text.strip() else "N/A"

            # Extract distance
            distance_span = event.find('span', string=lambda text: text and 'mi' in text)
            distance = distance_span.get_text(strip=True) if distance_span else "N/A"

            # Extract href link
            link_tag = event.find('a')
            href_link = link_tag['href'] if link_tag and 'href' in link_tag.attrs else "N/A"

            event_details.append({
                'image_url': image_url,
                'title': title,
                'venue': venue,
                'time': event_time,
                'distance': distance,
                'href': href_link
            })

        return event_details

    except TimeoutException:
        print("The page took too long to load.")
        return []
    except NoSuchElementException as e:
        print(f"An element was not found: {e}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []
    finally:
        driver.quit()

def scrape_events(url):
    return find_event_link(url)

 


def test_beautifulsoup(date):
    url = f"https://www.jerseycityculture.org/events/{date}/"
    print(f"Scraping URL: {url}")
    live = []
    scraped_titles = set()

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_service = Service("/usr/bin/chromedriver")

    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, 'article'))
        )

        previous_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Wait for the page to load
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == previous_height:
                break
            previous_height = new_height

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        events = soup.find_all('article', class_='tribe-events-calendar-list__event tribe-common-g-row')

        for event in events:
            try:
                title_elem = event.find(class_='tribe-events-calendar-list__event-title')
                title_text = title_elem.get_text(strip=True) if title_elem else 'not found'
                if title_text in scraped_titles:
                    continue

                des_elem = event.find(class_='tribe-events-calendar-list__event-description')
                des_text = des_elem.get_text(strip=True) if des_elem else 'Description not found'

                anchor_elem = event.find('a', class_='tribe-events-calendar-list__event-title-link')
                anchor_href = anchor_elem['href'].strip() if anchor_elem else 'not found'

                date_wrapper_elem = event.find(class_='tribe-events-calendar-list__event-datetime-wrapper')
                date = date_wrapper_elem.find('time')['datetime'].split("T")[0] if date_wrapper_elem else 'not found'

                event_date_time_start_elem = event.find(class_='tribe-event-date-start')
                event_date_time_start = event_date_time_start_elem.get_text(strip=True) if event_date_time_start_elem else 'not found'

                event_date_time_end_elem = event.find(class_='tribe-event-time')
                event_date_time_end = event_date_time_end_elem.get_text(strip=True) if event_date_time_end_elem else 'not found'

                event_date_time = f"{event_date_time_start} - {event_date_time_end}"
                time_range = f"{event_date_time_start.split('@')[1].strip()} - {event_date_time_end}" if event_date_time_start != 'not found' else 'not found'

                city_elem = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//address[contains(@class, 'tribe-common-b2')]"))
                )
                city_text = city_elem.get_text(strip=True) if city_elem else 'address not found'

                address_elem = event.find(class_='tribe-events-calendar-list__event-venue-address')
                address_text = address_elem.get_text(strip=True) if address_elem else 'address not found'

                live.append({
                    "Title": title_text,
                    "Description": des_text,
                    "Event_Link": anchor_href,
                    "Date": date,
                    "Date_and_time": event_date_time,
                    "Time": time_range,
                    "CityName": city_text,
                    "FullAddress": address_text
                })
                scraped_titles.add(title_text)
            except Exception as e:
                print(f"Error scraping an event: {e}")
    
    finally:
        driver.quit()

    json_data = json.dumps(live, ensure_ascii=False, default=str)
    print(json_data)
    return json_data