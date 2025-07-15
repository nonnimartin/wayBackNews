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
    "https://www.ynetnews.com",       // Israel
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

const getData = (thisKey, thisValue) => {
    browser.storage.local.get(thisKey).then(result => {
        return result;
    });
}

const storeData = (thisKey, thisVal) => {
    browser.storage.local.set({
    thisKey: thisVal,
    }).then(() => {
        console.log("Data saved");
    });
}

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

// initialize storage if empty
initializeStorage();

// Handle messages from popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveUrl') {
    console.log('got here!');
    handleSaveUrl(request.url)
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error('Save URL error:', error);
        sendResponse({ success: false });
      });
    return true;
  }
});

async function handleSaveUrl(url) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get('newsPapersList', (result) => {
      const urls = result.newspapersList || [];
      console.log('newspapers list = ', urls);
      if (!urls.includes(url)) {
        urls.push(url);
        browser.storage.local.set({ newspapersList: urls }, () => {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            console.log('URL saved:', url);
            resolve();
          }
        });
      } else {
        // URL already exists
        resolve(); 
      }
    });
  });
}