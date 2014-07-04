# URL Shortener

### Check out this project in action at [http://shoe.io/u](http://shoe.io/u).

This project is a simple URL shortener. When trying out a new library or framework I often turn to building a URL shortener, one of the simplest web applications. In this example I wanted to build something with AngularJS. The URL Shortener takes a long URL and returns a shortened URL. Using the short URL simply redirects the user to the original long URL. The site provides a few metrics showing the last time the link was used and how many hits each link has received. Users can authenticate via Twitter to keep track of their links. A RESTful API powers this single-page app. 

This will continue to be a learning/sandbox project.  

## Configuration
Install dependencies. 
    
    $ npm install
    $ bower install 

Rename 'sample-config.js' to 'config.js' or obtain the decryption key for the Makefile.

Twitter authentication is used to save shortened URLs for a particular user. 

Fire up the site

    $ npm start

Navigate to http://localhost:8089/u 

## Notes 
This project uses my own auth redirect tool, and is not needed to shorten URLs.

