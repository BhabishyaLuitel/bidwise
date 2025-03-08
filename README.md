# BidWise - Secure and Efficient Online Auction Platform

## Overview
BidWise is an online auction platform designed to facilitate secure and efficient bidding for users. It provides a seamless experience for buyers and sellers, ensuring that all transactions are safe and transparent.

## Features
- **User Registration & Authentication**: Secure sign-up and login with role-based access for buyers, sellers, and admins.
- **Auction Listing & Management**: Sellers can list items with detailed descriptions, images, and bidding information.
- **Real-Time Bidding System**: Users can place live bids with instant updates using WebSockets.
- **Fraud Detection Mechanism**: AI-powered fraud detection to identify and flag suspicious activities.
- **Secure Payment Processing**: Integrated payment gateway (Stripe/PayPal) for smooth transactions.
- **Notifications & Alerts**: Real-time notifications for bids, auction updates, and payment confirmations.
- **User Profiles & Auction History**: Users can track their past bids, listings, and transaction records.
- **Admin Dashboard**: Admins can oversee auctions, manage users, and review flagged transactions.
- **Messaging System**: Direct communication between buyers and sellers through the platform.
- **Time-Zone Adjusted Auctions**: Localized auction start and end times for users.

## Tech Stack
- **Frontend**: React.js for the web UI.
- **Backend**: Laravel (PHP Framework).
- **Database**: MySQL.
- **Cloud Hosting**: AWS or Heroku.
- **Real-Time Bidding**: WebSockets (Laravel Echo).
- **Fraud Detection**: Python (scikit-learn).
- **Security**: SSL/TLS encryption, bcrypt password hashing, and two-factor authentication (2FA).

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Copy the `.env.example` file to `.env` and configure your database settings.
3. Run `composer install` to install PHP dependencies.
4. Run migrations with `php artisan migrate` to set up the database.
5. Seed the database with initial data using `php artisan db:seed`.
6. Start the Laravel server with `php artisan serve`.

### Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install` to install JavaScript dependencies.
3. Start the React application with `npm start`.

### Fraud Detection
1. Navigate to the `fraud_detection` directory.
2. Install required Python packages using `pip install -r requirements.txt`.
3. Run the fraud detection scripts as needed.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.