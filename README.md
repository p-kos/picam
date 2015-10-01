# picam
![](http://1.bp.blogspot.com/-MJS-yG55sb4/VeRJdh74a-I/AAAAAAAAGiU/3CS3NW7bWHw/s1600/Screen%2BShot%2B2015-08-31%2Bat%2B8.30.49%2BAM.png)

Using webcam for secure home, with motion, NodeJS, AngularJS in raspberry 

## Installation

### NodeJS 
There are many versions of [NodeJS](http://nodejs.org) to download but is better to choose one working with all npm packages need, I found issues with lasted version with _sqlite3_ so you can download what I used.

	wget http://nodejs.org/dist/v0.10.10/node-v0.10.10-linux-arm-pi.tar.gz

Then uncompress it
	
	tar xvfz node-v0.10.10-linux-arm-pi.tar.gz
	
Test if it is working
	
	./node-v0.10.10-linux-arm-pi/bin/node --version

It should show you *v0.10.10*

Then add the path to you profile, in raspbian the file is .profile (make sure you are at home `cd ~` )

	sudo vi .profile

Then add the following lines to the file

	NODE_JS_HOME=/home/pi/node-v0.10.10-linux-arm-pi
	PATH=$PATH:$NODE_JS_HOME/bin

That should be enought, try with the following command again

	node --version
	
It should show you *v0.10.10*

### Motion
First we need to update then install motion

	sudo apt-get update
	sudo apt-get motion
	
Open the configuration file and replace the lines by
	
	sudo vi /etc/motion/motion.conf
	
	width 320
	height 240
also
	
	threshold 3000
	
interval

	snapshot_interval 60

target directory

	target_dir /home/pi/picam/captures
	
The most important 

	on_picture_save node /home/pi/picam/processImage.js /home/pi/picam/dbImages.db %f
	
What you did in last line is when a new image is saved after capture run a NodeJS script and use the file _dbImages.db_ as SQLite3 database any file in _%f_ 

The save the file by pressing **Esc :wq!** in _vi_


### Clone the Project
In raspberry choose a folder and clone the project (make sure to give it the proper rights). I used ~ (home)

	cd ~
	chmod 777 motion
	clone https://github.com/p-kos/picam.git 
	
### Packages

Go to folder picam and install the packages needed

	cd ~/picam
	npm install
	
## Let's get it work

### Server
First add the permission to run the picam server

	sudo chmod +x picam.sh
	
Then run the server 

	./picam.sh

The server will run under port **3705** 

### Client

Open your favorite browser the raspberry pi url

	http://192.168.1.123:3705 

Mine is under that IP address.

All the captures images will be saved under /home/pi/picam/captures and the database file will index those

From client the **motion** can be started by a left up button 

### Motion
Motion can be started by separte through command line
	
	motion
	
To cancel **Ctrl + C** 

### Autostart
In order to autostart the picam server edit the rc.local file at the end with the following

	sudo vi /etc/rc.local
	
add

	/home/pi/picam/picam.sh &
	
before line

	exit 0
	

Restart the system

	sudo shutdown -r now

## Author
Marco Zarate (P-KoS)

[pkitos@gmail.com](mailto:pkitos@gmail.com)

[@p_kos](https://twitter.com/p_kos)

[Linked in](https://bo.linkedin.com/in/marcozaratez)

## Thanks
Thx to many post I saw in order to learn how to configure motion.
[Video Vigilancia con el Raspberry Pi](http://patolin.com/blog/2012/12/12/video-vigilancia-con-el-raspberry-pi/)

[Jeremy's Blog](http://jeremyblythe.blogspot.com) 
	
