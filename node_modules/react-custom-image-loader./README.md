
# React Custom Image Loader:

  

This package provides a simple react component, which enables the user to have a custom image loader.

  
  

## Demo

[Demo Page](https://react-custom-loader.netlify.com/)

  
 
## Installation
  

    npm install custom-image-loader

  

## Usage

    <CustomImageLoader
    	image={'https://image.flaticon.com/icons/png/512/1499/1499840.png'}
    	isLoaded={true}
    	circle={false}
    	speed={2}
    	animationType={'evaporate'}
    />

  
 
### Options

>  ***image*** (*): Should specify the URL or the path from the local system.

>  ***animationType*** (*): Should specify the animation type.

>  ***isLoaded***: It takes a Boolean, by default it is true. By this we can toggle the loader.

>  ***circle***: It takes a Boolean, by default it is false. true specifies the loader in a circle.

>  ***speed***: It takes an Integer, by default it is 2.
