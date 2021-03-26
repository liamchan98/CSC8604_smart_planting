import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import EddystoneBeaconScanner from '@abandonware/eddystone-beacon-scanner'
import nodeimu from 'nodeimu'

// Code is heavily influenced by Dan Jackson practicals from CSC8604 Module


const currentFolder = path.dirname(fileURLToPath(import.meta.url))

const app = express()

/* Using .get methods to send plantState# variable to HTML to determine
correct output
*/

app.get('/plantCond1', (req, res) => {
    res.json({
      plantCond1: plantState1,
    })
  })


app.get('/plantCond2', (req, res) => {
    res.json({
      plantCond2: plantState2,
    })
  })  

/* Express API used to host HTML pages in public folder */  
app.use('/', express.static(path.join(currentFolder, 'public')))

app.listen(3000, () => {
    console.log(`Listening at http://localhost:3000`)
})



var plantState1 = 0 // State of plant 1   (8 different states based on sensDataProcess1())
var plantState2 = 0 // State of plant 2  (8 different states based on sensDataProcess2())



const lastReadings = {
    microBit: {
        temperature: null,
        light: null,
    },
    raspberryPi: {
        time: null,
        humidity: null,
    },
}

//Filters used to point to specific microBits used in prototype

const filter1 = [
    'f4605712af0c'  // ID for MicroBit #1
]

const filter2 = [
    'dbf237e3bf32' // ID for MicroBit #2
]

/*
Using EddStone API to receive Bluetooth Broadcast 
from MicroBits. Data is received and assigned to
light & temperature to be usable in the server code.
Calling sensorUpdate() to update external sensors every second
after running.
*/

EddystoneBeaconScanner.on('updated', (beacon) => {
    if (filter1.join() && !filter1.includes(beacon.id)) return
    const data1 = {
        light: parseInt(beacon.namespace, 16),
        temperature: parseInt(beacon.instance, 16),
    }
    sensorUpdate('microBit1', data1)
        
})

    EddystoneBeaconScanner.on('updated', (beacon) => {
    if (filter2.join() && !filter2.includes(beacon.id)) return
    const data2 = {
        light: parseInt(beacon.namespace, 16),
        temperature: parseInt(beacon.instance, 16),
    }
    sensorUpdate('microBit2', data2)
        
            
    
})

EddystoneBeaconScanner.startScanning(true)


/* Raspberry Pi sensor humidity + local time values are
updated every second. nodeimu API required to read data 
from Raspberry Pi HAT
*/

const imu = new nodeimu.IMU()

function sensorValues(err, values) {
    if (err) { console.error(err); return }
    const data = {
        time: values.timestamp,
        humidity: values.humidity,
    }
    sensorUpdate('raspberryPi', data)
}

setInterval(() => imu.getValue(sensorValues), 1000)


function sensorUpdate(location, data) {
    lastReadings[location] = data
    //console.log(`UPDATE: ${location}: ` + JSON.stringify(data)) //- Debugging Purposes

    



function sensDataProcess1() {
    data = lastReadings;

    /*Boolean Variables set to determine plant condition based on 3 variables */
            var aboveTemp = false
            var belowLight = false
            var belowHumid = false
            var hour = data.raspberryPi.time.getHours() 
            var nightTime = true 

        /*Between 7:00 and 20:00 - Should change depending on time of year in future iterations. Determine if optimal values should change to night optimal values if hour
        at Raspberry Pi server is between the two set hours*/
             if (hour >= 7 && hour <= 20) nightTime = false 

        
        
            //Day Optimal Values - Should change depending on type of plant in future iterations
            
            var optimalTemp = 20   // If sensor is ABOVE 
            var optimalLight = 150 // If sensor is BELOW 
            var optimalHumid = 40  // If sensor is BELOW 
        
        
            //Night Optimal Values - i.e. at night sensor doesn't flag light level as user cannot control this
            //Night Optimal Values - Should change depending on type of plant in future iterations
            if (nightTime == true) optimalTemp = 20  // If sensor is ABOVE 
            if (nightTime == true) optimalLight = 0 // If sensor is BELOW
            if (nightTime == true) optimalHumid = 30 // If sensor is BELOW


            //Comparing values of sensors to optimal day/night values to determine boolean output
            if (data.microBit1.temperature > optimalTemp) aboveTemp = true
            if (data.microBit1.light < optimalLight) belowLight = true
            if (data.raspberryPi.humidity < optimalHumid) belowHumid = true
        
        
            /*Different combinations of 3 booleans has 8 possible states each state is assigned a number and sets
            a plantState variable that specific number. This variable is then fetched in HTML using .get methods
            in server code. This determines the state the sensor is in and determines the correct output image is used in
            HTML code
            */
            if (aboveTemp == true && belowLight == false && belowHumid == false) plantState1 = 1 //(1,0,0) //Too Hot
               
            if (aboveTemp == false && belowLight == true && belowHumid == false) plantState1 = 2 //(0,1,0) //Below Light
                
            if (aboveTemp == false && belowLight == false && belowHumid == true) plantState1 = 3 //(0,0,1) //Below Humid
              
            if (aboveTemp == true && belowLight == true && belowHumid == false) plantState1 = 4 //(1,1,0) // Too Hot & Below Light
               
            if (aboveTemp == true && belowLight == false && belowHumid == true) plantState1 = 5 //(1,0,1) // Too Hot & Below Humid
                
            if (aboveTemp == false && belowLight == true && belowHumid == true) plantState1 = 6 //(0,1,1) // Below Light & Below Humid
        
            if (aboveTemp == true && belowLight == true && belowHumid == true) plantState1 = 7 //(1,1,1) // Too Hot & Below Light & Below Humid
                
            if (aboveTemp == false && belowLight == false && belowHumid == false) plantState1 = 8 //(0,0,0) // Perfect
            
       
       //Console out statements to debug issues with code and demonstration

       //console.log ('plant 1: ' + plantState1)
       //console.log ('plant 1 optimal LIGHT ' + optimalLight)
       //console.log ('plant 1 optimal TEMP ' + optimalTemp)
       //console.log ('plant 1 optimal HUMID ' + optimalHumid)
    }


/*Code is simply copy and pasted from sensDataProcess1() however, is changed to read and compare data from MicroBit2
 plantState2 variable is updated depending on output from this function */

    function sensDataProcess2() {
        data = lastReadings;
            
            var aboveTemp = false
            var belowLight = false
            var belowHumid = false
            var hour = data.raspberryPi.time.getHours() 
            var nightTime = true 
    
            //Between 7:00 and 20:00 - Should change depending on time of year in future iterations
            if (hour >= 7 && hour <= 20) nightTime = false 
            
    
    
            
            //Day Optimal Values - Should change depending on type of plant in future iterations
            var optimalTemp = 20   // If sensor is ABOVE 
            var optimalLight = 90 // If sensor is BELOW 
            var optimalHumid = 50  // If sensor is BELOW 
            
            
    
            //Night Optimal Values - Should change depending on type of plant in future iterations
            if (nightTime == true) optimalTemp = 20  // If sensor is ABOVE 
            if (nightTime == true) optimalLight = 0 // If sensor is BELOW
            if (nightTime == true) optimalHumid = 45 // If sensor is BELOW
    
    
            if (data.microBit2.temperature > optimalTemp) aboveTemp = true
            if (data.microBit2.light < optimalLight) belowLight = true
            if (data.raspberryPi.humidity < optimalHumid) belowHumid = true
            

            
            if (aboveTemp == true && belowLight == false && belowHumid == false) plantState2 = 1 //(1,0,0) //Too Hot
                   
            if (aboveTemp == false && belowLight == true && belowHumid == false) plantState2 = 2 //(0,1,0) //Below Light
                    
            if (aboveTemp == false && belowLight == false && belowHumid == true) plantState2 = 3 //(0,0,1) //Below Humid
                  
            if (aboveTemp == true && belowLight == true && belowHumid == false) plantState2 = 4 //(1,1,0) // Too Hot & Below Light
                   
            if (aboveTemp == true && belowLight == false && belowHumid == true) plantState2 = 5 //(1,0,1) // Too Hot & Below Humid
                    
            if (aboveTemp == false && belowLight == true && belowHumid == true) plantState2 = 6 //(0,1,1) // Below Light & Below Humid
            
            if (aboveTemp == true && belowLight == true && belowHumid == true) plantState2 = 7 //(1,1,1) // Too Hot & Below Light & Below Humid
                    
            if (aboveTemp == false && belowLight == false && belowHumid == false) plantState2 = 8 //(0,0,0) // Perfect
                
            
            //Console out statements to debug issues with code and demonstration
            
            //console.log ('plant 2: ' + plantState2)
            //console.log ('plant 2 optimal LIGHT ' + optimalLight)
            //console.log ('plant 2 optimal TEMP ' + optimalTemp)
            //console.log ('plant 2 optimal HUMID ' + optimalHumid)

            
        }
    
    
        /*Code currently requires programmer to manually update and copy code for extra MicroBits 
        this is not optimal and future iterations should have ways to add new MicroBits over time without
        further editing of server code. Also, this code is not optimal due to lack of technical knowledge*/




    setInterval(sensDataProcess1, 5*1000)
    setInterval(sensDataProcess2, 5*1000)
   
}

