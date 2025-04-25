# import requests
# from bs4 import BeautifulSoup
# from urllib.parse import urljoin, urlparse

# # Function to extract URLs from a webpage
# def extract_urls(url):
#     print(f'Extracting URLs from: {url}')
#     try:
#         response = requests.get(url)
#         response.raise_for_status()  # Ensure we handle HTTP errors
#         soup = BeautifulSoup(response.text, 'html.parser')

#         urls = []
#         for link in soup.find_all('a'):
#             href = link.get('href')
#             if href:
#                 # Convert relative URLs to absolute URLs
#                 absolute_url = urljoin(url, href)
#                 urls.append(absolute_url)
#                 print(f'Found URL: {absolute_url}')

#         return urls
#     except Exception as e:
#         print(f'Error: {e}')
#         return []

# # Function to recursively crawl a website and extract URLs
# def crawl_website(url, visited=None):
#     if visited is None:
#         visited = set()

#     try:
#         # Normalize the URL
#         parsed_url = urlparse(url)
#         base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

#         if url in visited:
#             print(f'Skipping already visited URL: {url}')
#             return []

#         print(f'Crawling URL: {url}')
#         # Fetch URLs from the current page
#         urls = extract_urls(url)

#         # Add the current URL to the set of visited URLs
#         visited.add(url)

#         # Recursively crawl each found URL
#         results = [url]  # Include the current URL in the results
#         for found_url in urls:
#             if urlparse(found_url).netloc == parsed_url.netloc:
#                 results.extend(crawl_website(found_url, visited))

#         return results
#     except Exception as e:
#         print(f'Error: {e}')
#         return []

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Function to extract URLs from a webpage
def extract_urls(url):
    print(f'Extracting URLs from: {url}')
    try:
        # response = requests.get(url)
        # response.raise_for_status()  # Ensure we handle HTTP errors
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()  # Check for HTTP errors
        soup = BeautifulSoup(response.text, 'html.parser')

        urls = []
        for link in soup.find_all('a'):
            href = link.get('href')
            if href:
                # Convert relative URLs to absolute URLs
                absolute_url = urljoin(url, href)
                
                # Skip URLs that point to image files
                if not absolute_url.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp')):
                    urls.append(absolute_url)
                    print(f'Found URL: {absolute_url}')

        return urls
    except Exception as e:
        print(f'Error: {e}')
        return []

# Function to recursively crawl a website and extract URLs
def crawl_website(url, visited=None):
    if visited is None:
        visited = set()

    try:
        # Normalize the URL
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        if url in visited:
            print(f'Skipping already visited URL: {url}')
            return []

        print(f'Crawling URL: {url}')
        # Fetch URLs from the current page
        urls = extract_urls(url)

        # Add the current URL to the set of visited URLs
        visited.add(url)

        # Recursively crawl each found URL
        results = [url]  # Include the current URL in the results
        for found_url in urls:
            if urlparse(found_url).netloc == parsed_url.netloc:
                results.extend(crawl_website(found_url, visited))

        return results
    except Exception as e:
        print(f'Error: {e}')
        return []

