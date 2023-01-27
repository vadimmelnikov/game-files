The original game can be found here: https://www.mykanjo.com/members/kids/drawing-game. 

The original CSS is at https://mykanjo-webapp-ornvt.mongodbstitch.com/kanjo-production-domain-files/drawing-game-production-domain/styles.css and the modified version is in the root directory as styles.css. 

The original JS is at https://mykanjo-webapp-ornvt.mongodbstitch.com/kanjo-production-domain-files/drawing-game-production-domain/script.js and the modified version is in the root directory as script.js. 

To get the game to work locally, you need to add your own ID. 
Register (or log in) at https://www.mykanjo.com, copy the ID from the page https://www.mykanjo.com/members/kids/drawing-game and paste it into script.js (line 5) as the value for var userId = "ID". 

The game can be opened in a browser with index.html or with a tool like LiveServer in VSCode. To put the game on a production server, new images from the images folder need to be uploaded to the server (it seems they are uploaded to webflow) and the URLs need to be rewritten. I am currently using https://raw.githack.com/ as a CDN. You need to change the markup on the webflow page Kids/drawing-game. The JS and CSS will automatically be pulled from the repository through githack (if you update the files, you need to wait 5-10 minutes due to caching).