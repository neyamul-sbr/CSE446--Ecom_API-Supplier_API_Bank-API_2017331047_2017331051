# CSE446--Ecom_API-Supplier_API_Bank-API_Web Project
### About API:

APIs are the mechanisms that enable two software components to communicate with each other using a set of
definitions and protocols.A web API is an application programming interface for either a web server or a web
browser. It is a web development concept, usually limited to a web application’s client-side (including any web
frameworks being used), and thus usually does not include web server or browser implementation details such as
SAPIs or APIs unless publicly accessible by a remote web application.

### Project Task Description:

In this project, we are tasked to make 3 different APIs called E-commerce API, Bank API, and Seller or Supplier API. 
And do interaction between them to make an effective E-commerce ecosystem that will simulate the e-commerce services among those APIs.

## Our Implementations:

In this project, we developed 3 web APIs:
1. E-Commerce API, 
2. Bank API,
3. Seller or Supplier API,

Then we make the APIs interact with each other to simulate many business functionalities. That ultimately creates an E-Commerce Business ecosystem. These 3
APIs functionalities and intersections are all tested with API testing tools like Postman.  After the test, we can
say that our developed APIs are fully functional. That creates an e-commerce ecosystem as demanded by the
requirement of the CSE446 API project. In addition, These 3 APIs are fully compatible with any Single Page
Application framework for the front end. But that is outside of the project requirement. But for demonstration
purposes of the font end of the APIs, we developed another View-based application that can show the front end.




# Installing the APIs on your Local Machines:
- At first Clone or Download the repository. Then Inside the repository follow the instructions:
- Command Line: Open the command line or terminal

- Installing NPM: Install npm by writing in the terminal:
  ```
  npm install -g npm
  ```
  
- Bank API: 

  - Go to the Bank-API directory. Open terminal in that directory and then write the command:
     ```
     npm i
     ```
     This will install all the dependency in needed for the Bank API in the package.json file.
  - To start the App then simply write the command:
      ```
      npm start
      ```
 Then this api will start on localhost in 8000 port.
     
 - E-Commerce API:
 
    - Go to the E-Com-API directory. Open terminal in that directory then write the command:
      ```
      npm i
      ```
     This will install all the dependency in needed for the E-Commerce API in the package.json file.
    - To start the App then simply write the command:
       ```
       npm start
       ```
   Then this api will start on localhost in 3000 port.
   
 - Supplier/Seller API:
    
 
    - Go to the Seller API directory. Open terminal in that directory then write the command:
       ```
       npm i
       ```
     This will install all the dependency in needed for the E-Commerce API in the package.json file.
    - To start the App then simply write the command:
       ```
       npm start
       ```
  Then this api will start on localhost in 5050 port.
  
  Now We can test the API endpoints with the Postman API:
  
  ## API endpoints:
  
   - ## E-Commerce API:
   
   
     <img src="ss/signup.PNG"/>
     <img src="ss/login.PNG"/>
     <img src="ss/logout.PNG"/>
     <img src="ss/viewALL.PNG"/>
     <img src="ss/product_description.PNG"/>
     <img src="ss/addCart.PNG"/>
     <img src="ss/deleteCart.PNG"/>
     <img src="ss/viewCart.PNG"/>
     <img src="ss/createOrder.PNG"/>
     <img src="ss/getorders.PNG"/>
     <img src="ss/getallOrders.PNG"/>
     
     
   - ## Bank API:
   
      <img src="ss/add_bank_user.PNG"/>
      <img src="ss/checkBalance.PNG"/>
      <img src="ss/transaction_req.PNG"/>
      <img src="ss/transaction_confirmation.PNG"/>
      
      
   - ## Seller API:
        
      <img src="ss/addSupplierProduct.PNG"/>
      <img src="ss/productDelivaryRequest.PNG"/>
         
  
  
     ## Just for demo. of a simple UI frontend from the APIs we also developed a EJS template based frontend.
      Install:
        Go to the E-Com-Web-API-Front-End-ViewEjs directory. Open terminal in that directory then write the command:
        
        
        ```
        npm i
        ```

     To start the App then simply write the command:
    
        ```
         npm start
        ```
         
     ## Then this api will start on localhost in 3001 port.
   
     ##Then the functinalites can be demonstrated in the UI:
     
     <img src="ss2/signup.PNG"/>
     <img src="ss2/email_ham.png"/>
     <img src="ss2/homePage.PNG"/>
     <img src="ss2/product description.PNG"/>
     <img src="ss2/cart.PNG"/>
     <img src="ss2/orders.PNG"/>
     
     ## The whole Order Flow of the project is demonstrated in below chart from 1 to 9 Ascending order
    
       <img src="ss2/wholeFlow.PNG"/>
     
     
     
     
       
   
 
     

  
  

