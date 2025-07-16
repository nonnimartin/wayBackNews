const newspaperWebsites = {
  // United States
  us: [
    "https://www.nytimes.com",
    "https://www.washingtonpost.com",
    "https://www.wsj.com",
    "https://www.latimes.com",
    "https://www.chicagotribune.com",
    "https://www.usatoday.com",
    "https://www.nydailynews.com",
    "https://www.bostonglobe.com",
    "https://www.nypost.com",
    "https://www.washingtontimes.com"
  ],
  
  // United Kingdom
  uk: [
    "https://www.theguardian.com",
    "https://www.bbc.com/news",
    "https://www.telegraph.co.uk",
    "https://www.thetimes.co.uk",
    "https://www.dailymail.co.uk",
    "https://www.independent.co.uk",
    "https://www.ft.com",
    "https://www.mirror.co.uk",
    "https://www.express.co.uk",
    "https://www.standard.co.uk"
  ],
  
  // International (English)
  international: [
    "https://www.reuters.com",
    "https://www.apnews.com",
    "https://www.bloomberg.com",
    "https://www.aljazeera.com",
    "https://www.economist.com",
    "https://www.foreignaffairs.com",
    "https://www.theatlantic.com",
    "https://www.newyorker.com",
    "https://www.time.com",
    "https://www.newsweek.com"
  ],
  
  // Europe (non-UK)
  europe: [
    "https://www.lemonde.fr",         
    "https://www.lefigaro.fr",        
    "https://www.spiegel.de",         
    "https://www.bild.de",            
    "https://www.corriere.it",    
    "https://www.repubblica.it",   
    "https://www.elpais.com",     
    "https://www.marca.com",      
    "https://www.dn.se",        
    "https://www.aftenposten.no"      
  ],
  
  // Asia
  asia: [
    "https://www.scmp.com",           // Hong Kong
    "https://www.japantimes.co.jp",   // Japan
    "https://www.koreatimes.co.kr",   // South Korea
    "https://www.straitstimes.com",   // Singapore
    "https://www.thehindu.com",       // India
    "https://www.timesofindia.com",   // India
    "https://www.chinadaily.com.cn",  // China (English)
    "https://www.asahi.com",          // Japan
    "https://www.dawn.com"            // Pakistan
  ],
  
  // Australia
  australia: [
    "https://www.smh.com.au",
    "https://www.theaustralian.com.au",
    "https://www.abc.net.au/news",
    "https://www.news.com.au",
    "https://www.afr.com"
  ],
  
  // Canada
  canada: [
    "https://www.theglobeandmail.com",
    "https://nationalpost.com",
    "https://www.cbc.ca/news",
    "https://www.torontosun.com",
    "https://montrealgazette.com"
  ],
  
  // Business/Financial Specific
  business: [
    "https://www.bloomberg.com",
    "https://www.ft.com",
    "https://www.wsj.com",
    "https://www.cnbc.com",
    "https://www.reuters.com/finance"
  ],
  
  // Technology News
  technology: [
    "https://techcrunch.com",
    "https://www.theverge.com",
    "https://www.wired.com",
    "https://arstechnica.com",
    "https://www.cnet.com"
  ]
};

const defaultNewspapers = [
  ...newspaperWebsites.us,
  ...newspaperWebsites.uk,
  ...newspaperWebsites.international,
  ...newspaperWebsites.europe,
  ...newspaperWebsites.asia,
  ...newspaperWebsites.australia,
  ...newspaperWebsites.canada,
  ...newspaperWebsites.business,
  ...newspaperWebsites.technology
];

let allNewspapers = [];

const getData = async (thisKey) => {
    return browser.storage.local.get(thisKey).then((result) => {
        console.log('result: ', result);
        return result[thisKey];
    });
}

const storeData = async (thisKey, thisVal) => {
    browser.storage.local.set({
    thisKey: thisVal,
    }).then(() => {
        console.log("Data saved");
        return;
    });
}

const appendData = async (thisKey, newVal) => {
    const result = await getData(thisKey);
    let urls = result || [];
    
    if (!urls.includes(newVal)) { 
        urls.push(newVal);
        console.log('Urls = ', urls);
        await browser.storage.local.set({
            [thisKey]: urls
        });
        console.log("Data saved");
    }
}

const removeData = async (thisKey, valueToRemove) => {
    try {
        // Get the current array
        const result = await getData(thisKey);
        
        if (!result) {
            console.log(`Key '${thisKey}' not found in storage`);
            return false;
        }

        // Filter out the value to remove
        const updatedArray = result.filter(item => item !== valueToRemove);

        // Save the updated array
        await browser.storage.local.set({
            [thisKey]: updatedArray
        });

        console.log(`Successfully removed '${valueToRemove}' from '${thisKey}'`);
        return true;
    } catch (error) {
        console.error(`Error removing data: ${error}`);
        return false;
    }
};

async function initializeStorage() {
  try {
    const currentData = await browser.storage.local.get();
    
    // Only initialize if empty
    if (Object.keys(currentData).length === 0) {
      console.log(currentData);
      await browser.storage.local.set({
        newspapersList: defaultNewspapers,
      });
      console.log("Storage initialized with defaults");
    }
  } catch (error) {
    console.error("Storage initialization failed:", error);
  }
}


async function getWaybackUrl(url) {
  try {
    
    const urlObject = new URL(url);
    url = urlObject.hostname + urlObject.pathname + urlObject.search + urlObject.hash;
    console.log('testUrl = ', url);

    console.log('testUrl 2 = ', url);

    const apiUrl = `https://archive.org/wayback/available?url=${url}`;
    
    console.log('Fetching archive for:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('API request failed with status:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Safely check the response structure
    if (!data?.archived_snapshots?.closest?.available) {
      console.log('No archive available for this URL');
      return null;
    }

    const archiveUrl = data.archived_snapshots.closest.url;
    
    // Validate the archive URL
    if (!archiveUrl || !archiveUrl.includes(url.replace(/^https?:\/\//, ''))) {
      console.error('Invalid archive URL:', archiveUrl);
      return null;
    }

    console.log('Found valid archive:', archiveUrl);
    return archiveUrl;
    
  } catch (error) {
    console.error('Error in getWaybackUrl:', error);
    return null;
  }
}

// initialize storage if empty
initializeStorage();

// Handle messages from popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      switch (request.action) {
        case 'saveUrl':
          await appendData('newspapersList', request.url);
          return { success: true };

        case 'deleteUrl':
          return { success: true };

        case 'thisPageLink':
          const url = await getWaybackUrl(request.link);
          console.log('Archive URL:', url);
          return { success: !!url, url };

        case 'checkForArchive': {
          const archiveUrl = await getWaybackUrl(request.link);
          if (archiveUrl) {
            try {
              await browser.tabs.sendMessage(sender.tab.id, {
                action: 'showArchiveBanner',
                archiveUrl
              });
              return { success: true };
            } catch (err) {
              console.error('Error sending message to tab:', err);
              return { success: false };
            }
          }
          return { success: false };
        }

        default:
          console.warn('Unknown action:', request.action);
          return { success: false };
      }
    } catch (error) {
      console.error(`${request.action} error:`, error);
      return { success: false };
    }
  };

  // Handle the async response
  const response = handleRequest();
  return response;
});