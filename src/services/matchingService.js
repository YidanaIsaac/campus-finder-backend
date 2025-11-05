const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const User = require('../models/User');
const emailService = require('./emailService');

class MatchingService {
  // Find potential matches for a newly reported item
  async findMatches(newItem, itemType) {
    try {
      // Determine opposite type
      const OppositeModel = itemType === 'lost' ? FoundItem : LostItem;
      const oppositeType = itemType === 'lost' ? 'found' : 'lost';

      // Build match query
      const matchQuery = {
        status: 'active'
      };

      // Match by category (required)
      if (newItem.category) {
        matchQuery.category = newItem.category;
      }

      // Find potential matches
      const potentialMatches = await OppositeModel.find(matchQuery)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);

      // Calculate match score for each item
      const matches = potentialMatches.map(item => {
        const score = this.calculateMatchScore(newItem, item, itemType);
        return { item, score };
      });

      // Filter matches with score > 50% and sort by score
      const goodMatches = matches
        .filter(m => m.score > 50)
        .sort((a, b) => b.score - a.score);

      // Send email notifications for good matches
      for (const match of goodMatches) {
        try {
          // Notify the person who reported the potential match
          if (match.item.userId) {
            await emailService.sendItemMatchNotification(
              match.item.userId,
              {
                ...newItem.toObject(),
                status: itemType,
                dateLost: newItem.dateLost || newItem.dateFound,
                dateFound: newItem.dateFound || newItem.dateLost
              },
              itemType
            );
          }

          // Notify the person who just reported the new item
          if (newItem.userId) {
            await emailService.sendItemMatchNotification(
              newItem.userId,
              {
                ...match.item.toObject(),
                status: oppositeType,
                dateLost: match.item.dateLost || match.item.dateFound,
                dateFound: match.item.dateFound || match.item.dateLost
              },
              oppositeType
            );
          }
        } catch (emailError) {
          console.error('Failed to send match notification:', emailError);
        }
      }

      console.log(`Found ${goodMatches.length} good matches for ${itemType} item: ${newItem.itemName}`);
      return goodMatches;
    } catch (error) {
      console.error('Error finding matches:', error);
      return [];
    }
  }

  // Calculate match score between two items (0-100)
  calculateMatchScore(item1, item2, item1Type) {
    let score = 0;

    // Category match (required, 30 points)
    if (item1.category === item2.category) {
      score += 30;
    } else {
      return 0; // No match if categories don't match
    }

    // Location similarity (20 points)
    if (item1.location && item2.location) {
      const loc1 = item1.location.toLowerCase();
      const loc2 = item2.location.toLowerCase();
      if (loc1 === loc2) {
        score += 20;
      } else if (loc1.includes(loc2) || loc2.includes(loc1)) {
        score += 10;
      }
    }

    // Date proximity (20 points) - within 7 days
    const date1 = new Date(item1.dateLost || item1.dateFound);
    const date2 = new Date(item2.dateLost || item2.dateFound);
    const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      score += 20;
    } else if (daysDiff <= 3) {
      score += 15;
    } else if (daysDiff <= 7) {
      score += 10;
    } else if (daysDiff <= 14) {
      score += 5;
    }

    // Description similarity (30 points)
    if (item1.description && item2.description) {
      const desc1 = item1.description.toLowerCase();
      const desc2 = item2.description.toLowerCase();
      
      // Extract keywords (words longer than 3 characters)
      const keywords1 = desc1.match(/\b\w{4,}\b/g) || [];
      const keywords2 = desc2.match(/\b\w{4,}\b/g) || [];
      
      if (keywords1.length > 0 && keywords2.length > 0) {
        const commonKeywords = keywords1.filter(k => keywords2.includes(k));
        const similarity = (commonKeywords.length / Math.max(keywords1.length, keywords2.length)) * 100;
        score += Math.min(30, similarity * 0.3);
      }
    }

    // Item name similarity (bonus)
    if (item1.itemName && item2.itemName) {
      const name1 = item1.itemName.toLowerCase();
      const name2 = item2.itemName.toLowerCase();
      
      if (name1 === name2) {
        score += 10;
      } else if (name1.includes(name2) || name2.includes(name1)) {
        score += 5;
      }
    }

    // Color match (bonus if both have color)
    if (item1.color && item2.color) {
      const color1 = item1.color.toLowerCase();
      const color2 = item2.color.toLowerCase();
      if (color1 === color2 || color1.includes(color2) || color2.includes(color1)) {
        score += 5;
      }
    }

    // Brand match (bonus if both have brand)
    if (item1.brand && item2.brand) {
      const brand1 = item1.brand.toLowerCase();
      const brand2 = item2.brand.toLowerCase();
      if (brand1 === brand2 || brand1.includes(brand2) || brand2.includes(brand1)) {
        score += 5;
      }
    }

    return Math.min(100, Math.round(score));
  }

  // Get match status for an item
  async getMatchesForItem(itemId, itemType) {
    try {
      const ItemModel = itemType === 'lost' ? LostItem : FoundItem;
      const OppositeModel = itemType === 'lost' ? FoundItem : LostItem;

      const item = await ItemModel.findById(itemId);
      if (!item) return [];

      const potentialMatches = await OppositeModel.find({
        category: item.category,
        status: 'active'
      })
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(10);

      const matches = potentialMatches.map(matchItem => {
        const score = this.calculateMatchScore(item, matchItem, itemType);
        return { 
          item: matchItem, 
          score,
          isGoodMatch: score > 50
        };
      });

      return matches.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }
}

module.exports = new MatchingService();
