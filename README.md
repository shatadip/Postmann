# Postmann
A postman like Chrome extension to quickly fetch response against <font color="#007F31">GET</font>, <font color="#AD7A03">POST</font>, <font color="#0053B8">PUT</font>, <font color="#623497">PATCH</font>, <font color="#d73a49">DELETE</font> HTTP requests

## Concept

Postmann aims to simplify the testing and debugging of APIs by emulating the functionality of a postman. It allows users to effortlessly create and send various types of HTTP requests and view the responses, all within the convenience of their Chrome browser.

## Technologies

Built with React, TypeScript, and Vite.

## Features

- **Request Types:** Easily send <font color="#007F31">GET</font>, <font color="#AD7A03">POST</font>, <font color="#0053B8">PUT</font>, <font color="#623497">PATCH</font>, and <font color="#d73a49">DELETE</font> HTTP requests.
- **User-Friendly Interface:** A simple and intuitive interface for constructing requests with necessary parameters (Body in JSON or Raw).
- **Response Viewer:** Quickly view and analyze the responses received from the server (Prettified, Raw and Headers received).
- **Efficiency:** Speed up the testing process by eliminating the need for external tools or applications.
- **JSON Response Handling:** Easily read both raw and prettified JSON responses for better analysis.

## How to Use

1. **Installation:**
   - Add the extension to your Chrome browser.
   - Navigate to the Chrome Web Store and search for "Postmann," then click on "Add to Chrome."

2. **Accessing Postmann:**
   - Once installed, find the Postmann icon in the Chrome toolbar.
   - Click on the icon to open the extension.

3. **Using Locally:**
   - To use Postmann locally on your computer, load the unpacked `dist` folder.
   - Load the unpacked extension by going to `chrome://extensions/`, enabling "Developer mode," and clicking on "Load unpacked." Select the `dist` folder as the source.

4. **Sending Requests:**
   - Choose the desired HTTP request type (<font color="#007F31">GET</font>, <font color="#AD7A03">POST</font>, <font color="#0053B8">PUT</font>, <font color="#623497">PATCH</font>, <font color="#d73a49">DELETE</font>).
   - Enter the required parameters and URL.
   - Click the "Send" button to dispatch the request.

5. **Viewing Responses:**
   - The extension will display the server's response in a clear and organized manner.
   - JSON responses can be viewed in both raw and prettified formats, enhancing readability and analysis.
   - Analyze the response to ensure the request was processed correctly.

## Recommended Test APIs

Explore and test various functionalities using the following public APIs:

1. **reqres.in - Hosted REST-API with Fake Data**
   - LIST USERS (<font color="#007F31">GET</font>): [https://reqres.in/api/users?page=2](https://reqres.in/api/users?page=2)
     - Response code: 200
   - SINGLE USER (<font color="#007F31">GET</font>): [https://reqres.in/api/users/2](https://reqres.in/api/users/2)
     - Response code: 200
   - SINGLE USER NOT FOUND (<font color="#007F31">GET</font>): [https://reqres.in/api/users/23](https://reqres.in/api/users/23)
     - Response code: 404
   - DELAYED RESPONSE (<font color="#007F31">GET</font>): [https://reqres.in/api/users?delay=3](https://reqres.in/api/users?delay=3)
     - Response code: 200
   - CREATE USER (<font color="#AD7A03">POST</font>): [https://reqres.in/api/users](https://reqres.in/api/users)
     - Body:
       ```json
       {
           "name": "morpheus",
           "job": "leader"
       }
       ```
     - Response code: 201
   - UPDATE USER (<font color="#0053B8">PUT</font>): [https://reqres.in/api/users/2](https://reqres.in/api/users/2)
     - Body:
       ```json
       {
           "name": "morpheus",
           "job": "zion resident"
       }
       ```
     - Response code: 200
   - UPDATE USER (<font color="#623497">PATCH</font>): [https://reqres.in/api/users/2](https://reqres.in/api/users/2)
     - Body:
       ```json
       {
           "name": "morpheus",
           "job": "zion resident"
       }
       ```
     - Response code: 200
   - DELETE USER (<font color="#d73a49">DELETE</font>): [https://reqres.in/api/users/2](https://reqres.in/api/users/2)
     - Response code: 204
   - LOGIN SUCCESSFUL (<font color="#AD7A03">POST</font>): [https://reqres.in/api/login](https://reqres.in/api/login)
     - Body:
       ```json
       {
           "email": "eve.holt@reqres.in",
           "password": "cityslicka"
       }
       ```
     - Response code: 200
   - LOGIN UNSUCCESSFUL (<font color="#AD7A03">POST</font>): [https://reqres.in/api/login](https://reqres.in/api/login)
     - Body:
       ```json
       {
           "email": "eve.holt@reqres.in"
       }
       ```
     - Response code: 400

2. **Public APIs**
   - Retrieve a list of public APIs cataloged in the project.
   - Sample API URL: [https://api.publicapis.org/entries](https://api.publicapis.org/entries)
   - Request Type: <font color="#007F31">GET</font>

3. **Cat Facts**
   - Receive random cat facts via text message every day.
   - Sample API URL: [https://catfact.ninja/fact](https://catfact.ninja/fact)
   - Request Type: <font color="#007F31">GET</font>

4. **CoinDesk**
   - View the real-time Bitcoin Price Index (BPI).
   - Sample API URL: [https://api.coindesk.com/v1/bpi/currentprice.json](https://api.coindesk.com/v1/bpi/currentprice.json)
   - Request Type: <font color="#007F31">GET</font>

5. **Bored**
   - Find something to do with suggestions for random activities.
   - Sample API URL: [https://www.boredapi.com/api/activity](https://www.boredapi.com/api/activity)
   - Request Type: <font color="#007F31">GET</font>

6. **Agify.io**
   - Predict the age of a person based on their name.
   - Sample API URL: [https://api.agify.io?name=meelad](https://api.agify.io?name=meelad)
   - Request Type: <font color="#007F31">GET</font>

7. **Genderize.io**
   - Predict the gender of a person based on their name.
   - Sample API URL: [https://api.genderize.io?name=luc](https://api.genderize.io?name=luc)
   - Request Type: <font color="#007F31">GET</font>

8. **Nationalize.io**
   - Predict the nationality of a person based on their name.
   - Sample API URL: [https://api.nationalize.io?name=nathaniel](https://api.nationalize.io?name=nathaniel)
   - Request Type: <font color="#007F31">GET</font>

9. **Data USA**
   - Retrieve US public data, such as population data.
   - Sample API URL: [https://datausa.io/api/data?drilldowns=Nation&measures=Population](https://datausa.io/api/data?drilldowns=Nation&measures=Population)
   - Request Type: <font color="#007F31">GET</font>

10. **Dogs**
   - Brighten your day with random dog images.
   - Sample API URL: [https://dog.ceo/api/breeds/image/random](https://dog.ceo/api/breeds/image/random)
   - Request Type: <font color="#007F31">GET</font>

11. **IPify**
    - Get your current IP address.
    - Sample API URL: [https://api.ipify.org?format=json](https://api.ipify.org?format=json)
    - Request Type: <font color="#007F31">GET</font>

12. **IPinfo**
    - Retrieve information about a specified IP address.
    - Sample API URL: [https://ipinfo.io/161.185.160.93/geo](https://ipinfo.io/161.185.160.93/geo)
    - Request Type: <font color="#007F31">GET</font>

13. **Jokes**
    - Enjoy random jokes or get jokes based on type, such as programming jokes.
    - Sample API URL: [https://official-joke-api.appspot.com/random_joke](https://official-joke-api.appspot.com/random_joke)
    - Request Type: <font color="#007F31">GET</font>

Now, you will also receive and be able to view response headers in the API responses.

Feel free to explore and integrate these APIs into your development and testing workflows. Happy coding!


## Author

- **Author**: [Shatadip Majumder](https://www.shatadip.com)
- **GitHub**: [Shatadip's GitHub Profile](https://github.com/shatadip)

## Contribution

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/shatadip/Postmann.git).

## License

This project is licensed under the [MIT License](LICENSE).

Happy testing with Postmann!

...