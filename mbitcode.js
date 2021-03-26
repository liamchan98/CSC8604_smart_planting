//Code that is flashed on to Micro:Bits using the makecode.microbit tool. 
// https://makecode.microbit.org/#editor

basic.forever(function () {
    bluetooth.advertiseUid(
    input.lightLevel(),
    input.temperature(),
    7,
    false
    )
    basic.pause(500)
})

/*
MicroBit is set to advertise the unique ID associated with the particular
MicroBit and also the reading of their light level and temperature.
*/  
