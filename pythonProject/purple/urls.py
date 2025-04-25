"""
URL configuration for purple project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from scraping.views import CrawlWebsiteView
from scraping.views import CrawlWebsite
from scraping.views import CrawlWebsiteAndText
from scraping.views import CrawlWebsiteSubject
from scraping.views import CrawlWebsiteAllTags
from scraping.views import CrawlWebsiteAllProvider
from scraping.views import CrawlProviderPrice
from scraping.views import CrawlEvents
from scraping.views import Link
from scraping.views import LinkMultiple
from scraping.views import LinkJerseyCity
from scraping.views import Urlss
from scraping.views import Test_Beauti
from scraping.views import Event_Brite_P





urlpatterns = [
    path('admin/', admin.site.urls),
    path('crawl-website/', CrawlWebsiteView.as_view(), name='crawl-website'),
    path('scrping/', CrawlWebsite.as_view(), name='scrap-data'),
    path('scraping-text/', CrawlWebsiteAndText.as_view(), name='scraping-text'),
    path('scraping-subject/', CrawlWebsiteSubject.as_view(), name='scraping-subject'),
    path('scraping-all-tags/', CrawlWebsiteAllTags.as_view(), name='scraping-all-tags'),
    path('scraping-all-provider/', CrawlWebsiteAllProvider.as_view(), name='scraping-all-provider'),
    path('scraping-provider-price/', CrawlProviderPrice.as_view(), name='scraping-provider-price'),
    path('scraping-events-link/', CrawlEvents.as_view(), name='scraping-events-link'),
    path('scraping-events-link-jerseycityculture/', Link.as_view(), name='scraping-events-link-jerseycityculture'),
    path('scraping-events-link-multiple/', LinkMultiple.as_view(), name='scraping-events-linkMultiple-jerseycityculture'),
    path('scraping-events-jerseycityculture/', LinkJerseyCity.as_view(), name='scraping-events-jerseycityculture'),
    # start get all contents api 
    path('scraping-urlss/', Urlss.as_view(), name='scraping-urlss'),
    # end get all contents api 
    path('test_beautifulsoup/', Test_Beauti.as_view(), name='test_beautifulsoup'),
    path('scraping-events-events_brite/', Event_Brite_P.as_view(), name='scraping-events-events_brite'),

    

]
