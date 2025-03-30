<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sellers = User::where('role', 'seller')->get();
        $categories = [
            'Electronics',
            'Collectibles',
            'Fashion',
            'Home & Garden',
            'Art',
            'Sports',
            'Vehicles',
            'Jewelry',
        ];

        // Create items for each seller
        foreach ($sellers as $seller) {
            // Create 3-5 items per seller
            $numItems = rand(3, 5);
            
            for ($i = 0; $i < $numItems; $i++) {
                $category = $categories[array_rand($categories)];
                $startingPrice = rand(100, 10000);
                $currentBid = $startingPrice;
                $totalBids = rand(0, 15);
                $endTime = now()->addDays(rand(1, 14));
                $status = $endTime > now() ? 'active' : 'ended';

                // If there are bids, adjust current bid
                if ($totalBids > 0) {
                    $currentBid = $startingPrice + rand(100, 1000) * $totalBids;
                }

                Item::create([
                    'title' => $this->generateTitle($category),
                    'description' => $this->generateDescription($category),
                    'images' => $this->generateImages($category),
                    'starting_price' => $startingPrice,
                    'current_bid' => $currentBid,
                    'user_id' => $seller->id,
                    'category' => $category,
                    'end_time' => $endTime,
                    'status' => $status,
                    'total_bids' => $totalBids,
                ]);
            }
        }
    }

    /**
     * Generate a title based on category
     */
    private function generateTitle(string $category): string
    {
        $titles = [
            'Electronics' => [
                'Latest Model Smartphone',
                'High-End Gaming Laptop',
                'Wireless Noise-Canceling Headphones',
                'Smart Home Security System',
                'Professional DSLR Camera',
            ],
            'Collectibles' => [
                'Rare First Edition Comic Book',
                'Vintage Baseball Card Collection',
                'Limited Edition Action Figures',
                'Antique Coin Set',
                'Rare Stamp Collection',
            ],
            'Fashion' => [
                'Designer Leather Handbag',
                'Limited Edition Sneakers',
                'Vintage Designer Watch',
                'Designer Sunglasses',
                'Luxury Silk Scarf',
            ],
            'Home & Garden' => [
                'Antique Wooden Furniture Set',
                'Smart Home Automation System',
                'Professional Kitchen Appliances',
                'Garden Tool Set',
                'Outdoor Patio Furniture',
            ],
            'Art' => [
                'Original Oil Painting',
                'Contemporary Sculpture',
                'Limited Edition Print',
                'Handcrafted Pottery',
                'Digital Art Collection',
            ],
            'Sports' => [
                'Professional Sports Equipment',
                'Autographed Sports Memorabilia',
                'Sports Team Jersey Collection',
                'Fitness Equipment Set',
                'Sports Trading Cards',
            ],
            'Vehicles' => [
                'Classic Car',
                'Vintage Motorcycle',
                'Electric Bicycle',
                'Luxury SUV',
                'Sports Car',
            ],
            'Jewelry' => [
                'Diamond Engagement Ring',
                'Gold Necklace Set',
                'Pearl Earrings',
                'Sapphire Bracelet',
                'Platinum Watch',
            ],
        ];

        return $titles[$category][array_rand($titles[$category])];
    }

    /**
     * Generate a description based on category
     */
    private function generateDescription(string $category): string
    {
        $descriptions = [
            'Electronics' => 'High-quality electronic device in excellent condition. Includes all original accessories and warranty information.',
            'Collectibles' => 'Rare and valuable collectible item in pristine condition. Comes with authentication certificate.',
            'Fashion' => 'Stylish and fashionable item from a renowned designer. Perfect condition with original packaging.',
            'Home & Garden' => 'Beautiful and functional home item. Well-maintained and ready to use.',
            'Art' => 'Unique piece of art that will enhance any space. Created by a talented artist.',
            'Sports' => 'Professional-grade sports equipment or memorabilia. Perfect for enthusiasts and collectors.',
            'Vehicles' => 'Well-maintained vehicle with full service history. Ready for immediate use.',
            'Jewelry' => 'Exquisite piece of jewelry crafted with premium materials. Includes certification.',
        ];

        return $descriptions[$category];
    }

    /**
     * Generate sample images based on category
     */
    private function generateImages(string $category): array
    {
        $images = [
            'Electronics' => [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            ],
            'Collectibles' => [
                'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
            ],
            'Fashion' => [
                'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
            ],
            'Home & Garden' => [
                'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
            ],
            'Art' => [
                'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80',
            ],
            'Sports' => [
                'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
            ],
            'Vehicles' => [
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
            ],
            'Jewelry' => [
                'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        return $images[$category];
    }
}
