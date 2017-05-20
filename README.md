# MegaBoilerPlateFYP

How to install the environment :

Environment Prerequisites:

Download MongoBD. Place mongoDB in your system environment path.

You will need to create a folder for MongoDB to store its DB, by default it uses C:\data\db so navigate to the local disk "C" and create a "data" folder.

Inside the "data" folder create a "db" folder.

Download Nodejs. Place nodejs in your system environment path.

Open a command prompt and use the command "mongod" to start the mongo server.

Open another command prompt and navigate to the folder containing the project.

Run "npm install" to install all of the projects dependancies.

Run "bower install" to install all of the front end dependancies.

Run "npm start" to start the server.

Navigate to localhost:3000

If these instructions don't work, please let me know.

Final Year Project
Creating an SPA (Single Page Application) using Redux to create a brainstorming tool that uses d3s data visualization to create a mind map
By: Daniel O’Connor

Course: Computer Systems

Supervised by Nik Nikolov

This project is going to be a single page application(SPA) using React, Flux, Node.js, MongoDB, D3 and Webpack to make an attractive mind mapping application called “Bubblesort”.
A Persons brain processes visual information far quicker than it does text, which makes Mind Maps a great tool. As a result of organising information visually, it’s simple to understand tricky concepts and engage more with the ideas that you’ve been thinking about. You can visually represent the links between concepts, you can plan your ideas more easily - share them or explore concepts in greater depth. 
Have you ever heard the phrase – “A picture is worth a thousand words?” Well this is especially true when it comes to data visualisation. Data is confusing and lists are boring as well as unimaginative - People are visual by nature and prefer new, constructive means of looking at information. Because of all of this visual analytics is a very popular aspect of Data Mining, as I learned from a module “Data Mining and Data Warehousing” thought by my supervisor Dr.Nik Nikolov where we talked about visual analytics. “Visual Analytics is the science of analytical reasoning supported by a highly interactive visual interface” (Thomas and Cook, 2005).
The purpose of this project is to create a web-application in which users can sign up and easily create a Visual Network (A Mind Map). The Mind Map should be capable of mapping out a users ideas or used for organisational purposes. The Mind Map should look aesthetically pleasing as well as responding well to interaction from a user. There are multiple tiers to the Network, so that the user is able to navigate into a node on the network visualisation and then see the Graph populated out with that nodes children. This will allow topics/areas to be fully visual and to understand the relationships held in an intricate network.


Whenever someone needs to conceptualise an idea, one of the first things that they’ll go to is Mind mapping. Mind mapping is simple tool and its power stems directly from its simplicity. People can quickly and easily structure out their ideas in to separate and branching trees. It’s one of my favourite things to do when I’m given a task I need to work on or when feeling overwhelmed with things to do. Mind mapping helps you to plan and to feel like you’ve conceptualise every aspect needed. Because you can visually see it – the order, the hierarchy and the overlap. It’s all there on one page, in this visual network and it’s beautiful. They can clarify just about anything.
But what happens when you do not have a pencil? When you do not have paper? Before I started working on this project – I would have said just go out and buy some new paper and pencils because the resources online do not compare well a Mind map that you would sketch out yourself. Try use one. There are plenty of them out there. All of them more monolithic as the last with Sluggish performance, they are bloated with unnecessary features, drawn on ugly graph paper with Mind Maps that were allowed to crawl and sprawl.
There seems to be a learning curve to using these applications. They seem boring and a lot of times they keep your mind map public unless you pay a subscription fee. Which would make a lot of people uneasy about using them. The majority of people I asked would say that they’ve tried using some of these applications online, but disliked the complexity of the available applications. What they wanted was something easy to use. Something clean and uncluttered, and no matter how much I looked for a quick and easy Mind Map I could not find one I liked. This was the main reasoning for me deciding on this FYP, I actually wanted to make something I would use and would help me in my day to day life. And hopefully others as well.
Another motivating factor for this project was that I had wanted to build a website with this specific language stack – The most important language that I wanted to learn was React.js. I first heard about it in 2015 and wanted to use it in a project for a while now. I am interested in pursuing a career with web-app development in the future, and the two hottest topics at the moment are Angular 2.x and React. Having already worked with Angular1.x before I decided to try my hand at React instead for a change of pace.
Mike Bostock is one of creators of d3.js, and is one of the reasons why d3.js is as popular as it is today. I follow him on twitter, and read the New York Times articles that he does visualisations for, they are always very illustrative, and make you understand something that you would not have been able to conceptualise verbally. It is amazing what he can do with a json file and 50 lines of d3.js.

This application was build off a really nice boilerplate called "MegaBoilerPlate" made by Sahat Yalkabov. MegaBoilerplate creates starter projects, optimized for simplicity and ease of use in a variety of options regarding the platform (Nodejs, Static Sites, JS Libraries or Electron), framework(Express, Meteor etc), CSS Framework(Bootstrap, Foundation etc), CSS Preprocessor etc..... MegaBoilerPlates code is subject to an MIT License.

________________________________________________________
The MIT License (MIT)

Copyright (c) 2016 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

________________________________________________________

The above license applies to the code used in the initial commit of this repository(MEGABOILERPLATE) and does not apply to the rest of this repository. 
