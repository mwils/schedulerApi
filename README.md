# Calendar scheduler api. Runs on AWS serverless

### Run and develop locally
1. Clone the repo
1. npm install
1. Create a mysql database and configure via config.js ( A Vagrant file is included to run mysql in a vagrant environment )
1. Start the api with `serverless offline start`

### Usage
1. Resource - An item that can be scheduled, Person, Room, Item
1. Hour - The available hours for the a resource
1. Client - The item / person that books the resource used to book a resource
1. Bookable - An event that has a duration. Used to calculate Availability
1. Availability - Used to get available time slots based on a Bookable duration

### Todo
1. Authentication
1. Multi tenant
1. A whole lot more