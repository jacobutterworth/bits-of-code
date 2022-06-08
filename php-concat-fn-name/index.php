<?php


function getTemperature()
{
    return 'temp';
}
function getHumidity()
{
    return 'humidity';
}
function getWindSpeed()
{
    return 'windspeed';
}
function getPrecipitationChance()
{
    return 'prep chance ';
}
function getPrecipitationDensity()
{
    return 'prep density ';
}

// instead of doing this:
$weather = [];
$weather[] = getTemperature();
$weather[] = getHumidity();
$weather[] = getWindSpeed();
$weather[] = getPrecipitationChance();
$weather[] = getPrecipitationDensity();
return $weather;


// you can do this: 
$weatherFunctions = ['Temperature', 'Humidity', 'WindSpeed', 'PrecipitationChance', 'PrecipitationDensity'];
$weather2 = [];
foreach ($weatherFunctions as $weatherFunction) {
    $functionName = 'get' . $weatherFunction;
    $weather2[] = $functionName();
}
return $weather2;

