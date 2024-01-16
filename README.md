# Postmann
A postman like Chrome extension to quickly fetch response against GET, POST, PUT, DELETE requests

## Concept

Postmann aims to simplify the testing and debugging of APIs by emulating the functionality of a postman. It allows users to effortlessly create and send various types of HTTP requests and view the responses, all within the convenience of their Chrome browser.

## Technologies

Built with React, TypeScript, and Vite.

## Features

- **Request Types:** Easily send GET, POST, PUT, and DELETE requests.
- **User-Friendly Interface:** A simple and intuitive interface for constructing requests with necessary parameters.
- **Response Viewer:** Quickly view and analyze the responses received from the server.
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
   - Choose the desired HTTP request type (GET, POST, PUT, DELETE).
   - Enter the required parameters and URL.
   - Click the "Send" button to dispatch the request.

5. **Viewing Responses:**
   - The extension will display the server's response in a clear and organized manner.
   - JSON responses can be viewed in both raw and prettified formats, enhancing readability and analysis.
   - Analyze the response to ensure the request was processed correctly.

## Author

- **Author**: [Shatadip Majumder](https://www.shatadip.com)
- **GitHub**: [Shatadip's GitHub Profile](https://github.com/shatadip)

## Contribution
## Recommended Test APIs

Explore and test various functionalities using the following public APIs:

1. **Public APIs**
   - Retrieve a list of public APIs cataloged in the project.
   - Sample API URL: [https://api.publicapis.org/entries](https://api.publicapis.org/entries)

2. **Cat Facts**
   - Receive random cat facts via text message every day.
   - Sample API URL: [https://catfact.ninja/fact](https://catfact.ninja/fact)

3. **CoinDesk**
   - View the real-time Bitcoin Price Index (BPI).
   - Sample API URL: [https://api.coindesk.com/v1/bpi/currentprice.json](https://api.coindesk.com/v1/bpi/currentprice.json)

4. **Bored**
   - Find something to do with suggestions for random activities.
   - Sample API URL: [https://www.boredapi.com/api/activity](https://www.boredapi.com/api/activity)

5. **Agify.io**
   - Predict the age of a person based on their name.
   - Sample API URL: [https://api.agify.io?name=meelad](https://api.agify.io?name=meelad)

6. **Genderize.io**
   - Predict the gender of a person based on their name.
   - Sample API URL: [https://api.genderize.io?name=luc](https://api.genderize.io?name=luc)

7. **Nationalize.io**
   - Predict the nationality of a person based on their name.
   - Sample API URL: [https://api.nationalize.io?name=nathaniel](https://api.nationalize.io?name=nathaniel)

8. **Data USA**
   - Retrieve US public data, such as population data.
   - Sample API URL: [https://datausa.io/api/data?drilldowns=Nation&measures=Population](https://datausa.io/api/data?drilldowns=Nation&measures=Population)

9. **Dogs**
   - Brighten your day with random dog images.
   - Sample API URL: [https://dog.ceo/api/breeds/image/random](https://dog.ceo/api/breeds/image/random)

10. **IPify**
    - Get your current IP address.
    - Sample API URL: [https://api.ipify.org?format=json](https://api.ipify.org?format=json)

11. **IPinfo**
    - Retrieve information about a specified IP address.
    - Sample API URL: [https://ipinfo.io/161.185.160.93/geo](https://ipinfo.io/161.185.160.93/geo)

12. **Jokes**
    - Enjoy random jokes or get jokes based on type, such as programming jokes.
    - Sample API URL: [https://official-joke-api.appspot.com/random_joke](https://official-joke-api.appspot.com/random_joke)

Now, you will also receive and be able to view response headers in the API responses.

Feel free to explore and integrate these APIs into your development and testing workflows. Happy coding!

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/shatadip/Postmann.git).

## License

This project is licensed under the [MIT License](LICENSE).

Happy testing with Postmann!
