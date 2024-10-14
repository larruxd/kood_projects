## GROUPIE-TRACKER
### Description
Groupie Trackers consists on receiving a given API and manipulate the data contained in it, in order to create a site, displaying the information.

### API
The [API](https://groupietrackers.herokuapp.com/api) consists of 4 parts: 

- [Artists](https://groupietrackers.herokuapp.com/api/artists)
- [Locations](https://groupietrackers.herokuapp.com/api/locations)
- [Dates](https://groupietrackers.herokuapp.com/api/dates)
- [Relations](https://groupietrackers.herokuapp.com/api/relation)

### How to run
1. Clone the repo
>`git clone https://01.kood.tech/git/kyynkarl/groupie-tracker.git`
2. Run the program
> `go run .`
3. Allow the incoming network connection
4. Open your web browser and navigate to http://localhost:8080

### How to use

On the home page you can see all of the artists mentioned in the API in their own seperate box, together with:
* An image illustrating the band
* Band name
* Creation date
* First album
* A list of band members

If you wish to get information about the dates and locations where your favourite band is performing, click on the band box.

### Authors
* @kyynkarl
* @laurilaretei