# DocScan-JSONify

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://github.com/justinjdaniel/docscan-jsonify/actions/workflows/deploy.yml/badge.svg)](https://justinjdaniel.github.io/docscan-jsonify/)

A free, browser-based tool to scan documents with your camera, extract text via OCR, and convert it to meaningful JSON using open-source JavaScript libraries. All processing is done client-side, ensuring your data remains private.

## Features

- **Device Camera Scanning:** Capture documents directly from your browser.
- **Automatic Document Detection:** Uses `jscanify` to find and crop the document from the background.
- **In-Browser OCR:** Leverages `Tesseract.js` to perform OCR without sending data to a server.
- **Data Extraction:** Basic parsing for common fields like `vendor`, `date`, and `total`.
- **JSON Export:** View, copy, or download the extracted data as a structured JSON file.
- **Privacy-Focused:** 100% client-side processing. No data ever leaves your device.
- **Free & Open Source:** Built entirely with free and open-source software.

## How to Use

1.  **Open the Web App:** Navigate to the deployed GitHub Pages URL.
2.  **Allow Camera Access:** Click "Start Camera" and grant the necessary permissions.
3.  **Capture the Document:** Position your document in the frame and click "Capture".
4.  **Processing:** The application will automatically crop the document, perform OCR, and extract the data.
5.  **Review and Export:** The extracted text and resulting JSON will be displayed. You can edit the JSON in the textarea, copy it to your clipboard, or download it as a file.

## Technology Stack

- **HTML5/CSS3/JavaScript:** The core of the application.
- **[jscanify.js](https://github.com/ColonelParrot/jscanify):** For document detection and cropping.
- **[OpenCV.js](https://docs.opencv.org/):** A dependency for `jscanify.js`.
- **[Tesseract.js](https://tesseract.projectnaptha.com/):** For in-browser Optical Character Recognition (OCR).
- **[GitHub Pages](https://pages.github.com/):** For hosting the static web application.
- **[GitHub Actions](https://github.com/features/actions):** For continuous deployment.

## Local Development

To run this project locally, you can simply open the `index.html` file in your web browser. However, due to browser security policies (`CORS`), `Tesseract.js` may not work correctly when loaded from a `file:///` URL.

For full functionality, it's recommended to use a simple local web server:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/docscan-jsonify.git
    cd docscan-jsonify
    ```
2.  **Start a local server:**
    If you have Python 3 installed, you can run:
    ```bash
    python -m http.server
    ```
    Or, if you have Node.js, you can use a simple server package:
    ```bash
    npx serve
    ```
3.  **Open in browser:** Navigate to `http://localhost:8000` (or the port specified by your server).
