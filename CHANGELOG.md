## [1.0.4] - 2024-02-04
### Added
- Response Size
- Tooltip for Response Code, Time, Size (Breakup)
- Dark Theme (AtomDark) for better visibility and readability
- Utility Buttons
  - Toggle Line Numbers
  - Toggle Wrap
  - Copy Response
  - Download Response
  - Toggle Theme (Light & Dark)
- Link to Rate Postmann (On Chrome Web Store)

### Changed
- Default response theme to Dark
- Styles
  - Response Status Code, Time, Size (Separate boxes and colors with Font style - Inter)
  - Raw response font changed to IBMPlexMono
  - Tab sizes reduced
- Displaying a message with possible reasons for errors in Headers; previously, nothing was displayed in headers in case of an error while fetching.

### Fixed
- Raw response (fetch and display absolute raw response)
- Clearing previous response code when sending a new request
- Clearing previous response headers and raw response in case of an error while fetching
- Removed backslashes in response headers for inner JSON values.
- Fixed the display of inner JSON values in response headers.

## [1.0.3] - 2024-01-31
### Added
- Support for fetching invalid JSON responses (e.g. https://httpbin.org/stream/2)
- Added a small notification text block using &lt;sup&gt; to inform if the response is Invalid JSON

### Changed
- Parsing JSON as JSON.parse(res.text()), previously JSON was parsed as res.json()
- Styling updated
  - @index.css > min-width: 33em; from /*320px;*/, and min-height: 40em; from /*100vh;*/
  - @PostmannComponent.css > Added .invalidJSON-sup class and added color:white & text-decoration:none to .postmann-tab.active

### Fixed
- No fixes needed, my code rocks!  

## [1.0.2] - 2024-01-28
### Added
- Support for fetching XML responses.
- Support for fetching binary/octet-stream responses.
  - Display length count of the binary response.
  - View decoded binary content.
  - Option to download the binary file.
- Support for fetching plain text files (e.g., robots.txt).
- Support for fetching images (JPEG, PNG, SVG, WebP) with resolution details.
- Support for fetching PDF files.
- Dynamic tab titles in Pretty, Raw, and Headers tabs based on the response type.
  - For JSON response: Pretty, Raw, and Headers tabs.
  - For image response: Image and Headers tabs.
  - For octet-stream response: Binary and Headers tabs.
  - For PDF response: PDF and Headers tabs.
- Switched from if-else statements to switch-case for response type detection, improving extension speed.
- Added india-qr.png for donations from India
- Added "react-modal" dependency, for displaying modal popup if user is clicking on Donate from India, that just shows a QR code to pay
- Added v1.0.2 underneath the Postmann title
- Added Changelog

### Changed

- Made the Donate link dynamic based on the user's location.
  - Users from India will see a modal popup with UPI payment QR code for donation (created with react-modal).
  - Users from other countries will see a plain PayPal link for donation.
- Added country information (country code) retrieval using a free API [https://api.country.is](https://api.country.is).
- Updated version number to 1.0.2 in public/manifest.json and /package.json

### Fixed
- No fixes needed, my code rocks!

## [1.0.1] - 2024-01-21
### Added
- Initial release on Chrome Web Store.
