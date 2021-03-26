# CSC8604_smart_planting

.html
.mjs
.js
.css

#### Intro
This repository includes the source code for my contribution towards my CSC8604 module. Technically speaking the code in this repository will allow a user to display an image(s) on mutiple html pages. The source of this image is changed using code in server.mjs that changes the source of the code by reading an input from 2 sensors. The intention of which is to use sensors to try and depict how a plant may feel depending on the physical conditions around the sensor. This is a low-fidelty protoype and serves to act as a proof of concept rather than a fully built solution.

#### Technology
Server.mjs makes use of 2 BBC MicroBits that are broadcasting light and temperature data. This data alongside humidity and time data captured by a Raspberry Pi using the HAT sensor is processed within the server.

#### Processing
After data capture the data is processed by comparing the data against (arbitrarily) set optimal plant data. By comparing the states server will determine what state the plant is in depending on if the plant is under/exceeds values set in the server code. This is a proof of concept therefore, doesn't include all variables and will compare values very basically. The physical data tested are Temperature(M:Bit),Light Level(M:Bit), Humidity(Raspberry Pi HAT). 

#### Output
The state of the sensor is processed and then is fetched in html which are styled using standard .html formatting and .css styling. files using .fetch methods in express. Using the processing output we can tell the html to change the source of an image on a webpage to match the state that the plant/sensor is currently in. 

#### Future

Potential future development could be to add to this. Code is currently unoptomised and doesn't feature many of the features I hope to have in a final iteration. Also, with more sensors and variables we can increase the amount of states to increase the complexity of the output. 
