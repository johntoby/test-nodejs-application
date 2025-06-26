const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 2000;

app.get('/', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear - 1 - i);
    
    let html = '<h1>Nobel Prize Winners - Previous 5 Years</h1>';
    
    for (const year of years) {
      const response = await axios.get(`https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeYear=${year}`);
      
      html += `<h2>${year}</h2>`;
      
      if (response.data.nobelPrizes && response.data.nobelPrizes.length > 0) {
        response.data.nobelPrizes.forEach(prize => {
          html += `<h3>${prize.category.en}</h3><ul>`;
          prize.laureates?.forEach(laureate => {
            const name = laureate.knownName?.en || 'Organization';
            html += `<li>${name}</li>`;
          });
          html += '</ul>';
        });
      } else {
        html += '<p>No data available for this year.</p>';
      }
    }
    
    res.send(html);
  } catch (error) {
    res.send('<h1>Error fetching Nobel Prize data</h1>');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});