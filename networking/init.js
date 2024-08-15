const axios = require('axios')
   let serverUpArr = [];
   let serverDownArr = [];
    
    const websites = [
      'https://www.google.com',
      'https://www.github.com',
      "https://www.chatgpt.com/",
      "https://amazon.com/",
      "https://m.facebook.com/",
      "https://www.instagram.com/"
    ];
    
    async function checkWebsite(url) {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          serverUpArr.push(url)
          console.log(`${url} is UP (Status: ${response.status})`);
        } else {
          serverDownArr.push(url)
          console.log(`${url} might be DOWN (Status: ${response.status})`);
        }
      } catch (error) {
        serverDownArr.push(url)
        console.log(`${url} is DOWN (Error: ${error.message})`);
      }
    }
    
    function monitorWebsites() {
      websites.forEach(checkWebsite);
    }

   monitorWebsites()

   module.exports = { serverUpArr, serverDownArr };
