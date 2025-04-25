from django.http import JsonResponse
from django.views import View
from .scraper import crawl_website
from .scrap import scrape_url  # Assuming your scraping functions are in scraping_utils
from .scrap import fetch_html_and_text
from .scrap import fetch_and_extract_info
from .scrap import fetch_all_tags
from .scrap import fetch_all_provider_profile
from .scrap import scrape_pricing
from .scrap import find_event_link
from .scrap import jc_culture
from .scrap import scroll_and_scrape_multiple
from .scrap import jersey_city_culture
from .scrap import urls_contents_scrap
from .scrap import test_beautifulsoup
from .scrap import event_brite


class CrawlWebsiteView(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            urls = crawl_website(url)
            return JsonResponse({'urls': urls})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
class CrawlWebsite(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = scrape_url(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)
        
class CrawlWebsiteAndText(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = fetch_html_and_text(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)
        

class CrawlWebsiteSubject(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = fetch_and_extract_info(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)

class CrawlWebsiteAllTags(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = fetch_all_tags(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500) 


class CrawlWebsiteAllProvider(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = fetch_all_provider_profile(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)


class CrawlProviderPrice(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = scrape_pricing(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)

class CrawlEvents(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = find_event_link(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500) 

"""class Link(View):
    def get(self, request):
        url = request.GET.get('url')
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Received URL for scraping: {url}")  # Debugging line
            scraped_data = scroll_and_scrape(url)
            print(f"Scraped data: {scraped_data}")  # Debugging line
            return JsonResponse({'data': scraped_data})
        except Exception as e:
            print(f"Error occurred: {e}")  # Debugging line
            return JsonResponse({'error': str(e)}, status=500)                                                
"""
class LinkJerseyCity(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = jersey_city_culture(date)

            return JsonResponse({'data': scraped_data})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)        



class Link(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = jc_culture(date)

            return JsonResponse({'data': scraped_data})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)        
        


class LinkMultiple(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = scroll_and_scrape_multiple(date)

            return JsonResponse({'data': scraped_data})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)    



class Urlss(View):
    def get(self, request):
        url = request.GET.get('url')
        
        if not url:
            return JsonResponse({'error': 'URL parameter is required'}, status=400)

        try:
            print(f"Scraping events from URL: {url}")
            scraped_data = urls_contents_scrap(url)
            return JsonResponse({'data': scraped_data})
        
        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)



class Test_Beauti(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = jc_culture(date)

            return JsonResponse({'data': test_beautifulsoup})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)        
        

class Test_Beauti(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = jc_culture(date)

            return JsonResponse({'data': test_beautifulsoup})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)        



class Event_Brite_P(View):
    def get(self, request):
        # Get the date from the URL query parameter (instead of 'url')
        date = request.GET.get('date')
        
        if not date:
            return JsonResponse({'error': 'Date parameter is required'}, status=400)

        try:
            # Call the scraping function with the date
            print(f"Scraping events for date: {date}")
            scraped_data = event_brite(date)

            return JsonResponse({'data': scraped_data})  # Return the scraped data as JSON

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)        





