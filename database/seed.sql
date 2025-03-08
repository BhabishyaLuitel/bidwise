INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$eImiTXuWVxfM8y1y0g5U1u1g1g1g1g1g1g1g1g1g1g1g1g1g1g1', 'admin'),
('Seller User', 'seller@example.com', '$2y$10$eImiTXuWVxfM8y1y0g5U1u1g1g1g1g1g1g1g1g1g1g1g1g1g1g1', 'seller'),
('Buyer User', 'buyer@example.com', '$2y$10$eImiTXuWVxfM8y1y0g5U1u1g1g1g1g1g1g1g1g1g1g1g1g1g1g1', 'buyer');

INSERT INTO auctions (title, description, starting_price, seller_id, end_time) VALUES
('Antique Vase', 'A beautiful antique vase from the 18th century.', 100.00, 2, '2023-12-31 23:59:59'),
('Vintage Watch', 'A classic vintage watch in excellent condition.', 250.00, 2, '2023-12-31 23:59:59');

INSERT INTO bids (auction_id, user_id, bid_amount, created_at) VALUES
(1, 3, 120.00, NOW()),
(1, 3, 130.00, NOW()),
(2, 3, 300.00, NOW());

INSERT INTO transactions (user_id, auction_id, amount, transaction_date) VALUES
(3, 1, 130.00, NOW()),
(3, 2, 300.00, NOW());