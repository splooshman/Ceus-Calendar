README: 


This application was built with Next.js, typescript, and some components from React.


Running the Server:
After installing the relevant dependencies e.g. npm install, we are able to run the development server in 'ziyuan_app':


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Additional Details:


This server is a prototype of ‘ServiHub’, a booking engine for tuition centers. On the landing page, users can choose to view the calendar schedule as a business or as a customer. The 2 views are distinguished with their own color scheme (maroon for business, blue for customer), as well as a header on the top of the screen. Users are able to navigate to the landing page from the respective business/customer views with a button on the top left.


As both a business and customer user, users are able to view a calendar schedule, with the relevant approved scheduled events displayed. The calendar can be viewed monthly, or weekly and daily. The weekly and daily views provide customers with the ability to inspect the specific timings of each day itself.


As a business, users are able to view booking requests made by customers, as well as to schedule any events that they want without the need for approval (provided the form fields entered are valid and max slots are not exceeded).


As a customer, users are able to submit booking requests for business approval.

For all scheduled events, there is also a maximum slot of 3 in place: Users are only allowed to schedule a maximum of 3 events for the same time slot.


***Issues***
With no backend implementation, I am currently unable to store data of the scheduled classes properly, and can only do so on local data storage; as a result, the scheduled classes of users will be cleared after refreshing the browser. Additionally, this also limits the functionality of the application for users to properly send and request for classes (only the frontend UI/UX for this function is implemented). 


Additionally, there is an issue with the recurring events function. Recurring events set will all be at 12am, and not at the time slot located.
 

3 Unit Tests:


Test 1: renders basic UI elements opens 
Test 2: scheduling dialog when date is clicked 142ms
Test 3: shows success UI when event is scheduled
