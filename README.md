# About

This library contains building blocks of most frontend web applications. It provides typings, managers and utility classes.

# Installation and Usage
To install, run `npm install app-base-lib`. Checkout the source code documentation for usage.

# Highlighted Features
Below are some features provided by this library:

## 1. Data Broker
A data broker is an object that provides an interface for a parent and child side to communicate, adhereing to principles in SOLID design patterns.

The child side askes the parent for data and emits event to the parent side. This can be viewed in a family setting where a relationship exists between parents and their children in which parents serves their children. Parents gives their children what they want and observes them to watch their wellbeing. The databroker is based on this kind of relationship.

It is well suited for both realtime and pull based applications.

In projects where the program needed is split into libraries/dependencies which is then given to various developers to build in isolation, the data broker architecture can be used as an interface between the main program acting as parent side and the library acting as the child side. For example in a social media application, a developer might be instructed to build a client side friend-list library that provides creation, deletion and listing UI features for friends a user has on the application, the data broker can be used for interfacing the main program and the library utilizing the data broker CRUD and pagination features that has done the heavy lifting.

A list of functionalities the data broker provides are as follows:

### a. CRUD data management
When the data is CRUD based, it manages the CRUD behavior and there are utilities for easy manipulation.

### b. CRUD UI action flow execution.
A CRUD UI action happens user presses a UI component(e.g. button) to create, update or delete a data. There are procedures that when called delivers CRUD UI experience by running a mini-framework( an algorithm ) that allows IOC( inversion of control ) using callbacks provided.

Below is an algorithm that is run when a create CRUD UI action happens:
1. Start
2. IOC - call function to get input from UI
3. IOC - call beforeCreate callback if provided
4. show progress indicator
5. IOC - call create callback which should contain a creation logic e.g. post to a server
6. hide progress indicator
7. If creation is successful goto 8 else 12
8. save the data to cache
9. show UI success message
10. IOC - call afterCreate success callback
11. goto 15
12. show UI error message
13. IOC - call afterCreate error callback
14. goto 15
15. Stop

### c. Data caching
In most cases the child side will ask for data regularly. The data broker provides caching which can improve performance by reducing the load on the parent side and reducing latency.

### d. Data Consistency
The parent side is responsible for sending new data updates to the child side which should listen to ensure the data it holds is consistent. The data broker will automatically reflect these updates on the current data held. Also, the data broker desperately tries to keep the nooks and cranies of the child side consistent by quickly supplying recent data it finds in a part to other parts.

### e. Normalized and Unnormalized data handling
A normalized data is a data that completely have all data fields it should contain, while an unnormalized data have partial data fields. For example, an unnormalized( not having id,createdAt,modifiedAt ) todo data can be created when a user creates a new todo through the UI. A normalized( having id,createdAt,modifiedAt ) copy is returned by the server when the unnormalized todo data is posted. The data broker puts this behavior into concern and also makes sure all data the child side receives are normalized.

## 2. Paginated Data Manager
This is a class that manages paginated data by providing methods to both manipulate the data efficiently and determine the pagination status.

# Usage In Frameworks/Libraries

## Angular
In angular a service can be created 